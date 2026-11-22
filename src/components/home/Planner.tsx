import { useState } from "react";
import { Check, Sparkles, ArrowRight, ArrowLeft, Plus, MapPin, Ticket, Bookmark, Wand2, Pencil, X, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BookingPanel } from "@/components/BookingPanel";
import { PlaceImage } from "@/components/PlaceImage";
import { useTravelPlan } from "@/lib/travel-plan-store";
import { computeRoute } from "@/lib/tripMath";
import { findPlace } from "@/data/places";
import {
  EXAMPLES, DURATIONS, STARTS, EMPTY_DRAFT, readDraft, missingFields, briefFromDraft, unsupportedPlaces, startLabel, planSteps, setTomorrow,
  newPlan, fillPlan, routeStops, toggleStop, placeOptions, dinnerOptions, getDinner,
  CHENGDU_HOTELS, JIUZHAI_HOTELS, TRANSFERS, MEALS, optionById, type Plan, type Step, type Option, type Draft, type Field, type Brief,
} from "@/lib/travel-plan";
import { cn } from "@/lib/utils";
import { WeatherPill } from "./WeatherPill";

type Lang = "en" | "zh";
const STEP_LABEL: Record<Step, { en: string; zh: string }> = {
  places: { en: "Places", zh: "去哪逛" }, dinner: { en: "Dinner", zh: "晚餐" },
  chengduHotel: { en: "Tonight’s hotel", zh: "今晚住宿" }, tomorrow: { en: "Tomorrow · Jiuzhaigou", zh: "明天 · 九寨沟" }, summary: { en: "Your plan", zh: "行程总览" },
};
const FIELD_LABEL: Record<Field, { en: string; zh: string }> = {
  minutes: { en: "how much time", zh: "有多少时间" }, start: { en: "where you start", zh: "从哪出发" },
  stayTonight: { en: "tonight’s stay", zh: "今晚住哪" }, tomorrow: { en: "tomorrow", zh: "明天的安排" },
};
const hoursLabel = (minutes: number, lang: Lang) => {
  const known = DURATIONS.find((d) => d.minutes === minutes);
  if (known) return known[lang];
  const h = Math.round((minutes / 60) * 10) / 10;
  return lang === "zh" ? `${h} 小时` : `${h} hours`;
};

export function briefSummary(brief: Brief, lang: Lang) {
  const zh = lang === "zh";
  return [
    hoursLabel(brief.minutes, lang),
    zh ? `从${startLabel(brief.start, lang)}出发` : `from ${startLabel(brief.start, lang)}`,
    brief.stayTonight ? (zh ? "今晚住成都" : "staying in Chengdu tonight") : (zh ? "已有住处" : "hotel sorted"),
    brief.tomorrow === "jiuzhaigou" ? (zh ? "明天去九寨沟" : "Jiuzhaigou tomorrow") : (zh ? "明天未安排" : "tomorrow open"),
    ...(brief.noSpice ? [zh ? "不吃辣" : "no spice"] : []), ...(brief.vegetarian ? [zh ? "素食" : "vegetarian"] : []),
  ];
}

export function Planner({ lang, onOpenPlace }: { lang: Lang; onOpenPlace: (id: string) => void }) {
  const zh = lang === "zh";
  const { plan, setPlan, draft, setDraft } = useTravelPlan();
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [booking, setBooking] = useState<null | "chengdu" | "jiuzhaigou">(null);
  const showBuilder = !plan || editing;

  function start(mode: Plan["mode"]) {
    const brief = briefFromDraft({ ...draft, rain: draft.rain || useTravelPlan.getState().weather.rain }, text);
    if (!brief) return;
    setPlan(newPlan(brief, mode, draft.carryStops));
    setDraft({ ...draft, carryStops: [] });
    setEditing(false);
  }

  return (
    <div className="space-y-6">
      {showBuilder
        ? <Builder lang={lang} text={text} setText={setText} draft={draft} setDraft={setDraft} onStart={start} onCancel={plan ? () => setEditing(false) : undefined} />
        : plan && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "你的需求" : "Your brief"}</span>
            {briefSummary(plan.brief, lang).map((t) => <span key={t} className="rounded-full bg-cream px-3 py-1 text-xs">{t}</span>)}
            <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => setEditing(true)}><Pencil className="size-3.5" />{zh ? "改需求" : "Edit brief"}</Button>
          </div>
        )}

      {plan && !editing && <Workbench lang={lang} plan={plan} setPlan={setPlan} onOpenPlace={onOpenPlace} onBook={setBooking} />}

      <Sheet open={booking !== null} onOpenChange={(o) => !o && setBooking(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader><SheetTitle>{zh ? "预订与核对" : "Book & verify"}</SheetTitle></SheetHeader>
          {booking && <BookingPanel destination={booking} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Builder({ lang, text, setText, draft, setDraft, onStart, onCancel }: {
  lang: Lang; text: string; setText: (t: string) => void; draft: Draft; setDraft: (d: Draft) => void;
  onStart: (mode: Plan["mode"]) => void; onCancel?: (() => void) | undefined;
}) {
  const zh = lang === "zh";
  const missing = missingFields(draft);
  const unsupported = unsupportedPlaces(text);
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  const onText = (value: string) => { setText(value); setDraft({ ...draft, ...readDraft(value) }); };
  const useExample = (value: string) => { setText(value); setDraft({ ...EMPTY_DRAFT, carryStops: draft.carryStops, ...readDraft(value) }); };
  const durations = draft.minutes !== null && !DURATIONS.some((d) => d.minutes === draft.minutes) ? [...DURATIONS, { minutes: draft.minutes, en: hoursLabel(draft.minutes, "en"), zh: hoursLabel(draft.minutes, "zh") }] : DURATIONS;
  const todo = zh ? "待选" : "Pick one";
  const carried = draft.carryStops.flatMap((id) => findPlace(id) ?? []);

  return (
    <div className="space-y-5 border-b border-border/60 pb-6">
      <div>
        <label htmlFor="brief" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{zh ? "说说你的情况，或直接在下面点选" : "Describe your trip, or just tap below"}</label>
        <textarea id="brief" value={text} onChange={(e) => onText(e.target.value)} rows={2}
          placeholder={zh ? "例如：下午三小时，从天府广场出发，不吃辣……" : "e.g. Three hours this afternoon from Tianfu Square, no spicy food…"}
          className="mt-2 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/70 focus:border-planner-green" />
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{zh ? "不知道怎么说？试试：" : "Need ideas?"}</span>
          {EXAMPLES[lang].map((ex) => (
            <Button key={ex} type="button" variant="ghost" size="sm" className="h-auto max-w-full whitespace-normal rounded-full border border-border/70 px-3 py-1 text-left text-xs font-normal" onClick={() => useExample(ex)}>{ex}</Button>
          ))}
        </div>
        {unsupported.length > 0 && <p className="mt-2 text-xs text-destructive">{zh ? `演示版还没有收录 ${unsupported.join("、")} 的内容；目前可以安排成都市区，以及明天延伸到九寨沟。` : `This demo has no curated content for ${unsupported.join(", ")} yet. It covers central Chengdu and an optional Jiuzhaigou day.`}</p>}
      </div>

      {carried.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-cream/60 px-3 py-2 text-xs">
          <MapPin className="size-3.5 text-coral" />
          <span>{zh ? "已带上漫游路线：" : "Bringing your walk:"} <strong>{carried.map((p) => (zh ? p.zhName : p.name)).join(" → ")}</strong></span>
          <Button type="button" variant="ghost" size="icon" className="ml-auto size-6" aria-label={zh ? "不带上" : "Remove"} onClick={() => set({ carryStops: [] })}><X className="size-3.5" /></Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ChipRow label={zh ? "有多少时间" : "Time you have"} missing={draft.minutes === null && todo}>
          {durations.map((d) => <Chip key={d.minutes} on={draft.minutes === d.minutes} onClick={() => set({ minutes: d.minutes })}>{d[lang]}</Chip>)}
        </ChipRow>
        <ChipRow label={zh ? "从哪出发" : "Starting from"} missing={draft.start === null && todo}>
          {STARTS.map((s) => <Chip key={s.id} on={draft.start === s.id} onClick={() => set({ start: s.id })}>{s[lang]}</Chip>)}
        </ChipRow>
        <ChipRow label={zh ? "今晚住哪" : "Tonight"} missing={draft.stayTonight === null && todo}>
          <Chip on={draft.stayTonight === true} onClick={() => set({ stayTonight: true })}>{zh ? "住成都，帮我挑酒店" : "Help me pick a hotel"}</Chip>
          <Chip on={draft.stayTonight === false} onClick={() => set({ stayTonight: false })}>{zh ? "已经有住处" : "Already sorted"}</Chip>
        </ChipRow>
        <ChipRow label={zh ? "明天" : "Tomorrow"} missing={draft.tomorrow === null && todo} note={zh ? "周边目前收录九寨沟一条线路" : "Jiuzhaigou is the regional trip in this demo"}>
          <Chip on={draft.tomorrow === "none"} onClick={() => set({ tomorrow: "none" })}>{zh ? "先只安排今天" : "Just today for now"}</Chip>
          <Chip on={draft.tomorrow === "jiuzhaigou"} onClick={() => set({ tomorrow: "jiuzhaigou" })}>{zh ? "去九寨沟" : "Go to Jiuzhaigou"}</Chip>
        </ChipRow>
        <ChipRow label={zh ? "饮食（可选）" : "Food (optional)"}>
          <Chip on={draft.noSpice} onClick={() => set({ noSpice: !draft.noSpice })}>{zh ? "不吃辣" : "No spice"}</Chip>
          <Chip on={draft.vegetarian} onClick={() => set({ vegetarian: !draft.vegetarian })}>{zh ? "素食" : "Vegetarian"}</Chip>
        </ChipRow>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" disabled={missing.length > 0} className="rounded-lg bg-planner-green text-planner-on-green hover:bg-planner-green/90" onClick={() => onStart("guided")}><Wand2 className="size-4" />{zh ? "全部听 AI 的，一键托管" : "Let AI plan it all"}</Button>
        <Button type="button" disabled={missing.length > 0} variant="outline" className="rounded-lg" onClick={() => onStart("manual")}>{zh ? "我来选，一步步安排" : "I’ll choose step by step"}<ArrowRight className="size-4" /></Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>{zh ? "取消" : "Cancel"}</Button>}
        <p className="w-full text-xs text-muted-foreground" aria-live="polite">
          {missing.length
            ? (zh ? `还差：${missing.map((f) => FIELD_LABEL[f].zh).join("、")}` : `Still need ${missing.map((f) => FIELD_LABEL[f].en).join(", ")}.`)
            : onCancel ? (zh ? "重新开始会替换当前行程。" : "Starting again replaces your current plan.") : (zh ? "信息齐了，选一种方式开始。" : "All set — choose how to start.")}
        </p>
      </div>
    </div>
  );
}

function ChipRow({ label, missing, note, children }: { label: string; missing?: string | false; note?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
        {label}{missing && <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-medium text-coral">{missing}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {note && <p className="mt-1.5 text-[11px] text-muted-foreground">{note}</p>}
    </fieldset>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" variant="outline" size="sm" aria-pressed={on} onClick={onClick}
      className={cn("h-8 rounded-full px-3 text-xs", on ? "border-planner-green bg-planner-green text-planner-on-green hover:bg-planner-green/90 hover:text-planner-on-green" : "bg-background")}>
      {on && <Check className="size-3" />}{children}
    </Button>
  );
}

function Workbench({ lang, plan, setPlan, onOpenPlace, onBook }: { lang: Lang; plan: Plan; setPlan: (p: Plan) => void; onOpenPlace: (id: string) => void; onBook: (d: "chengdu" | "jiuzhaigou") => void }) {
  const zh = lang === "zh";
  const stops = routeStops(plan);
  const route = computeRoute(stops, plan.brief.start);
  const steps = planSteps(plan);
  const step: Step = steps.includes(plan.step) ? plan.step : "summary";
  const idx = steps.indexOf(step);
  const go = (step: Step) => setPlan({ ...plan, step });
  const set = (patch: Partial<Plan>) => setPlan({ ...plan, ...patch, saved: false });
  const name = (o?: Option) => (o ? (zh ? o.zh : o.en) : zh ? "未选" : "Not chosen");

  return (
    <div className="overflow-hidden border-y border-border/60 bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-cream/50 px-4 py-3">
        {steps.map((s, i) => (
          <Button variant="ghost" key={s} type="button" onClick={() => go(s)} aria-current={s === step ? "step" : undefined}
            className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium", s === step ? "bg-foreground text-background" : i < idx ? "text-foreground" : "text-muted-foreground")}>
            <span className={cn("grid size-4 place-items-center rounded-lg text-[10px]", i < idx ? "bg-leaf text-background" : "border border-current")}>{i < idx ? <Check className="size-3" /> : i + 1}</span>
            {zh ? STEP_LABEL[s].zh : STEP_LABEL[s].en}
          </Button>
        ))}
        <WeatherPill lang={lang} className="ml-auto" />
      </div>

      <div className="p-4 sm:p-6">
        {step === "places" && (
          <div className="space-y-4">
            <Hint>{zh ? `可用 ${plan.brief.minutes} 分钟，从${startLabel(plan.brief.start, "zh")}出发。${plan.rain ? "雨天只显示室内地点，晴天选择会保留。" : "选感兴趣的地方加入今日路线。"}` : `${plan.brief.minutes} min from ${startLabel(plan.brief.start, "en")}. ${plan.rain ? "Rain shows indoor places; your sunny picks are kept." : "Pick what interests you."}`}</Hint>
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

        {step === "dinner" && (
          <Choice lang={lang} hint={zh ? `按你最后一站就近排序${plan.brief.noSpice ? "，已考虑不吃辣" : ""}。` : `Sorted by distance from your last stop${plan.brief.noSpice ? ", mild food first" : ""}.`}
            options={dinnerOptions(plan)} value={plan.dinner} onPick={(id) => set({ dinner: id })} />
        )}
        {step === "chengduHotel" && (
          <Choice lang={lang} hint={zh ? "三个候选，选一个住今晚。明早要赶高铁的话东站最省事。" : "Three options for tonight. East Station is easiest for tomorrow’s train."}
            options={CHENGDU_HOTELS} value={plan.chengduHotel} onPick={(id) => set({ chengduHotel: id })} />
        )}
        {step === "tomorrow" && (
          <div className="space-y-6">
            <div className="border-l-2 border-planner-green pl-4 text-sm leading-relaxed">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold">{zh ? "成都东 → 黄龙九寨站 → 九寨沟口" : "Chengdu East → Huanglong Jiuzhai Station → Park gate"}</h3>
                <Button type="button" variant="ghost" size="sm" className="-mt-1 h-7 text-xs" onClick={() => setPlan(setTomorrow(plan, "none"))}><X className="size-3.5" />{zh ? "明天不去了" : "Remove this day"}</Button>
              </div>
              <p className="mt-1 text-muted-foreground">{zh ? "明早乘高铁，再接驳到酒店；下午抵达、休息或在沟口散步。完整游览景区建议留到后一天，车次与门票以官方渠道为准。" : "Morning train, then transfer to your hotel. Settle in or walk near the gate in the afternoon. Allow the following day for the park; verify train times and tickets officially."}</p>
            </div>
            <Choice lang={lang} title={zh ? "高铁到站后怎么去酒店" : "From the train to your hotel"} options={TRANSFERS} value={plan.transfer} onPick={(id) => set({ transfer: id })} />
            <Choice lang={lang} title={zh ? "九寨沟住宿" : "Jiuzhaigou stay"} options={JIUZHAI_HOTELS} value={plan.jiuzhaiHotel} onPick={(id) => set({ jiuzhaiHotel: id })} />
            <Choice lang={lang} title={zh ? "明天晚餐" : "Tomorrow’s dinner"} options={MEALS} value={plan.meal} onPick={(id) => set({ meal: id })} />
          </div>
        )}
        {step === "summary" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Day title={zh ? "今天 · 成都" : "Today · Chengdu"} rows={[
              [zh ? "路线" : "Route", stops.length ? `${stops.map((s) => (zh ? s.zhName : s.name)).join(" → ")} · ${route.totalMin} ${zh ? "分钟" : "min"}` : (zh ? "未选" : "Not chosen")],
              [zh ? "晚餐" : "Dinner", name(getDinner(plan.dinner))],
              [zh ? "住宿" : "Hotel", plan.brief.stayTonight ? name(optionById(CHENGDU_HOTELS, plan.chengduHotel)) : (zh ? "已有住处" : "Already sorted")],
            ]} onBook={() => onBook("chengdu")} lang={lang} />
            {plan.brief.tomorrow === "jiuzhaigou" ? <Day title={zh ? "明天 · 九寨沟" : "Tomorrow · Jiuzhaigou"} rows={[
              [zh ? "路线" : "Route", zh ? "成都东 → 黄龙九寨站 → 沟口；抵达休息，后一天游景区" : "Chengdu East → Huanglong Jiuzhai → Gate; settle in, park the following day"],
              [zh ? "接驳" : "Transfer", name(optionById(TRANSFERS, plan.transfer))],
              [zh ? "住宿" : "Hotel", name(optionById(JIUZHAI_HOTELS, plan.jiuzhaiHotel))],
              [zh ? "晚餐" : "Dinner", name(optionById(MEALS, plan.meal))],
            ]} onBook={() => onBook("jiuzhaigou")} lang={lang} /> : (
              <div className="flex flex-col justify-between gap-3 rounded-lg border border-dashed border-border p-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{zh ? "明天还没安排" : "Tomorrow is open"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{zh ? "想去周边，可以随时加一天；今天的选择都会保留。" : "Add a regional day whenever you like — today’s choices stay as they are."}</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="self-start rounded-lg" onClick={() => setPlan(setTomorrow(plan, "jiuzhaigou"))}><CalendarPlus className="size-4" />{zh ? "明天去九寨沟" : "Add Jiuzhaigou tomorrow"}</Button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
              <Button type="button" className="rounded-lg" disabled={plan.saved} onClick={() => setPlan({ ...plan, saved: true })}>
                <Bookmark className="size-4" />{plan.saved ? (zh ? "已保存到本机" : "Saved on this device") : (zh ? "保存行程" : "Save plan")}
              </Button>
              <span className="text-xs text-muted-foreground">{plan.mode === "guided" ? (zh ? "由 AI 托管填写，可点上方任一步修改。" : "Filled by AI; tap any step above to change it.") : (zh ? "你可以随时回到任一步修改。" : "Tap any step to revise.")}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="ghost" size="sm" disabled={idx === 0} onClick={() => { const previous = steps[idx - 1]; if (previous) go(previous); }}><ArrowLeft className="size-4" />{zh ? "上一步" : "Back"}</Button>
          <div className="flex flex-wrap gap-2">
            {step !== "summary" && <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => setPlan(fillPlan(plan))}><Sparkles className="size-4" />{zh ? "剩下的交给 AI" : "AI fills the rest"}</Button>}
            {step !== "summary" && <Button type="button" size="sm" className="rounded-lg bg-planner-green text-planner-on-green hover:bg-planner-green/90" onClick={() => { const next = steps[idx + 1]; if (next) go(next); }}>{zh ? "下一步" : "Next"}<ArrowRight className="size-4" /></Button>}
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
