# Chengdu Lens · Product strategy and roadmap

**Status: proposal.** This describes future product and operating choices, not shipped or validated capabilities. [Current demo](demo-spec-en.md) · [Case study](product-case-study-en.md)

## Audience, job and promise

Start with English-first independent visitors spending two to four days on a first trip to Chengdu. The first moment to win: a traveler arrives with an afternoon to spare and is unsure what to eat, what needs a reservation and how to reach tomorrow’s stop. The job is not “give me ten recommendations”; it is “help me decide on a plan I can act on, and show what I still need to check.” Broad destination search, travel social features and direct transactions are out of scope at launch.

My role: define the initial audience and scenario, set the product hypothesis, design boundaries around evidence, itinerary and fulfillment, and ship the bilingual prototype. Interviews, experiments and partnerships described here are planned, not completed research.

| Decision | Trade-off | What could change the decision |
| --- | --- | --- |
| Prove continuity with Chengdu and one regional corridor | No nationwide breadth or unrestricted Q&A | Add a second corridor if repeated lost trips are attributable to coverage |
| Treat time, diet and mobility as constraints; show source confidence separately | No deceptively precise composite score | If users miss verification cues, improve evidence presentation before adding scores |
| Give official handoffs priority; simulate failures before charging | No early transaction commission | Consider integration only if redirects dominate drop-off and inventory, refund SLA and support can be validated |

## Full product, from decision to fulfillment

1. **Plan:** Capture starting point, date, hours, diet and mobility. Separate fixed constraints from flexible preferences and maintain one itinerary by day. Ask only the question needed to resolve an actionable ambiguity.
2. **Ground:** Link factual claims to a source, verification date and freshness. Separate experiential judgment. If data is stale or unavailable, direct users to verification instead of inventing inventory, prices, schedules or transfers.
3. **Execute:** Separate itinerary drafts from confirmed choices. Propose only the rain-affected changes and preserve the original. Model rail, onward road transfer, last mile, and hotel-to-park connections separately.
4. **Hand off:** Start with official channels. A future transaction requires confirmed destination, date and terms. Payment and supplier confirmation are different states; a charge without fulfillment must trigger compensation, event logging, reconciliation and human escalation. The current prototype never charges.

| Stage | Delivery | Gate / stop condition |
| --- | --- | --- |
| Prototype (current) | Curated content, one continuous conversation, guided journey without live AI, local checkout simulation | Verify both languages, destination isolation and no actual charge |
| Chengdu pilot | 20 source-owned records with verification dates, task-based usability sessions and offline AI evaluations | In five formative sessions, at least four people finish unaided and identify what to verify; fabricated inventory, safety guarantees or confirmation block expansion |
| Sichuan corridor | Model rail stops, transfers, park entry and overnight choices; assess licensed maps and availability | Document source ownership, expiry and safe fallbacks; fix transfer mismatches before adding coverage |
| Limited fulfillment pilot (optional) | One service type and one supplier; confirmations, refunds, escalation and reconciliation | Validate fees, refund SLA, security and compliance; retain official handoff if refunds cannot be completed or unit economics are unattractive |

## Measurement

- **Primary: actionable plan rate** = travelers who independently select a plan and can describe its first transport leg and outstanding checks divided by those who start planning. Five sessions identify friction; they do not establish a conversion benchmark.
- **Diagnostics:** time to first actionable plan, misunderstood transfers, abandonment points, and the share of operational claims with traceable sources. Keep and rerun counterexamples rather than optimizing conversation volume.
- **Guardrails:** fabricated inventory, misleading charge/confirmation language and silent changes to confirmed stops block release. In a future transaction pilot, also measure supplier failures, refund completion time and support cost per order.
