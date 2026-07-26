# Chengdu Lens Research & Evidence Appendix

## 1. Evidence Status

The public materials for this project are for portfolio use only. All materials must separate four types of information:

| Type | Allowed Use | Not Allowed Use |
|---|---|---|
| Verified secondary facts | Support problem context and design constraints | Cannot be treated as product results |
| Research hypotheses | Design demo scenarios and test tasks | Cannot be written as user interview findings |
| Simulated data | Validate interaction, fields, and state machine | Cannot be described as real-time ratings or real user behavior |
| Future validation plan | Show next-step method | Cannot be described as completed validation |

The document does not contain real user interview samples, so it does not use fabricated user quotes.

## 2. Research Questions

Core questions:

1. When doing city discovery in Chengdu, do international travelers care more about "fit for me" and "why trusted" than a larger number of recommendations?
2. Does separating Chinese platform signals, international traveler signals, and official facts improve trust?
3. Are users willing to save places first, then let the Agent generate a route?
4. Does local replanning fit real travel decisions better than regenerating the whole itinerary?
5. Do international travelers' execution barriers mainly come from language, booking, payment, navigation, or on-site rules?

## 3. Scenario Framework

"International traveler" is not a single persona. Scenarios are defined by tasks and capability variables:

- Whether this is the user's first time in China or they are familiar with traveling in China.
- Whether they can use Chinese apps.
- Whether they can handle booking, payment, navigation, and on-site communication.
- Main travel motivation: classic landmarks, city life, food, culture, photography, family, Sichuan extension.
- Explicit constraints: time, diet, budget, energy, companions.

Six primary scenarios:

| Scenario | Goal | Main Risk |
|---|---|---|
| First time in China | See representative Chengdu experiences without being blocked by complex processes | Language, payment, booking, information overload |
| Contemporary city exploration | Find independent spaces, neighborhoods, and visual experiences | Generic recommendations, unstable place quality |
| Sichuan food motivation | Experience Chengdu food while controlling spice and hygiene risk | Diet limits, queues, menu language |
| Culture and archaeology | Visit museums, heritage sites, and historical spaces | Booking, interpretation language, visit duration |
| International family | Balance children, elders, rest, and safety | Energy, bathrooms, indoor backup |
| Sichuan extension | Understand western Sichuan, Aba, and Ganzi opportunities from Chengdu | Distance, transportation, safety, compliant services |

Secondary stress tests include domestic first-time visitors, local rediscovery, photography, shopping, museum depth, limited mobility, and multi-person companion conflicts.

## 4. Candidate Place Strategy

Candidate places are not a "popular attractions list." They are a sample pool for testing product judgment. The first demo should select 6 to 8 places covering:

- Classic places that need context
- Local life and neighborhood experience
- Food and non-spicy options
- Museum or cultural space
- Photogenic urban space
- Rainy-day or low-energy backup

Place inclusion criteria:

- Supports at least one explicit user scenario.
- Has linkable sources or an official information entry.
- Can explain who it fits and who it does not fit.
- Can be validated against map and time constraints.
- Has describable operational risks for international travelers.

Not included for now:

- Places that can only be supported by platform comments and have no stable source.
- Services involving safety, compliance, or supply responsibility that cannot be verified.
- Car booking, group tours, or guide matching that require complex transaction loops.

## 5. Source Policy

Allowed source types:

- Official websites, attraction pages, museum pages, and government tourism information.
- Map links and public POI information entries.
- OTA or review-platform place links.
- Link-level references to international travel discussions, guides, and community content.
- Manually organized editorial notes.

Not allowed:

- Copying full third-party platform reviews.
- Copying usernames, avatars, personal profiles, or unauthorized ratings.
- Treating Xiaohongshu, Douyin, Dianping, and similar platform content as freely trainable or scrapable data.
- Treating platform popularity as factual quality.

The portfolio demo can show "source links" and "source types," but should not display unauthorized review content.

## 6. Validation Plan

If the project continues, validation should proceed in a low-cost order:

| Stage | Method | Sample | Success Standard |
|---|---|---|---|
| Desk validation | Source registration and place-field completion | 20 places | Critical fields are traceable |
| Usability test | Remote usability test | 5 users with international travel experience | Complete saving and routing within 2 minutes |
| Concept interview | Semi-structured interview | 6 to 8 potential users | Can restate product value and trust points |
| Agent eval | Offline task set | 30 tasks | Hard-constraint error rate below defined threshold |
| Market test | Public demo or waitlist | Small traffic | Save rate, route generation rate, and source click rate meet targets |

Before completing these validations, the product should not claim validated user demand or commercial traction.

## 7. Risks

- Data authorization risk: third-party platform content should only be linked, not copied.
- Real-time accuracy risk: opening hours, prices, booking, and weather must be timestamped.
- Cultural misreading risk: local culture should not be reduced to photo labels.
- Internationalization risk: English readability is not the same as on-site feasibility.
- Agent risk: fluent model output may hide missing facts.
