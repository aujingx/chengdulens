import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "Case Study — Chengdu Lens" },
      { name: "description", content: "Product thinking behind Chengdu Lens: problem, target user, MVP scope, Agent architecture, and metrics." },
      { property: "og:title", content: "Case Study · Chengdu Lens" },
      { property: "og:description", content: "The product thinking behind the demo." },
    ],
  }),
  component: CaseStudy,
});

function CaseStudy() {
  const lang = useApp((s) => s.lang);
  const t = dict[lang];
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-coral font-semibold">Case study</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">{t.caseStudy.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t.caseStudy.subtitle}</p>

      <div className="mt-12 space-y-10">
        {t.caseStudy.sections.map((s, i) => (
          <section key={s.h}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xs font-semibold text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl font-semibold">{s.h}</h2>
            </div>
            <p className="mt-3 text-foreground/80 leading-relaxed">{s.b}</p>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl card-soft p-6">
        <h3 className="font-display text-lg font-semibold">Event → metric mapping</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
          <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">taste_profile_completed</code> → Activation</li>
          <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">evidence_detail_viewed</code> / <code className="text-xs bg-muted px-1.5 py-0.5 rounded">source_opened</code> → Trust engagement</li>
          <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">place_saved</code> → Save conversion</li>
          <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">route_generated</code> → Route conversion</li>
          <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">replan_triggered</code> / <code className="text-xs bg-muted px-1.5 py-0.5 rounded">place_replaced</code> → Replan success</li>
        </ul>
      </div>
    </div>
  );
}
