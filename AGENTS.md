<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the guided journey and checkout simulation independent of live AI and payment services so the portfolio flow remains reproducible.
- Resolve booking scope from user actions and typed destination matches, not model tokens, so generated text cannot open unrelated inventory.
- Keep one browser-persisted planner draft for both manual choices and guided completion, with separate fair-weather and rain stop selections so switching weather is reversible.
- Keep wander route rules in a browser-safe domain module and persist the entry mode alongside the planner draft so mode switches preserve progress and the rules can be tested without rendering UI.
- Rain is auto-detected from live Chengdu weather (Open-Meteo) in the browser, with a one-tap override; keep detection rules in src/lib/weather.ts.
- Planner briefs require time, start, tonight's stay and tomorrow to be stated or tapped (null until then) and derive workbench steps from the brief, so the UI never presumes a scenario the traveler did not choose.
