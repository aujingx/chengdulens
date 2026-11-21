# Metrics & AI Governance

## North star
**Itinerary Execution Rate**: share of users who save a route or verify at least one official source after a plan is generated. Chat turns are not used — more talk is not more value.

## Core funnel
1. First-screen intent rate
2. Preference confirm rate (pick or delegate)
3. Feasible route rate (fits time, no closures)
4. Official verify / booking click rate

## Guardrails
| Metric | Target |
|---|---|
| Factual errors (hours, prices) | ≤ 1% |
| Closed venue scheduled | 0 |
| Booking shown for unselected destination | 0 |
| Paid but failed, not refunded | 0 |

## Layers: rules before generation
- **Deterministic rules**: route time, rain swaps, booking scope, payment state. Testable and reproducible.
- **Curated knowledge**: places, nearby picks, official links with sources.
- **AI language layer**: intent, trade-off explanations, open Q&A; never triggers booking or payment.

## AI evaluation criteria
| Dimension | Check |
|---|---|
| Accuracy | Cites curated facts only, else points to official check |
| Feasibility | Total route time fits available time |
| Scope | Model output never triggers booking or payment |
| Culture & diet | Respects no-spice, vegetarian preferences |

See [agent-evaluation-cases-en.md](agent-evaluation-cases-en.md). Every prompt or model change must pass the eval set with all guardrails met before release.
