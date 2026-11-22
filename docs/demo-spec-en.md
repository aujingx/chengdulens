# Chengdu Lens · Demo acceptance

The [product specification](product-spec-en.md) defines the full requirements and the [roadmap](product-roadmap-en.md) is a proposal. This page covers the implemented prototype only.

## Walkthrough

The landing page presets no itinerary. Travelers choose "Just wander" or "Plan my trip", state or tap their time, start, tonight and tomorrow, then pick stops themselves or let AI fill them.

| Action | Expected result |
| --- | --- |
| Open the homepage | Three ways to use the product; no preset duration, start or Jiuzhaigou trip |
| Wander: pick Wenshu and a mood | 2–3 stops within about three hours; Shuffle swaps it; rain shows indoor stops only |
| Build my day around this | Plan my trip opens with start and stops carried; other fields still marked to pick |
| Plan my trip with nothing filled | Both start buttons disabled, with the missing fields listed |
| Type "Full day from Tianfu Square, hotel already booked, tomorrow undecided" and let AI plan | Only Places → Dinner → Summary; no hotel or Jiuzhaigou |
| Add Jiuzhaigou tomorrow from the summary | Tomorrow step appears with rail, transfer, stay and dinner choices; today unchanged; Remove this day restores |
| Open Bookings & official checks for a day | Only that day's destination appears |
| Demo price → confirm → paid but hotel failed → refund | Simulated refund and cancellation; no real order or charge |
| Mention an uncovered place such as Leshan | A "not covered" message; never silently replaced by Jiuzhaigou |
| Switch language; repeat on a narrow screen | Same entries, actions and outcomes in both languages |

## Scope
- Nine curated Chengdu places with sources, nearby picks and transport; Jiuzhaigou is the only regional route.
- Live Open-Meteo weather with manual correction; route times are estimates.
- Official links are for verification; demo prices are not market prices. Walkthrough checks are not user research.
