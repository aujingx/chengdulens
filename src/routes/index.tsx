import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, MapPin, Shuffle, Route as RouteIcon, ExternalLink, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PMViewSheet } from "@/components/PMViewSheet";
import { PlaceDetailSheet } from "@/components/PlaceDetailSheet";
import { Planner } from "@/components/home/Planner";
import { WanderMode } from "@/components/home/WanderMode";
import { useAutoWeather } from "@/components/home/WeatherPill";
import { useApp } from "@/lib/store";
import { useTravelPlan } from "@/lib/travel-plan-store";
import { findPlace } from "@/data/places";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Chengdu Lens — Chengdu walks and trip plans on your terms" },
    { name: "description", content: "Get a surprise Chengdu walk, or plan places, dinner and tonight’s stay around your own time, with an optional regional day such as Jiuzhaigou." },
    { property: "og:title", content: "Chengdu Lens — Your time, your Chengdu plan" },
    { property: "og:description", content: "A bilingual Chengdu travel demo: tell it your time and plans, choose your stops, and see rain alternatives and labelled booking simulations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  const lang = useApp((s) => s.lang);
  const zh = lang === "zh";
  const { entryMode, setEntryMode, draft, setDraft } = useTravelPlan();
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => { void useTravelPlan.persist.rehydrate(); }, []);
  useAutoWeather();
  const openPlace = openId ? findPlace(openId) ?? null : null;
  const scrollToTrip = () => document.getElementById("trip")?.scrollIntoView({ behavior: "smooth" });
  const go = (mode: "wander" | "plan") => { setEntryMode(mode); scrollToTrip(); };
  const ways = [
    { mode: "wander" as const, icon: Shuffle, title: zh ? "随便走走" : "Just wander", body: zh ? "说出你在哪、什么心情，给你一条 1–3 小时的惊喜路线" : "Say where you are and your mood; get a 1–3 hour surprise walk" },
    { mode: "plan" as const, icon: RouteIcon, title: zh ? "安排今天" : "Plan today", body: zh ? "按你的时间挑景点，再选晚饭和今晚住处" : "Pick places that fit your time, then dinner and tonight’s stay" },
    { mode: "plan" as const, icon: CalendarPlus, title: zh ? "需要的话，延伸到明天" : "Add tomorrow, if you want", body: zh ? "例如去九寨沟：高铁、接驳与住宿分开说清" : "e.g. Jiuzhaigou — rail, transfer and stay explained separately" },
  ];

  return (
    <div className="bg-planner-wash">
      <section id="top" className="border-b border-border/70 bg-hero-gradient">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20 md:grid-cols-[1.25fr_1fr] md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-planner-orange"><MapPin className="size-3.5" />{zh ? "中国 · 成都" : "Chengdu, China"}</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">{zh ? <>慢慢走，<br />成都会给你答案。</> : <>Wander slowly.<br />Chengdu will lead.</>}</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{zh ? "有两小时还是一整天、住哪、明天去不去周边——你说了算。告诉我你的情况，路线、晚饭和住处都由你来挑。" : "Two hours or a whole day, where to stay, whether to head out tomorrow — it’s your call. Tell us your situation and choose your own stops, dinner and stay."}</p>
          </div>
          <ul className="grid gap-2" aria-label={zh ? "你可以这样用" : "Ways to use it"}>
            {ways.map((w) => (
              <li key={w.title}>
                <Button type="button" variant="ghost" onClick={() => go(w.mode)} className="group h-auto w-full items-start justify-start gap-3 whitespace-normal rounded-lg border border-border/70 bg-card/70 p-4 text-left hover:bg-card">
                  <w.icon className="mt-0.5 size-4 shrink-0 text-planner-green" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{w.title}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{w.body}</span>
                  </span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="trip" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex max-w-full rounded-lg border border-border bg-card p-1" role="tablist" aria-label={zh ? "旅行方式" : "Travel mode"}>
              <Button id="wander-tab" role="tab" aria-selected={entryMode === "wander"} aria-controls="travel-panel" variant="ghost" className={cn("px-3 sm:px-5", entryMode === "wander" && "bg-planner-green text-planner-on-green hover:bg-planner-green hover:text-planner-on-green")} onClick={() => setEntryMode("wander")}><Shuffle className="size-4" />{zh ? "随性漫游" : "Just wander"}</Button>
              <Button id="plan-tab" role="tab" aria-selected={entryMode === "plan"} aria-controls="travel-panel" variant="ghost" className={cn("px-3 sm:px-5", entryMode === "plan" && "bg-planner-green text-planner-on-green hover:bg-planner-green hover:text-planner-on-green")} onClick={() => setEntryMode("plan")}><RouteIcon className="size-4" />{zh ? "定制行程" : "Plan my trip"}</Button>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Compass className="size-3.5" />{zh ? "成都市区 · 可选周边延伸" : "Central Chengdu · optional regional day"}</span>
          </div>
          <div id="travel-panel" role="tabpanel" aria-labelledby={entryMode === "wander" ? "wander-tab" : "plan-tab"}>
            <h2 className="mb-5 font-display text-2xl font-semibold">{entryMode === "wander" ? (zh ? "今天，想怎么逛？" : "What are you in the mood for?") : (zh ? "你的时间，你来安排。" : "Your time, your plan.")}</h2>
            {entryMode === "wander" ? <WanderMode lang={lang} onOpenPlace={setOpenId} onExpand={(stops, rain) => {
              // Carry the walk and its start point only; time, tonight and tomorrow are still the traveler's to state.
              setDraft({ ...draft, start: useTravelPlan.getState().wander.start, rain, carryStops: stops.map((p) => p.id) });
              go("plan");
            }} /> : <Planner lang={lang} onOpenPlace={setOpenId} />}
          </div>
        </div>
      </section>

      <section id="case-study" className="scroll-mt-20 border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-xs font-semibold text-planner-orange">{zh ? "产品背后的思考" : "BEHIND THE PRODUCT"}</p>
          <h2 className="font-display text-2xl font-semibold">{zh ? "关于成都漫游" : "About Chengdu Lens"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{zh ? "一个面向国际自由行游客的产品经理作品：在随性探索与确定性规划之间，让旅行建议走向可执行的安排。精选内容、晴雨备选与双语体验，服务同一段旅程。" : "A product management portfolio for international travelers: connecting spontaneous discovery with practical planning through curated places, rain alternatives and a bilingual journey."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <PMViewSheet trigger={<Button variant="outline" size="sm">{zh ? "PM 视角 · 指标与 AI 治理" : "PM view · Metrics & AI governance"}</Button>} />
            <Button asChild variant="ghost" size="sm"><a href={`https://github.com/aujingx/chengdulens/blob/main/docs/product-case-study-${zh ? "cn" : "en"}.md`} target="_blank" rel="noreferrer">{zh ? "完整产品案例" : "Full product case study"}<ExternalLink className="size-3.5" /></a></Button>
            <Button asChild variant="ghost" size="sm"><a href={`https://github.com/aujingx/chengdulens/blob/main/docs/product-spec-${zh ? "cn" : "en"}.md`} target="_blank" rel="noreferrer">{zh ? "产品规格说明" : "Product spec"}<ExternalLink className="size-3.5" /></a></Button>
          </div>
        </div>
      </section>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:px-8"><span>© Chengdu Lens</span><span>{zh ? "作品集演示 · 无实际预订或扣款" : "Portfolio demo · No real bookings or charges"}</span></div>
      </footer>
      <PlaceDetailSheet place={openPlace} onClose={() => setOpenId(null)} />
    </div>
  );
}
