# Chengdu Lens · Demo acceptance

The [product roadmap](product-roadmap-en.md) is a proposal. This page covers the implemented prototype only.

## Scenario and walkthrough

A first-time international visitor has four hours near Taikoo Li this afternoon, prefers easy walking and avoids spicy food. They can continue the same trip to Jiuzhaigou tomorrow; it is not a separate case.

| Action | Expected result |
| --- | --- |
| From the homepage, choose Try demo and Start the guided trip | The conversation shows Taikoo Li, Daci Temple, Fangsuo, dinner guidance and a rain option, labeled as a guided demo |
| Open Chengdu booking options | Only a Chengdu table-request simulation appears. It confirms that nothing was sent |
| Choose Go to Jiuzhaigou tomorrow | Today's conversation remains; tomorrow gains rail, an onward road transfer and overnight guidance, not promised train times or availability |
| Open Jiuzhaigou booking options | Only related hotel simulation and official rail and park links appear |
| Get a demo price → confirm → simulate payment success with hotel failure → refund | The booking remains unconfirmed and ends cancelled with a simulated refund. No real order or charge |
| Type Help me book or name a destination | Default to Chengdu unless a destination was selected. Clarify when multiple destinations are mentioned |
| Make live AI unavailable | The guided journey and checkout remain usable. Free-text chat reports the problem rather than presenting a scripted answer as live AI |
| Switch to Chinese and repeat on a narrow screen | The same entry, actions and outcomes are usable in both languages |

## Additional paths and limits

- Browse eight source-linked Chengdu places; view nearby recommendations and transport. Save at least three to build an estimate. Confirm proposed rain swaps before they are applied; keep must-visit stops.
- Free-text questions go to live AI when available, with curated records, preferences and conversation context. There is no live routing, weather or stock integration.
- Official links are for independent verification. Do not treat demo prices, unverified schedules, availability or transfers as market facts.
- Walkthrough checks are not user research or evidence of commercial readiness.
