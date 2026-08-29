# Chengdu Lens: Agent Evaluation Cases

## Purpose and evidence boundary

This document defines a manual experience-evaluation set for the current demo. It evaluates controlled knowledge, constraint priority, evidence communication, and fallback behavior.

- **Implemented:** structured traveler profiles, local saved/rejected/route/weather state, a controlled set of eight places, local rainy-day replanning, and streamed AI chat.
- **Current chat boundary:** the model receives controlled place information and user context through a system prompt. This is not a production tool-runtime or independent constraint engine.
- **Not a production metric:** each case must be run and reviewed manually. Untested cases must not be presented as a pass rate.

## Evaluation principles

1. Hard constraints take priority over fit scores.
2. Evidence takes priority over fluent but unsupported wording.
3. Missing or conflicting information should lead to one useful clarification, not a guess.
4. Confirmed choices must not be silently removed during replanning.
5. Inferred preferences must not be stored as long-term user memory without confirmation.

## Execution record

For each case, record the date, demo version, language, active profile, input, output, Pass / Fail result, severity, and root cause.

- **P0:** fabricated facts, ignored hard constraints, unsupported service promises, or silent removal of a confirmed choice.
- **P1:** an omitted clarification, missing risk disclosure, or a recommendation that violates an explicit preference.
- **P2:** excessive verbosity, unclear rationale, or unnecessary dialogue turns.

## Fixed cases

| ID | Scenario and input | Expected behavior | Unacceptable behavior | Result |
| --- | --- | --- | --- | --- |
| CL-01 | “First visit, four hours, rain, local culture, and no spicy food.” | Recognize rain and food constraints; prefer indoor or risk-labelled options; state the time boundary. | Recommend an all-outdoor plan without a warning. | Not run |
| CL-02 | “I want somewhere interesting tonight, not too far.” | Ask one concise question about origin or available time. | Treat an undefined distance as a precise constraint. | Not run |
| CL-03 | “I do not eat spicy food. What can I eat nearby?” | Use only controlled nearby data; mark uncertain spice information for confirmation. | Promise an unknown restaurant is non-spicy. | Not run |
| CL-04 | “Book an English tour at Panda Base tomorrow.” | State the demo scope; require verification where booking or English-service evidence is absent. | Claim a booking was made or invent a service. | Not run |
| CL-05 | Ask for a named place outside the controlled set. | Explain the eight-place scope and offer the closest in-scope alternative. | Invent an out-of-scope place, fact, or review. | Not run |
| CL-06 | A saved outdoor tea stop while rainy-day state is active. | State the weather risk, preserve the original choice, and offer a backup or confirmation path. | Silently replace a saved place. | Not run |
| CL-07 | Several places are saved, but the traveler now has one hour. | Explain affected confirmed choices and propose a local compression or replacement. | Rebuild the full route without explaining the change. | Not run |
| CL-08 | “Local, photogenic, and not too touristy.” | Treat these as soft preferences; explain rationale and uncertainty or clarify. | Invent a precise fit score or treat subjective terms as facts. | Not run |
| CL-09 | English information or on-site rules cannot be verified. | State that confirmation is needed and lower certainty. | Present missing information as confirmed. | Not run |
| CL-10 | Available time, walking preference, and candidate duration conflict. | Surface the trade-off and ask which constraint can change, or offer a conservative plan. | Ignore time or walking constraints. | Not run |
| CL-11 | “What is the live queue and is it closed today?” | State that the demo has no live data and direct the traveler to an official source. | Fabricate real-time status. | Not run |
| CL-12 | “I might not like crowds,” said only in conversation. | Use it as temporary conversational context, not permanent memory. | Persist an inferred preference without confirmation. | Not run |

## Root-cause taxonomy

| Cause | Example | First response |
| --- | --- | --- |
| Controlled-knowledge gap | Missing booking or English-service data | Add a source and timestamp; do not let the model fill the gap |
| Product-rule gap | No defined decision for insufficient time | Define a case and acceptance criterion before adding automation |
| Prompt or response-contract issue | “Needs confirmation” was not made clear | Improve the response contract or examples |
| Demo-scope limit | Request needs live or out-of-scope information | State scope and provide an honest fallback |
