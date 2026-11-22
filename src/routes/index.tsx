import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, MapPin, Shuffle, Route as RouteIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PMViewSheet } from "@/components/PMViewSheet";
import { PlaceImage } from "@/components/PlaceImage";
import { PlaceDetailSheet } from "@/components/PlaceDetailSheet";
import { Planner } from "@/components/home/Planner";
import { WanderMode } from "@/components/home/WanderMode";
import { useApp } from "@/lib/store";
import { useTravelPlan } from "@/lib/travel-plan-store";
import { newPlan, readBrief, SAMPLE } from "@/lib/travel-plan";
import { findPlace } from "@/data/places";
import jinliPhoto from "@/assets/jinli.asset.json";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Chengdu Lens — City walks & two-day travel plans" },
    { name: "description", content: "Discover a spontaneous Chengdu walk or plan an afternoon, dinner, hotels and tomorrow’s Jiuzhaigou journey in one bilingual travel demo." },
    { property: "og:title", content: "Chengdu Lens — Walk today, plan tomorrow" },
    { property: "og:description", content: "Curated city walks and a shared two-day itinerary with rain alternatives and clearly labeled booking simulations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  const lang = useApp((s) => s.lang);
  const zh = lang === "zh";
  const { entryMode, setEntryMode, setPlan } = useTravelPlan();
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => { void useTravelPlan.persist.rehydrate(); }, []);
  const openPlace = openId ? findPlace(openId) ?? null : null;
  const scrollToTrip = () => document.getElementById("trip")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-planner-wash">
      <section id="top" className="relative isolate overflow-hidden">
        <PlaceImage src={jinliPhoto.url} alt={zh ? "成都锦里入口与红灯笼" : "The entrance to Jinli Ancient Street in Chengdu"} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-planner-scrim/50" />
        <div className="relative mx-auto flex min-h-[330px] max-w-6xl flex-col justify-center px-5 py-10 text-planner-photo-text sm:min-h-[360px] sm:px-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium"><MapPin className="size-4" />{zh ? "中国 · 成都" : "CHENGDU, CHINA"}</p>
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">{zh ? "成都漫游" : "Chengdu Lens"}</h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed sm:text-lg">{zh ? "想随意走走，还是把今天和明天都安排好？" : "A little wandering, or a plan for today and tomorrow?"}</p>
          <Button variant="outline" className="mt-6 w-fit border-planner-photo-text/50 bg-transparent text-planner-photo-text hover:bg-planner-photo-text hover:text-planner-scrim" onClick={scrollToTrip}>{zh ? "从这里出发" : "Let’s go"}<ArrowRight className="size-4" /></Button>
          <span className="absolute bottom-4 right-5 text-xs text-planner-photo-text/80 sm:right-8">{zh ? "锦里古街" : "Jinli Ancient Street"}</span>
        </div>
      </section>

      <section id="trip" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex max-w-full rounded-lg border border-border bg-card p-1" role="tablist" aria-label={zh ? "旅行方式" : "Travel mode"}>
              <Button id="wander-tab" role="tab" aria-selected={entryMode === "wander"} aria-controls="travel-panel" variant="ghost" className={cn("px-3 sm:px-5", entryMode === "wander" && "bg-planner-green text-planner-on-green hover:bg-planner-green hover:text-planner-on-green")} onClick={() => setEntryMode("wander")}><Shuffle className="size-4" />{zh ? "随性漫游" : "Just wander"}</Button>
              <Button id="plan-tab" role="tab" aria-selected={entryMode === "plan"} aria-controls="travel-panel" variant="ghost" className={cn("px-3 sm:px-5", entryMode === "plan" && "bg-planner-green text-planner-on-green hover:bg-planner-green hover:text-planner-on-green")} onClick={() => setEntryMode("plan")}><RouteIcon className="size-4" />{zh ? "安排两日行程" : "Plan two days"}</Button>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Compass className="size-3.5" />{zh ? "成都 → 九寨沟" : "Chengdu → Jiuzhaigou"}</span>
          </div>
          <div id="travel-panel" role="tabpanel" aria-labelledby={entryMode === "wander" ? "wander-tab" : "plan-tab"}>
            <h2 className="mb-5 font-display text-2xl font-semibold">{entryMode === "wander" ? (zh ? "今天，想怎么逛？" : "What are you in the mood for?") : (zh ? "把今天和明天，串成一次旅行。" : "Today and tomorrow, one journey.")}</h2>
            {entryMode === "wander" ? <WanderMode lang={lang} onOpenPlace={setOpenId} onExpand={(stops, rain) => {
              const brief = readBrief(SAMPLE[lang]);
              if (!brief) return;
              const next = newPlan(brief, "manual");
              setPlan({ ...next, rain, ...(rain ? { rainyStops: stops.map((p) => p.id) } : { sunnyStops: stops.map((p) => p.id) }) });
              setEntryMode("plan");
              scrollToTrip();
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
