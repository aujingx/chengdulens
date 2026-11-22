# Chengdu Lens Product Case Study

## 1. Executive Summary

| | |
|---|---|
| **Target** | First-time international visitors in Chengdu with limited familiarity with Chinese travel apps. |
| **Problem** | Plenty of content, but no quick way to judge personal fit, source quality, and what is practical today. |
| **Product bet** | A recommendation is more likely to be saved when fit, evidence, and feasibility are visible. |
| **My role** | Product strategy, user scenarios, Agent and RAG design, UX, and bilingual demo delivery. |
| **Shipped** | Eight Chengdu places, saves and rain replanning; spontaneous walks and a brief-driven planner that asks for time, stay and tomorrow before planning, with an optional Jiuzhaigou day with destination-scoped booking and simulated refunds. |
| **Next gate** | 5 usability tests and an offline Agent evaluation set before expanding to another city. |

First product loop:

```text
Taste Profile -> Trusted Discovery -> Evidence Detail -> Personal Collection -> Half-Day Route -> Local Replan
```

[Product spec](product-spec-en.md) · [Demo walkthrough](demo-spec-en.md) · [Full product roadmap and validation gates](product-roadmap-en.md)

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

### Shipped and not shipped

Shipped: curated places, preferences and saves, route estimates, explicit rain-plan approval and a clearly labeled city-to-region guided journey. Out of scope: actual payment, live inventory or pricing, open-ended nationwide coverage and a user-content community.

## 6. Core Experience

Start with four hours near Taikoo Li: where to walk, what to do if it rains, and how to ask for non-spicy food. Once the traveler chooses Jiuzhaigou, explain tomorrow’s rail, road transfer and overnight plan before opening options for that destination. Chengdu offers a table-request simulation; Jiuzhaigou demonstrates hotel failure and refund. Payment is not confirmation, and the railway station is not the park entrance.

## 7. AI Agent Design

The prototype uses one concierge: free-text chat takes curated records, preferences and conversation context; the guided walkthrough does not depend on the model. Booking scope comes from user actions, not model output. The UI surfaces evidence, risks and outstanding checks, not hidden reasoning. Full RAG, an evidence index, live map/weather adapters and automated feasibility checks are future design, not shipped tools.

[AI Agent System Design](agent-system-design-en.md)

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
- The demo has no live map, weather, hours or inventory integration.
- Product value has not yet been validated through real activation rate, save rate, or route conversion rate.
