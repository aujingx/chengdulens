import { useEffect, useState } from "react";
import { Check, Sparkles, ArrowRight, ArrowLeft, Plus, MapPin, Ticket, Bookmark, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BookingPanel } from "@/components/BookingPanel";
import { PlaceImage } from "@/components/PlaceImage";
import { useTravelPlan } from "@/lib/travel-plan-store";
import { computeRoute } from "@/lib/tripMath";
import {
  SAMPLE, STEPS, readBrief, newPlan, fillPlan, routeStops, toggleStop, placeOptions, dinnerOptions, getDinner,
  CHENGDU_HOTELS, JIUZHAI_HOTELS, TRANSFERS, MEALS, optionById, type Plan, type Step, type Option,
} from "@/lib/travel-plan";
import { cn } from "@/lib/utils";
import { WeatherPill } from "./WeatherPill";

type Lang = "en" | "zh";
const STEP_LABEL: Record<Step, { en: string; zh: string }> = {
  places: { en: "Afternoon places", zh: "下午景点" }, dinner: { en: "Dinner", zh: "晚餐" },
  chengduHotel: { en: "Tonight’s hotel", zh: "今晚住宿" }, tomorrow: { en: "Tomorrow · Jiuzhaigou", zh: "明天 · 九寨沟" }, summary: { en: "Your plan", zh: "行程总览" },
};

export function Planner({ lang, onOpenPlace }: { lang: Lang; onOpenPlace: (id: string) => void }) {
  const zh = lang === "zh";
  const { plan, setPlan } = useTravelPlan();
  const [text, setText] = useState(SAMPLE[lang]);
  const [error, setError] = useState(false);
  const [booking, setBooking] = useState<null | "chengdu" | "jiuzhaigou">(null);
  useEffect(() => { setText((t) => (t === SAMPLE.en || t === SAMPLE.zh ? SAMPLE[lang] : t)); }, [lang]);

  function start(mode: Plan["mode"]) {
    const brief = readBrief(text);
    if (!brief) return setError(true);
    setError(false);
    setPlan(newPlan({ ...brief, rain: brief.rain || useTravelPlan.getState().weather.rain }, mode));
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 pb-6">
        <label htmlFor="brief" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "用一句话告诉我你的安排" : "Tell me your trip in one sentence"}</label>
        <textarea id="brief" value={text} onChange={(e) => setText(e.target.value)} rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-border bg-cream/30 p-3 text-sm leading-relaxed outline-none focus:border-coral" />
        {error && <p className="mt-2 text-xs text-destructive">{zh ? "演示版目前支持“今天成都 + 明天九寨沟”的行程，请在句子里提到这两个地方。" : "This demo plans “Chengdu today + Jiuzhaigou tomorrow”. Please mention both."}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" className="rounded-lg bg-planner-green text-planner-on-green hover:bg-planner-green/90" onClick={() => start("guided")}><Wand2 className="size-4" />{zh ? "全部听 AI 的，一键托管" : "Let AI plan it all"}</Button>
          <Button type="button" variant="outline" className="rounded-lg" onClick={() => start("manual")}>{zh ? "我来选，一步步安排" : "I’ll choose step by step"}<ArrowRight className="size-4" /></Button>
        </div>
      </div>

      {plan && <Workbench lang={lang} plan={plan} setPlan={setPlan} onOpenPlace={onOpenPlace} onBook={setBooking} />}

      <Sheet open={booking !== null} onOpenChange={(o) => !o && setBooking(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader><SheetTitle>{zh ? "预订与核对" : "Book & verify"}</SheetTitle></SheetHeader>
          {booking && <BookingPanel destination={booking} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Workbench({ lang, plan, setPlan, onOpenPlace, onBook }: { lang: Lang; plan: Plan; setPlan: (p: Plan) => void; onOpenPlace: (id: string) => void; onBook: (d: "chengdu" | "jiuzhaigou") => void }) {
  const zh = lang === "zh";
  const stops = routeStops(plan);
  const route = computeRoute(stops, plan.brief.start);
  const idx = STEPS.indexOf(plan.step);
  const go = (step: Step) => setPlan({ ...plan, step });
  const set = (patch: Partial<Plan>) => setPlan({ ...plan, ...patch, saved: false });
  const name = (o?: Option) => (o ? (zh ? o.zh : o.en) : zh ? "未选" : "Not chosen");

  return (
    <div className="overflow-hidden border-y border-border/60 bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-cream/50 px-4 py-3">
        {STEPS.map((s, i) => (
          <Button variant="ghost" key={s} type="button" onClick={() => go(s)} aria-current={s === plan.step ? "step" : undefined}
            className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium", s === plan.step ? "bg-foreground text-background" : i < idx ? "text-foreground" : "text-muted-foreground")}>
            <span className={cn("grid size-4 place-items-center rounded-lg text-[10px]", i < idx ? "bg-leaf text-background" : "border border-current")}>{i < idx ? <Check className="size-3" /> : i + 1}</span>
            {zh ? STEP_LABEL[s].zh : STEP_LABEL[s].en}
          </Button>
        ))}
        <WeatherPill lang={lang} className="ml-auto" />
      </div>

      <div className="p-4 sm:p-6">
        {plan.step === "places" && (
          <div className="space-y-4">
            <Hint>{zh ? `可用 ${plan.brief.minutes} 分钟，从${plan.brief.start === "Taikoo Li" ? "太古里" : plan.brief.start}出发。${plan.rain ? "雨天只显示室内地点，晴天选择会保留。" : "选感兴趣的地方加入今日路线。"}` : `${plan.brief.minutes} min from ${plan.brief.start}. ${plan.rain ? "Rain shows indoor places; your sunny picks are kept." : "Pick what interests you."}`}</Hint>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {placeOptions(plan.rain).map((p) => {
                const on = stops.some((s) => s.id === p.id);
                const next = toggleStop(plan, p.id, on);
                const blocked = !on && next === plan;
                return (
                  <div key={p.id} className={cn("overflow-hidden rounded-lg border bg-background", on ? "border-coral ring-1 ring-coral" : "border-border/60")}>
                    <Button variant="ghost" type="button" onClick={() => onOpenPlace(p.id)} className="block h-auto w-full overflow-hidden p-0 text-left">
                      <PlaceImage src={p.image.url} alt={p.image.alt} className="aspect-[16/10] w-full" />
                    </Button>
                    <div className="p-3">
                      <p className="font-semibold">{zh ? p.zhName : p.name}</p>
                      <p className="text-xs text-muted-foreground">{zh ? p.categoryZh : p.category} · {p.duration} {zh ? "分钟" : "min"}{p.indoor ? (zh ? " · 室内" : " · indoor") : ""}</p>
                      <div className="mt-2 flex gap-2">
                        <Button type="button" size="sm" variant={on ? "default" : "outline"} disabled={blocked} className="h-8 flex-1 rounded-lg text-xs" onClick={() => setPlan(next)}>
                          {on ? <><Check className="size-3.5" />{zh ? "已加入" : "Added"}</> : blocked ? (zh ? "时间不够" : "Won’t fit") : <><Plus className="size-3.5" />{zh ? "加入今日" : "Add"}</>}
                        </Button>
                        <Button type="button" size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => onOpenPlace(p.id)}>{zh ? "周边" : "Nearby"}</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <RouteStrip lang={lang} names={stops.map((s) => (zh ? s.zhName : s.name))} total={route.totalMin} budget={plan.brief.minutes} />
          </div>
        )}

        {plan.step === "dinner" && (
          <Choice lang={lang} hint={zh ? `按你最后一站就近排序${plan.brief.noSpice ? "，已考虑不吃辣" : ""}。` : `Sorted by distance from your last stop${plan.brief.noSpice ? ", mild food first" : ""}.`}
            options={dinnerOptions(plan)} value={plan.dinner} onPick={(id) => set({ dinner: id })} />
        )}
        {plan.step === "chengduHotel" && (
          <Choice lang={lang} hint={zh ? "三个候选，选一个住今晚。明早要赶高铁的话东站最省事。" : "Three options for tonight. East Station is easiest for tomorrow’s train."}
            options={CHENGDU_HOTELS} value={plan.chengduHotel} onPick={(id) => set({ chengduHotel: id })} />
        )}
        {plan.step === "tomorrow" && (
          <div className="space-y-6">
            <div className="border-l-2 border-planner-green pl-4 text-sm leading-relaxed">
              <h3 className="font-semibold">{zh ? "成都东 → 黄龙九寨站 → 九寨沟口" : "Chengdu East → Huanglong Jiuzhai Station → Park gate"}</h3>
              <p className="mt-1 text-muted-foreground">{zh ? "明早乘高铁，再接驳到酒店；下午抵达、休息或在沟口散步。完整游览景区建议留到后一天，车次与门票以官方渠道为准。" : "Morning train, then transfer to your hotel. Settle in or walk near the gate in the afternoon. Allow the following day for the park; verify train times and tickets officially."}</p>
            </div>
            <Choice lang={lang} title={zh ? "高铁到站后怎么去酒店" : "From the train to your hotel"} options={TRANSFERS} value={plan.transfer} onPick={(id) => set({ transfer: id })} />
            <Choice lang={lang} title={zh ? "九寨沟住宿" : "Jiuzhaigou stay"} options={JIUZHAI_HOTELS} value={plan.jiuzhaiHotel} onPick={(id) => set({ jiuzhaiHotel: id })} />
            <Choice lang={lang} title={zh ? "明天晚餐" : "Tomorrow’s dinner"} options={MEALS} value={plan.meal} onPick={(id) => set({ meal: id })} />
          </div>
        )}
        {plan.step === "summary" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Day title={zh ? "今天 · 成都" : "Today · Chengdu"} rows={[
              [zh ? "路线" : "Route", stops.length ? `${stops.map((s) => (zh ? s.zhName : s.name)).join(" → ")} · ${route.totalMin} ${zh ? "分钟" : "min"}` : (zh ? "未选" : "Not chosen")],
              [zh ? "晚餐" : "Dinner", name(getDinner(plan.dinner))],
              [zh ? "住宿" : "Hotel", name(optionById(CHENGDU_HOTELS, plan.chengduHotel))],
            ]} onBook={() => onBook("chengdu")} lang={lang} />
            <Day title={zh ? "明天 · 九寨沟" : "Tomorrow · Jiuzhaigou"} rows={[
              [zh ? "路线" : "Route", zh ? "成都东 → 黄龙九寨站 → 沟口；抵达休息，后一天游景区" : "Chengdu East → Huanglong Jiuzhai → Gate; settle in, park the following day"],
              [zh ? "接驳" : "Transfer", name(optionById(TRANSFERS, plan.transfer))],
              [zh ? "住宿" : "Hotel", name(optionById(JIUZHAI_HOTELS, plan.jiuzhaiHotel))],
              [zh ? "晚餐" : "Dinner", name(optionById(MEALS, plan.meal))],
            ]} onBook={() => onBook("jiuzhaigou")} lang={lang} />
            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
              <Button type="button" className="rounded-lg" disabled={plan.saved} onClick={() => setPlan({ ...plan, saved: true })}>
                <Bookmark className="size-4" />{plan.saved ? (zh ? "已保存到本机" : "Saved on this device") : (zh ? "保存行程" : "Save plan")}
              </Button>
              <span className="text-xs text-muted-foreground">{plan.mode === "guided" ? (zh ? "由 AI 托管填写，可点上方任一步修改。" : "Filled by AI; tap any step above to change it.") : (zh ? "你可以随时回到任一步修改。" : "Tap any step to revise.")}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="ghost" size="sm" disabled={idx === 0} onClick={() => { const previous = STEPS[idx - 1]; if (previous) go(previous); }}><ArrowLeft className="size-4" />{zh ? "上一步" : "Back"}</Button>
          <div className="flex flex-wrap gap-2">
            {plan.step !== "summary" && <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => setPlan(fillPlan(plan))}><Sparkles className="size-4" />{zh ? "剩下的交给 AI" : "AI fills the rest"}</Button>}
            {plan.step !== "summary" && <Button type="button" size="sm" className="rounded-lg bg-planner-green text-planner-on-green hover:bg-planner-green/90" onClick={() => { const next = STEPS[idx + 1]; if (next) go(next); }}>{zh ? "下一步" : "Next"}<ArrowRight className="size-4" /></Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function RouteStrip({ lang, names, total, budget }: { lang: Lang; names: string[]; total: number; budget: number }) {
  const zh = lang === "zh";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-cream/60 px-4 py-3 text-sm">
      <MapPin className="size-4 text-coral" />
      <span className="font-medium">{names.length ? names.join(" → ") : zh ? "还没有加入地点" : "No places yet"}</span>
      <span className="ml-auto text-xs text-muted-foreground">{total} / {budget} {zh ? "分钟（含路程，估算）" : "min incl. travel (est.)"}</span>
    </div>
  );
}

function Choice({ lang, title, hint, options, value, onPick }: { lang: Lang; title?: string; hint?: string; options: Option[]; value: string | null; onPick: (id: string) => void }) {
  const zh = lang === "zh";
  return (
    <div className="space-y-3">
      {title && <h3 className="font-display font-semibold">{title}</h3>}
      {hint && <Hint>{hint}</Hint>}
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((o) => (
          <div key={o.id}
            className={cn("rounded-lg border p-4 text-left transition", value === o.id ? "border-coral bg-coral/5 ring-1 ring-coral" : "border-border/60 hover:border-coral/50")}>
            <Button variant="ghost" type="button" onClick={() => onPick(o.id)} aria-pressed={value === o.id} className="h-auto w-full items-start justify-between whitespace-normal p-0 text-left hover:bg-transparent"><span className="font-semibold leading-snug">{zh ? o.zh : o.en}</span>{value === o.id && <Check className="size-4 shrink-0 text-coral" />}</Button>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{zh ? o.note.zh : o.note.en}</span>
            {o.query && <a onClick={(e) => e.stopPropagation()} href={`https://uri.amap.com/search?keyword=${encodeURIComponent(o.query)}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-coral underline-offset-2 hover:underline">{zh ? "在地图上查看" : "View on map"}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Day({ lang, title, rows, onBook }: { lang: Lang; title: string; rows: [string, string][]; onBook: () => void }) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([k, v]) => (<div key={k} className="grid grid-cols-[4.5rem_1fr] gap-2"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>))}
      </dl>
      <Button type="button" variant="outline" size="sm" className="mt-4 rounded-lg" onClick={onBook}><Ticket className="size-4" />{lang === "zh" ? "查看预订与官方核对" : "Bookings & official checks"}</Button>
    </div>
  );
}
