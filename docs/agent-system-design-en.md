# Chengdu Lens AI Agent System Design

## 1. Design Goal

The agent does not generate a generic Chengdu guide. It turns ambiguous travel intent into an explainable, verifiable, and adjustable city experience.

Core loop:

```text
Perceive request -> Build task state -> Select tools -> Retrieve evidence -> Validate constraints
-> Rank and explain -> Generate action plan -> Receive feedback -> Local replan
```

The MVP uses one orchestrating agent. Multi-agent decomposition is only justified when tasks need different permissions, independent evaluation, or parallel execution.

## 2. Agent Task State

The agent maintains explicit task state so every turn does not regenerate a fresh itinerary.

```json
{
  "goal": "build a four-hour Chengdu city experience",
  "startArea": "Taikoo Li",
  "endBy": "18:30",
  "hardConstraints": ["no spicy food", "walking preferred", "indoor backup required if raining"],
  "softPreferences": ["quiet neighborhoods", "local texture", "photogenic spaces"],
  "travelerCapabilities": {
    "language": "English",
    "chinaTravelFamiliarity": "low",
    "canUseChineseApps": false,
    "paymentReadiness": "international card plus cash"
  },
  "confirmedPlaces": [],
  "rejectedPlaces": [],
  "unresolvedRisks": ["opening status must be confirmed before departure"],
  "planStatus": "discovering"
}
```

Task state has four parts:

- **Goal**: what the user wants to complete now.
- **Hard constraints**: conflicts that require exclusion or clarification.
- **Soft preferences**: ranking and explanation inputs.
- **Capabilities and risks**: language, booking, payment, navigation, weather, and on-site rules.

## 3. Architecture

```text
Experience Layer
  ├─ Taste Profile
  ├─ Discover
  ├─ Place Evidence Detail
  ├─ My Collection
  ├─ Route / Replan
  └─ Agent Workspace
        ↓
Agent Orchestrator
  ├─ Request Parser
  ├─ Task State Manager
  ├─ Tool Router
  ├─ Constraint Gate
  ├─ Retriever / Ranker
  ├─ Explanation Composer
  └─ Evidence Guard
        ↓
Tools and Data
  ├─ Place Knowledge Base
  ├─ Evidence Index
  ├─ Map Adapter
  ├─ Weather Adapter
  ├─ Opening Status Checker
  ├─ International Access Checker
  ├─ Preference Memory
  └─ Collection State
```

The LLM handles natural-language understanding, tag normalization, candidate explanation, and clarification wording. Rules and tools handle hard constraints, factual fields, evidence thresholds, route feasibility, and fallbacks.

## 4. Tool Contracts

| Tool | Purpose | Output | Fallback |
|---|---|---|---|
| `parse_request` | Parse goal, constraints, preferences | Structured task state | Ask for missing key hard constraints |
| `search_places` | Retrieve candidates by tags and area | Candidate place IDs | Return controlled demo data |
| `get_place_evidence` | Fetch field-level sources and timestamps | Evidence cards | Lower confidence, do not invent facts |
| `check_hard_constraints` | Filter hard conflicts | pass / excluded / needs_confirmation | Show clarification card |
| `check_route` | Validate time, distance, sequence | Time matrix and route risks | Use labeled demo matrix |
| `check_weather_fit` | Check indoor/outdoor weather conflict | Risks and alternatives | Use demo weather scenario |
| `check_international_access` | Check English info, booking, payment, navigation, rules | Accessibility status | Mark as manual confirmation needed |
| `read_preference_memory` | Read confirmed user preferences | Confirmed preferences | Use current session only |
| `write_preference_memory` | Store explicit feedback | Reversible update | Do not save inferred preferences |
| `read_collection` | Read saves, rejects, companion notes | Collection state | Fall back to local state |

Tool logs store tool name, input summary, status, and timestamp. They do not store hidden chain-of-thought.

## 5. RAG Design

The retrieval unit is not a guide article. It is a traceable set of place facts and experience signals.

Each place includes:

- Stable facts: name, type, address, coordinates, neighborhood.
- Volatile facts: opening hours, tickets, booking, price, temporary closure.
- Experience signals: quietness, photography conditions, crowding risk, suitable users.
- International signals: comprehension cost, cross-cultural interest, language friction.
- Local signals: Chinese-platform relevance, long-tail discovery, recent discussion trend.
- Operational signals: English information, passport booking, payment, navigation, on-site rules.
- Source record: link, source type, collection date, permitted use.
- Editorial judgment: why included, how conflicts are handled, fields still needing confirmation.

Retrieval flow:

1. Parse the request into hard constraints, soft preferences, and task goal.
2. Retrieve candidates by place type, area, and experience tags.
3. Read Evidence cards for candidates.
4. Run the Constraint Gate first.
5. Calculate Personal Fit only for candidates that pass.
6. Calculate Evidence Confidence separately.
7. Generate reasons, risks, and sources.

## 6. Constraint Gate and Scoring

Hard constraints are filters before scoring.

The agent must exclude or clarify when there is:

- Allergy, safety, or explicit unacceptable condition.
- Likely closure at arrival time without alternative verification.
- Infeasible time, distance, or return buffer.
- Booking, ID, payment, or navigation requirements that are not feasible for the traveler.
- Insufficient evidence for a critical claim.

Only candidates passing the gate receive a Personal Fit score:

```text
Personal Fit =
40% explicit taste match
+ 25% time and spatial fit
+ 15% desired experience/category fit
+ 10% pace and effort fit
+ 10% curator, companion, or similar-user signal
```

Evidence Confidence is calculated independently:

```text
Evidence Confidence =
35% source authority
+ 25% freshness
+ 20% cross-source consistency
+ 20% field completeness
```

International Relevance, Local Relevance, and Operational Accessibility are displayed as separate fields, not merged into a popularity score.

## 7. Agent Workspace

Agent Workspace shows how the system works without exposing hidden chain-of-thought.

Fixed structure:

1. **Understood**: goal, hard constraints, soft preferences.
2. **Retrieved**: candidate count and data scope.
3. **Checked**: evidence, map, weather, and accessibility checks.
4. **Excluded**: excluded candidates and one-line reasons.
5. **Recommended**: final recommendations, scores, sources.
6. **Next Action**: save, clarify, build route, or replan.

Example:

```text
Understood: 4 hours, Taikoo Li start, walking preferred, no spicy food.
Retrieved: 18 controlled Chengdu place records.
Checked: 6 have enough evidence; 2 require opening confirmation.
Excluded: 3 exceed route time; 1 has unresolved diet risk.
Recommended: save 3 places before building route.
```

## 8. Memory Design

| Layer | Content | Policy |
|---|---|---|
| Current task | Date, start point, time, budget, temporary limits | Delete or anonymize after session |
| Explicit preference | Saves, rejects, user settings | Authorized, visible, reversible |
| Inferred signal | Temporary tags used for current ranking | Not saved to long-term memory |
| Sensitive data | Precise location history, identity, health data | Not stored by default |

The system only considers long-term preference updates after explicit user actions such as save, reject, or setting a preference. It does not convert one dwell-time event or one weather choice into a permanent preference.

## 9. Replanning Logic

Replanning is a local replacement task, not a full rewrite.

Flow:

1. Lock places the user explicitly confirmed.
2. Identify the changed condition: rain, fatigue, queue avoidance, early finish.
3. Identify affected nodes.
4. Retrieve substitutes from the same or complementary category.
5. Run the Constraint Gate again.
6. Output preserved items, replacements, reasons, and remaining risks.

Acceptance condition: confirmed places are not silently removed, replacement reasons are traceable, and the new plan still satisfies time and accessibility constraints.

## 10. Evaluation

Offline evaluation should cover:

- Hard-constraint conflicts: no spicy food, rain, insufficient time, infeasible booking.
- Ambiguous preferences: local texture, photogenic, not too touristy.
- International-traveler friction: insufficient English info, payment uncertainty, Chinese-app dependency.
- Route conflicts: cross-city backtracking, excessive dwell time, insufficient return buffer.
- Replanning: rain, fatigue, early finish, companion veto.

Red-line failures:

- Fabricated sources or user reviews.
- Presenting simulated data as real-time data.
- Using a high fit score to override hard conflicts.
- Copying third-party reviews or ratings.
- Writing long-term preferences without explicit user confirmation.
