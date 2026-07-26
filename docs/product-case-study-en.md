# Chengdu Lens Product Case Study

## 1. Executive Summary

Chengdu Lens is an AI city-discovery agent for first-time international independent travelers visiting Chengdu. It does not solve the question "what attractions exist in Chengdu." It focuses on "which places fit me, why they are trustworthy, and whether I can realistically do them today."

The first product version focuses on one loop:

```text
Taste Profile -> Trusted Discovery -> Evidence Detail -> Personal Collection -> Half-Day Route -> Local Replan
```

User scenarios in this document are research hypotheses. Place data is used to validate demo structure and does not represent live recommendations or business metrics.

## 2. Problem Definition

Chengdu travel information is already overloaded. For international independent travelers, the real difficulty is not lack of content, but high decision cost:

- Content platforms provide abundant inspiration, but authentic experience, promotion, and personal fit are mixed together.
- Map products are strong at navigation, but rarely explain why a place is worth visiting.
- OTA products are strong at transactions and complete trips, but deep city discovery can be flattened into standardized routes.
- General AI can generate itineraries, but often lacks sources, feasibility checks, and uncertainty handling.

The product opportunity is therefore not to "generate more travel guides," but to turn scattered places, content, maps, and user preferences into explainable, saveable, and executable city choices.

## 3. Target User

The first version targets international independent travelers who are visiting Chengdu for the first time, staying for two to four days, primarily using English, and hoping to experience local city life while being unfamiliar with Chinese platforms and on-site rules.

The product does not model users crudely by nationality. It uses the following variables:

- Familiarity with traveling in China
- Language and Chinese-app capability
- Booking, payment, navigation, and on-site communication ability
- Travel motivation: culture, food, urban space, photography, family, Sichuan extension
- Explicit constraints: time, budget, diet, walking ability, companion relationship

Domestic first-time visitors, local residents, family travel, photography, shopping, museums, and accessibility-related scenarios are used as stress tests, but they do not expand the first-version target user.

## 4. Jobs to Be Done

When I arrive in an unfamiliar city, I want to discover a small number of beautiful, tasty, fun, and photogenic places that genuinely fit my taste, understand the recommendation evidence and risks, and combine my saves into a realistic half-day experience, so I do not need to compare across multiple apps or rely only on popularity lists.

## 5. Product Strategy

### Product Bet

Whether a user saves and acts on a recommendation depends not only on whether the place is popular, but on three questions:

1. Why does this place fit me?
2. Is the supporting evidence trustworthy?
3. Can I actually complete it today?

### MVP Includes

- Taste Profile and natural-language request
- Controlled place knowledge base and RAG retrieval
- Separate Personal Fit and Evidence Confidence scores
- Place evidence detail and source links
- Personal Collection
- Case Study section showing product judgment, AI Agent logic, and evidence boundaries
- Half-day route and one local replan

### MVP Excludes

- Hotels, flights, visas, payments, and full transaction flow
- Public content community and UGC publishing
- Group tours, car booking, and guide matching
- Multi-city long-trip planning
- Unauthorized copying of platform reviews or rating aggregation

## 6. Core Experience

The user first completes a lightweight Taste Profile, such as quiet neighborhoods or famous landmarks, traditional culture or contemporary spaces, slow exploration or dense schedule, food-first or culture-first, indoor or outdoor preference.

Example request:

> I have four hours this afternoon. I am staying near Taikoo Li, prefer quiet local neighborhoods, do not want spicy food, and would rather walk than spend time in traffic.

The system returns a small set of candidate places. Each place shows:

- Why this fits
- What to know
- Personal Fit
- Evidence Confidence
- International Relevance
- Local Relevance
- Operational Accessibility
- Source links
- Save / Not for me

Only after the user saves three to four places does the Agent generate a half-day route. If the user says "it started raining" or "I am tired," the system replaces only the affected places and preserves the user's explicitly confirmed choices.

## 7. AI Agent Design

Chengdu Lens uses a single orchestrating Agent instead of splitting into multiple virtual agents just to show complexity. The Agent's job is to turn ambiguous intent into observable task state, then retrieve, validate constraints, and check evidence before recommending.

Agent workflow:

```text
Parse request -> Build task state -> Retrieve candidates -> Check evidence
-> Validate hard constraints -> Rank and explain -> Save -> Route -> Local replan
```

Agent tools:

- Place Knowledge Base / RAG
- Evidence Index
- Map Adapter
- Weather Adapter
- Opening Status Checker
- International Access Checker
- Preference Memory
- Collection State

The LLM handles intent understanding, tag normalization, and explanatory copy. Deterministic rules handle hard constraints, exclusions, scoring boundaries, and route feasibility. The demo does not show hidden chain-of-thought; it only shows structured decision summaries.

See [AI Agent System Design](agent-system-design-en.md) for the full system design.

## 8. Data and Trust Model

The recommendation is not a single popularity score. It separates four judgments:

- **Personal Fit**: whether the place fits the current user and current situation.
- **Evidence Confidence**: whether the evidence is reliable, fresh, and complete.
- **International Relevance**: whether international travelers can understand it or see distinctive value in it.
- **Operational Accessibility**: whether language, booking, payment, navigation, and on-site rules are feasible.

Hard constraints are handled as a Gate first and do not participate in weighted compensation. Allergy, safety, opening status, return time, or infeasible booking conflicts lead to exclusion or confirmation, not being overridden by a high fit score.

Data-source strategy:

- Official sources support facts such as opening hours, booking, tickets, and rules.
- International traveler sources support understanding of cross-cultural interest and friction.
- Chinese platform links support local relevance and long-tail discovery, but the product does not copy reviews, avatars, usernames, or unauthorized ratings.
- Information that cannot be confirmed must be marked as needing confirmation.

See [Research & Evidence Appendix](research-evidence-appendix-en.md) for research and evidence details.

## 9. Metrics and Evaluation

### Product Metrics

- Activation: completes Taste Profile and submits a request.
- Discovery Success: saves at least one place after viewing evidence detail.
- Trust Engagement: opens sources, checks risks, or reads "not suitable for" conditions.
- Collection Conversion: generates a route after saving three to four places.
- Replan Success: accepts a local replacement after conditions change.

### Agent Evaluation

- Constraint pass rate: whether hard-conflict places are correctly excluded.
- Evidence grounding rate: whether recommendation reasons can be traced to data fields.
- Clarification quality: whether the Agent asks only when key hard constraints are missing.
- Replanning stability: whether confirmed choices are preserved and only affected parts are replaced.
- Red-line failure rate: whether unsupported real-time status, fabricated sources, or non-compliant data use appears.

## 10. Execution Plan

| Phase | Goal | Deliverable |
|---|---|---|
| Phase 1 | Validate product judgment | Documents, scenarios, data contract, demo specification |
| Phase 2 | Build demonstrable demo | Single-page website, local data, 8 places, Ask AI, Case Study |
| Phase 3 | Add real evidence | Lightweight interviews, usability testing, place source registration |
| Phase 4 | Explore businessization | Curated Collections, merchant partnerships, Sichuan extension routes |

## 11. Key Trade-Offs

- International travelers instead of all travelers: avoid generic personas and highlight international product judgment.
- Discovery and saving instead of transactions: validate decision value before considering supply and commercial loops.
- Single-Agent orchestration instead of multi-Agent: keep responsibilities explainable, evaluable, and demonstrable.
- Source links instead of copied platform content: reduce compliance risk and increase portfolio credibility.

## 12. Limitations

- Current user scenarios are testable hypotheses, not real interview data.
- Place data has not yet completed public-level source registration.
- Map, weather, and real-time opening status use simulated adapters in the demo.
- Product value has not yet been validated through real activation rate, save rate, or route conversion rate.
