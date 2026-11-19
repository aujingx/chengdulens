import { useState } from "react";
import { ExternalLink, Hotel, Train, Ticket, Utensils, Loader2 } from "lucide-react";
import { CATALOG, newIntent, reduce, resetPayment, fmtMoney, type CatalogItem, type Intent, type Event } from "@/lib/booking";
import { useApp } from "@/lib/store";

const ICON = { hotel: Hotel, train: Train, ticket: Ticket, restaurant: Utensils };

export function BookingPanel() {
  return (
    <div className="not-prose mt-3 space-y-3">
      {CATALOG.map((item) => (
        <BookingCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function BookingCard({ item }: { item: CatalogItem }) {
  const zh = useApp((s) => s.lang) === "zh";
  const [intent, setIntent] = useState<Intent>(() => newIntent(item.id, item.mode));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const dispatch = (e: Event) => setIntent((i) => reduce(i, e));
  const Icon = ICON[item.service];

  async function getQuote() {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quote", itemId: item.id }),
      });
      const q = await r.json();
      if (!r.ok) throw new Error(q.error);
      dispatch({ type: "QUOTE_OK", quote: q });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function pay(outcome: "ok" | "cancel" | "fail" | "provider_fail") {
    if (busy) return;
    setBusy(true);
    dispatch({ type: "PAY_STARTED" });
    setTimeout(() => {
      if (outcome === "cancel") dispatch({ type: "PAY_CANCELLED" });
      else if (outcome === "fail") dispatch({ type: "PAY_FAILED" });
      else {
        dispatch({ type: "PAY_CAPTURED" });
        if (outcome === "ok") dispatch({ type: "PROVIDER_ACCEPTED", demoReference: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
        else dispatch({ type: "PROVIDER_FAILED" });
      }
      setBusy(false);
    }, 900);
  }

  const L = (en: string, cn: string) => (zh ? cn : en);
  const btn = "rounded-full px-3 py-1.5 text-xs font-semibold";

  return (
    <div className="rounded-2xl border border-border/60 bg-cream/40 p-4 text-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-background"><Icon className="h-4 w-4 text-coral" /></span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{zh ? item.titleZh : item.title}</p>
          <p className="text-xs text-muted-foreground">{item.provider} · {item.date} · {item.guests} {L("guests", "人")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{zh ? item.cancellationZh : item.cancellation}</p>
          {item.transfer && <p className="mt-1 text-xs text-foreground">🚐 {zh ? item.transfer.noteZh : item.transfer.note}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.mode === "provider_hosted" && item.externalUrl && (
          <a href={item.externalUrl} target="_blank" rel="noreferrer" className={`${btn} inline-flex items-center gap-1 bg-foreground text-background`}>
            {L("Book on official site", "前往官方渠道预订")} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {item.mode === "no_prepayment" && (
          intent.bookingState === "confirmed" || intent.history.includes("requested")
            ? <span className="text-xs text-leaf">{L("Table request sent (demo) — restaurant must confirm.", "已发送订位请求（演示）——需餐厅确认。")}</span>
            : <button className={`${btn} bg-foreground text-background`} onClick={() => setIntent((i) => ({ ...i, history: [...i.history, "requested"] }))}>{L("Request a table", "发送订位请求")}</button>
        )}

        {item.mode === "paypal_simulation" && (
          <>
            <span className="rounded-full bg-sun/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Simulated PayPal Checkout</span>
            {intent.bookingState === "draft" && (
              <button disabled={busy} className={`${btn} bg-foreground text-background`} onClick={getQuote}>
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : L("Get price", "获取报价")}
              </button>
            )}
            {intent.bookingState === "quote_validated" && intent.quote && (
              <>
                <span className="font-semibold">{fmtMoney(intent.quote.amountMinor, intent.quote.currency)}</span>
                <span className="text-xs text-muted-foreground">{L("incl. taxes, server price", "含税，服务器报价")}</span>
                <button className={`${btn} bg-coral text-coral-foreground`} onClick={() => dispatch({ type: "USER_CONFIRMED" })}>{L("Confirm & pay", "确认并付款")}</button>
              </>
            )}
            {intent.bookingState === "awaiting_payment" && intent.paymentState !== "pending" && (
              intent.paymentState === "failed" || intent.paymentState === "cancelled" ? (
                <>
                  <span className="text-xs text-destructive">{intent.paymentState === "failed" ? L("Payment failed. Nothing was charged.", "付款失败，未扣款。") : L("You cancelled. Nothing was charged.", "已取消，未扣款。")}</span>
                  <button className={`${btn} border border-border`} onClick={() => setIntent(resetPayment)}>{L("Try again", "重试")}</button>
                </>
              ) : (
                <>
                  <button disabled={busy} className={`${btn} bg-foreground text-background`} onClick={() => pay("ok")}>{L("Pay with PayPal", "PayPal 付款")}</button>
                  <span className="text-[10px] text-muted-foreground">{L("Test:", "测试：")}</span>
                  <button className={`${btn} border border-border`} onClick={() => pay("cancel")}>{L("Cancel", "取消")}</button>
                  <button className={`${btn} border border-border`} onClick={() => pay("fail")}>{L("Card declined", "付款失败")}</button>
                  <button className={`${btn} border border-border`} onClick={() => pay("provider_fail")}>{L("Paid, hotel fails", "已付款但订房失败")}</button>
                </>
              )
            )}
            {intent.paymentState === "pending" && <span className="inline-flex items-center gap-1 text-xs"><Loader2 className="h-3 w-3 animate-spin" />{L("Processing payment…", "正在处理付款…")}</span>}
            {intent.bookingState === "confirmed" && (
              <span className="text-xs text-leaf">{L(`Paid · booking confirmed (demo ref ${intent.demoReference}). Not a real reservation.`, `已付款 · 预订已确认（演示编号 ${intent.demoReference}），并非真实预订。`)}</span>
            )}
            {intent.bookingState === "failed" && intent.paymentState === "captured" && (
              <>
                <span className="text-xs text-destructive">{L("Payment captured but the hotel could not confirm. You're owed a refund.", "已扣款但酒店未能确认，你将获得退款。")}</span>
                <button className={`${btn} bg-foreground text-background`} onClick={() => { dispatch({ type: "REFUND_STARTED" }); setTimeout(() => dispatch({ type: "REFUND_DONE" }), 900); }}>{L("Start refund", "发起退款")}</button>
              </>
            )}
            {intent.paymentState === "refund_pending" && <span className="text-xs">{L("Refund in progress…", "退款处理中…")}</span>}
            {intent.paymentState === "refunded" && <span className="text-xs text-leaf">{L("Refunded (simulated). Booking cancelled.", "已退款（模拟），预订已取消。")}</span>}
          </>
        )}
      </div>
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
    </div>
  );
}
