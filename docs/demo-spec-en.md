# Chengdu Lens Demo Specification

## 1. Demo Objective

The website needs to prove one product loop within two minutes:

```text
Build taste -> View trusted recommendations -> Save places -> Generate route -> Local replan -> Understand product decisions
```

The goal is not to show every travel feature, but to let reviewers see:

- Clear user segmentation.
- An AI-assisted product concept with scoped behavior.
- Recommendations that explain source signals, fit reasons, and next actions.
- Disciplined MVP trade-offs.

## 2. Current Website Structure

The current implementation uses a single-page website rather than separate product tabs:

1. Hero / Story
2. Your Taste
3. Discover
4. Your Trip
5. Ask AI
6. Case Study

This differs from the earlier six-view product design, but the product loop is the same. The single-page structure is intentional for portfolio readability.

## 3. Default Scenario

The demo uses one stable scenario:

> First-time international visitor. Four hours this afternoon. Starting near Taikoo Li. Prefers quiet local neighborhoods, photogenic spaces, no spicy food, walking preferred, indoor backup needed if raining.

Other international traveler scenarios are kept as research hypotheses and future test cases, not the primary website flow.

## 4. Core Sections

### 1. Your Taste

- Demo Profile button.
- Taste and constraint fields.
- Time, start point, diet, walking, and weather-backup conditions.
- Clear demo scenario boundary.

### 2. Discover

- Shows 8 curated Chengdu places.
- Each card shows image, name, category, area, quick facts, and a concise fit reason.
- Place detail sheet contains deeper information, nearby recommendations, ticket info, transit notes, and evidence metrics.
- No copied third-party reviews, usernames, avatars, or unauthorized ratings.

### 3. Your Trip

- Saves become a lightweight personal collection.
- Saving at least three places unlocks a route timeline.
- Rain replanning replaces affected outdoor-heavy stops while preserving the route shape.

### 4. Ask AI

- Uses Lovable AI Gateway when available.
- The assistant is scoped to the demo profile, saved places, and 8 place records.
- It should be described as an AI concierge demo, not a production travel assistant.

### 5. Case Study

- Explains the product case, AI Agent design, and roadmap.
- Shows why Chengdu was selected, why the scope is narrow, and why discovery plus routing is the first loop.
- Presents the source strategy, recommendation logic, and iteration plan.

## 5. Agent Logic

The website simplifies the visible Agent Workspace, but the product design still follows this logic:

1. Understood
2. Retrieved
3. Checked
4. Excluded
5. Recommended
6. Next Action

Hard constraints act as gates before scoring. Personal Fit and Evidence Confidence remain conceptually separate even when the card UI is simplified.

## 6. Data Scope

The first version uses 8 inline Chengdu place records to support the full browsing, saving, routing, and Ask AI flow.

Data design principles:

- Factual fields should keep traceable source links.
- Third-party platforms are used as outbound source links; the product does not copy reviews, usernames, avatars, or unauthorized ratings.
- AI answers are scoped to place records, user preferences, and saved routes.
- Route times, ticket notes, and opening rules are shown as lightweight guidance, not as a transaction flow.

## 7. Event Tracking

Local event logging is sufficient for the demo:

- `taste_profile_completed`
- `request_submitted`
- `place_viewed`
- `evidence_detail_viewed`
- `source_opened`
- `place_saved`
- `place_rejected`
- `route_generated`
- `replan_triggered`
- `place_replaced`
- `map_fallback_shown`

Events map to activation, trust engagement, save conversion, route conversion, and replan success.

## 8. Acceptance Criteria

- Reviewer can understand the value proposition within the first screen.
- User can apply the demo profile and browse 8 places.
- User can open place details.
- User can save at least three places and see a route timeline.
- User can trigger a rain replan.
- Case Study is available from the top navigation.
- Demo and document claims do not imply live validation, live routing, real-time opening status, or commercial launch.
- Core browsing and route experience work without an AI key; Ask AI depends on Lovable AI Gateway availability.
- English and Chinese modes do not mix UI copy beyond necessary product terms.
