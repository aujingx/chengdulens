import { createFileRoute } from "@tanstack/react-router";
import { places } from "@/data/places";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function buildSystemPrompt(profileText?: string, savedIds?: string[]) {
  const knowledge = places
    .map((p) => {
      const nearby = p.nearby.map((n) => `${n.name} (${n.kind}, ${n.walkMin}min: ${n.note})`).join("; ");
      return `- ${p.name} / ${p.zhName} · ${p.category} · ${p.area}
  Fit: ${p.whyFits}
  Intro: ${p.intro}
  Ticket: ${p.ticket.price}. Hours: ${p.ticket.hours}. Booking: ${p.ticket.bookingUrl ?? "on-site only"}.
  Transit: ${p.transit.metro} (${p.transit.walkMin} min walk).
  Best time: ${p.bestTime}
  Indoor: ${p.indoor}. Spice risk: ${p.spiceRisk}. Duration: ${p.duration} min.
  Watch out: ${p.risk}
  Nearby: ${nearby}`;
    })
    .join("\n\n");

  const saved = savedIds?.length
    ? `The traveler has already saved: ${savedIds
        .map((id) => places.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(", ")}.`
    : "The traveler has not saved anywhere yet.";

  return `You are Chengdu Lens, a warm, concise AI travel concierge for a first-time international visitor to Chengdu, China.

STYLE
- Reply in the same language the user writes (English or Chinese).
- Warm, honest, specific. Never generic.
- Prefer short paragraphs and small markdown lists. Bold key names.
- If a claim needs on-site confirmation (hours, booking, English signage), say so.
- Never invent places outside the knowledge base below. If asked about something not in it, say you only cover these 8 curated places for this demo, and offer the closest match.

TRAVELER CONTEXT
${profileText ?? "No taste profile provided yet."}
${saved}

KNOWLEDGE BASE (only these 8 places exist in this demo)
${knowledge}

TASKS YOU CAN DO
- Recommend which places fit the traveler's taste, and why.
- Suggest a rainy-day backup swap.
- Propose a walkable order among saved places, with rough timings.
- Answer practical questions: tickets, metro, opening hours, spice risk, photogenic timing.
- Nearby food, cafe, or shop recommendations pulled from the knowledge base.

Keep answers under ~180 words unless the user asks for a full plan.`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("LOVABLE_API_KEY not configured", { status: 500 });
        }

        let payload: {
          messages: ChatMessage[];
          profileText?: string;
          savedIds?: string[];
        };
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const { messages, profileText, savedIds } = payload;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const body = {
          model: "openai/gpt-5.5",
          reasoning_effort: "none",
          stream: true,
          messages: [
            { role: "system", content: buildSystemPrompt(profileText, savedIds) },
            ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
          ],
        };

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify(body),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          if (upstream.status === 429) {
            return new Response("Rate limit — please try again in a moment.", { status: 429 });
          }
          if (upstream.status === 402) {
            return new Response("AI credits exhausted. Add credits in your Lovable workspace.", { status: 402 });
          }
          return new Response(text || "Upstream error", { status: upstream.status });
        }

        // Transform OpenAI-style SSE into a plain text stream of content deltas.
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = upstream.body.getReader();

        const stream = new ReadableStream({
          async start(controller) {
            let buffer = "";
            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const raw of lines) {
                  const line = raw.trim();
                  if (!line.startsWith("data:")) continue;
                  const data = line.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(data);
                    const delta: string | undefined =
                      parsed?.choices?.[0]?.delta?.content ?? parsed?.choices?.[0]?.message?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    // ignore malformed chunk
                  }
                }
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
          cancel() {
            reader.cancel().catch(() => {});
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
