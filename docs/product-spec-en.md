# Chengdu Lens · Product specification

| Item | Detail |
| --- | --- |
| Version | v0.4 · portfolio prototype |
| Status | "Current version" items are built; items marked "Planned" are not |
| Owner | Product manager (me): problem framing, requirements, interaction design, metrics, AI boundaries and prototype delivery |
| Related | [Demo acceptance](demo-spec-en.md) · [Roadmap](product-roadmap-en.md) · [Metrics](product-metrics-en.md) · [Agent design](agent-system-design-en.md) · [中文版](product-spec-cn.md) |

## 1. Problem

First-time international visitors to Chengdu are not short of guides. They lack a quick answer to "given my time, location and limits, where next?". Content platforms inspire but are hard to trust; maps navigate but don't explain why; OTAs sell standard tours; general AI invents opening hours, train times and availability.

**The product solves the decision, not the content:** with minimal input, the traveler ends up with a plan they chose, can act on, and knows what still needs checking.

## 2. Users and scenarios

**Launch audience:** English-first independent visitors on a first two-to-four-day trip to Chengdu, unfamiliar with Chinese apps, reservations and payments.

| Scenario | Typical words | Product response |
| --- | --- | --- |
| A. Spontaneous walk | "Near Wenshu, two hours, somewhere for tea" | A 1–3 hour surprise route; shuffle or carry it into a plan |
| B. Plan today | "Four hours from Taikoo Li, no spicy food" | Pick places → choose 1 of 3 dinners → (if needed) 1 of 3 hotels |
| C. Today plus a regional day | "Staying in Chengdu tonight, Jiuzhaigou tomorrow" | B plus tomorrow: rail, onward transfer, stay and dinner, each explained separately |

Each scenario carries a different cognitive load; none is presented as the default.

## 3. Principles

1. **Never decide what the traveler hasn't said.** Time, start, tonight's stay and tomorrow must be stated or tapped; ask only for what is missing. A regional destination appears only after the traveler picks it.
2. **The traveler chooses; AI fills gaps.** Every step can be chosen manually or completed by AI, which never overwrites existing choices.
3. **Separate facts from advice.** Prices, schedules, hours and availability link to official sources rather than model output.
4. **Payment is not confirmation.** Transactions are local simulations that include "paid, but hotel failed → refund".
5. **Reversible.** Fair-weather and rain selections are stored separately; tomorrow can be added or removed without touching today.

## 4. Information architecture

```text
Landing: three ways to use it (wander / plan today / add tomorrow if wanted)
  ├─ Wander: where I am + mood → surprise route → [shuffle] / [build my day around this]
  └─ Plan my trip: sentence or taps → brief complete → [AI plans it] or [step by step]
        └─ Workbench: places → dinner → tonight's hotel* → tomorrow · Jiuzhaigou* → summary
              └─ Booking drawer (current destination only) → demo quote → confirm → pay / fail / refund
Tail: product intro → PM view (metrics, AI governance) → GitHub docs
(* only when the traveler asked for it)
```

## 5. Functional requirements

### 5.1 Landing
- Shows the three things the product can do, each opening its mode; no preset itinerary, duration or destination.
- Live weather pill (Open-Meteo) with a one-tap correction.

### 5.2 Wander
- Inputs: start (Taikoo Li / Tianfu Square / Wenshu / Wuhou–Jinli) and mood (tea / old lanes / indoors).
- Output: 2–3 stops, estimated total ≤ 180 min; indoor or covered stops only when raining.
- "Build my day around this" carries only the route and start; the traveler still states time, tonight and tomorrow.

### 5.3 Brief capture (sentence + taps)
| Field | Required | Options | Parsing example |
| --- | --- | --- | --- |
| Time | Yes | 2 h / half day / full day / any hours in text | "three hours" → 180 min |
| Start | Yes | Four areas | "from Wenshu" |
| Tonight | Yes | Help me pick a hotel / already sorted | "hotel already booked" → no hotel step |
| Tomorrow | Yes | Just today / Jiuzhaigou | "tomorrow undecided" → today only |
| Food | Optional | No spice, vegetarian | Re-ranks and filters dinner |

- Typing updates the chips live; chips can always correct the parse. Missing fields are flagged, start buttons stay disabled, and the UI lists what is still needed.
- Unsupported destinations (e.g. Leshan, Dujiangyan) are called out instead of silently mapped to Jiuzhaigou.
- Three example sentences from different scenarios are offered as inspiration and fill in only on tap.

### 5.4 Workbench
- Steps are generated per brief: no hotel step without a Chengdu stay, no Jiuzhaigou step without a regional day.
- Places respect the time budget ("Won't fit"); rain shows indoor places while sunny picks are kept.
- Dinner: up to three, nearest to the last stop, honoring diet.
- Hotels and tomorrow: three options each; transport split into rail → onward transfer → hotel, with no promised times or pickups.
- Summary: save on device; add Jiuzhaigou tomorrow, or remove it, without changing today.

### 5.5 Booking and simulated checkout
- The drawer shows only the destination of that day; Jiuzhaigou never appears unless chosen.
- Separate `PaymentState` and `BookingState`; paid ≠ confirmed; failures end in a simulated refund with no charge.

### 5.6 Free-text AI
- Uses curated place records and the current conversation; outages surface as real errors, never as scripted answers posing as live AI.

## 6. Non-functional requirements
- Full parity in English and Chinese; the whole flow works from 360 px wide.
- Guided flows and checkout do not depend on AI or payment services, so the portfolio demo is reproducible.
- Drafts are stored in the browser; no personal data is collected.

## 7. Metrics

| Level | Metric | Definition |
| --- | --- | --- |
| North star | Actionable plan rate | Travelers who reach and save a summary ÷ travelers who start a brief |
| Diagnostics | Brief completion, time to first plan, AI-fill share, regional add-on rate, wander carry-over rate | Where people drop off; whether they trust manual or AI-filled plans |
| Guardrails | Fabricated stock or schedules, misleading "confirmed" copy, silent changes to chosen stops | Any occurrence blocks release |

See [Metrics](product-metrics-en.md).

## 8. Acceptance criteria (excerpt)

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | First visit | Viewing the landing and planner | No preset duration, start or Jiuzhaigou trip; start buttons disabled |
| 2 | Brief: full day, Tianfu Square, hotel sorted, just today | AI plans it | Steps are places, dinner, summary only |
| 3 | Summary with tomorrow open | Add Jiuzhaigou | Tomorrow step appears, today's stops unchanged; removing restores |
| 4 | A wander route | Carried into a plan | Start and stops carried; the other three fields still required |
| 5 | Sentence mentions Leshan | Typing | "Not covered" message shown |
| 6 | Any booking | Payment succeeds, supplier fails | Simulated refund and cancellation; no real charge |

These rules are covered by `src/lib/travel-plan.test.ts` and `src/lib/journey.test.ts`.

## 9. Out of scope and risks
- Out of scope: real payments and bookings, live maps / stock / timetables, regional routes beyond Jiuzhaigou, accounts and social features.
- Risks: route times are grid estimates; weather falls back to manual if the API fails; curated records need periodic review.

## 10. Next iterations (planned)
1. A second regional route (Dujiangyan / Qingchengshan) to prove destinations are pluggable.
2. Source owner and verification date per place record; stale records downgrade to "verify".
3. Five usability sessions and an offline AI evaluation set as the gate to another city.
