import { createFileRoute } from "@tanstack/react-router";
import { CATALOG } from "@/lib/booking";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/paypal";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

async function paypal(path: string, init: RequestInit = {}) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": process.env.PAYPAL_API_KEY ?? "",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal ${res.status}: ${text}`);
  return JSON.parse(text);
}

/**
 * Server-side quote + optional PayPal Sandbox adapter.
 * Price always comes from the server catalog — the client never sends an amount.
 */
export const Route = createFileRoute("/api/booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { action?: string; itemId?: string; orderId?: string; requestId?: string };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        const sandboxReady = Boolean(process.env.PAYPAL_API_KEY && process.env.LOVABLE_API_KEY);

        if (body.action === "mode") return json({ paypalSandbox: sandboxReady });

        const item = CATALOG.find((c) => c.id === body.itemId);
        if (!item) return json({ error: "Unknown item" }, 404);

        if (body.action === "quote") {
          if (item.amountMinor == null || !item.currency) return json({ error: "No platform payment for this item" }, 400);
          return json({
            quoteId: `q_${item.id}_${Date.now()}`,
            itemId: item.id,
            amountMinor: item.amountMinor + (item.taxesMinor ?? 0),
            currency: item.currency,
            expiresAt: Date.now() + 15 * 60_000,
            demo: true,
          });
        }

        if (!sandboxReady) return json({ error: "PayPal Sandbox not configured" }, 400);
        const requestId = typeof body.requestId === "string" && body.requestId.length < 80 ? body.requestId : crypto.randomUUID();

        try {
          if (body.action === "paypal_create") {
            const total = ((item.amountMinor ?? 0) + (item.taxesMinor ?? 0)) / 100;
            const order = await paypal("/v2/checkout/orders", {
              method: "POST",
              headers: { "PayPal-Request-Id": requestId },
              body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{ reference_id: item.id, description: `DEMO ${item.title}`.slice(0, 120), amount: { currency_code: item.currency, value: total.toFixed(2) } }],
              }),
            });
            return json({ orderId: order.id });
          }
          if (body.action === "paypal_capture" && body.orderId) {
            const captured = await paypal(`/v2/checkout/orders/${encodeURIComponent(body.orderId)}/capture`, {
              method: "POST",
              headers: { "PayPal-Request-Id": requestId },
            });
            const unit = captured.purchase_units?.[0]?.payments?.captures?.[0];
            const expected = (((item.amountMinor ?? 0) + (item.taxesMinor ?? 0)) / 100).toFixed(2);
            const ok = captured.status === "COMPLETED" && unit?.amount?.value === expected && unit?.amount?.currency_code === item.currency;
            return json({ status: ok ? "captured" : "mismatch", captureId: unit?.id ?? null });
          }
        } catch (e) {
          return json({ error: (e as Error).message }, 502);
        }
        return json({ error: "Unknown action" }, 400);
      },
    },
  },
});
