import { BriefcaseBusiness } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { decisions, evalCriteria, funnel, guardrails, layers, northStar } from "@/data/pmView";

const DOCS = "https://github.com/aujingx/chengdulens/blob/main/docs";

export function PMViewSheet({ trigger }: { trigger?: React.ReactNode }) {
  const lang = useApp((s) => s.lang);
  const k = lang === "en" ? "en" : "zh";
  const zh = k === "zh";
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline"><BriefcaseBusiness className="size-4" /> {zh ? "PM 视角" : "PM view"}</Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">{zh ? "产品经理视角" : "Product manager view"}</SheetTitle>
          <SheetDescription>{zh ? "这个产品如何衡量好坏，以及 AI 如何被约束。" : "How success is measured and how the AI is governed."}</SheetDescription>
        </SheetHeader>
        <div className="space-y-8 px-4 pb-10">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "北极星指标" : "North star"}</h3>
            <div className="mt-2 rounded-xl border border-border bg-cream/60 p-4">
              <p className="font-display text-lg font-semibold">{northStar.name[k]}</p>
              <p className="mt-1 text-sm text-muted-foreground">{northStar.def[k]}</p>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "核心漏斗" : "Core funnel"}</h3>
            <ol className="mt-2 grid gap-2 sm:grid-cols-4">
              {funnel.map((f, i) => (
                <li key={i} className="rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                  <p className="text-sm font-medium">{f.step[k]}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.metric[k]}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "护栏指标" : "Guardrails"}</h3>
            <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
              {guardrails.map((g, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span>{g.name[k]}</span><span className="font-semibold text-primary">{g.target}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "系统分层：规则优先于生成" : "Layers: rules before generation"}</h3>
            <div className="mt-2 space-y-2">
              {layers.map((l, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{l.name[k]}</p>
                  <p className="text-xs text-muted-foreground">{l.owns[k]}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "AI 评测准则" : "AI evaluation criteria"}</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {evalCriteria.map((e, i) => (
                <li key={i}><span className="font-medium">{e.name[k]}</span><span className="text-muted-foreground"> · {e.check[k]}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "关键取舍" : "Key trade-offs"}</h3>
            <dl className="mt-2 space-y-3 text-sm">
              {decisions.map((d, i) => (
                <div key={i}><dt className="font-medium">{d.q[k]}</dt><dd className="text-muted-foreground">{d.a[k]}</dd></div>
              ))}
            </dl>
          </section>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><a href={`${DOCS}/product-metrics-${k === "en" ? "en" : "cn"}.md`} target="_blank" rel="noreferrer">{zh ? "指标与 AI 治理文档" : "Metrics & AI governance doc"}</a></Button>
            <Button asChild size="sm" variant="ghost"><a href={`${DOCS}/product-case-study-${k === "en" ? "en" : "cn"}.md`} target="_blank" rel="noreferrer">{zh ? "完整产品案例" : "Full case study"}</a></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
