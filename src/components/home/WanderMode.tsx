import { useMemo } from "react";
import { Shuffle, CloudRain, Sun, ArrowRight, Clock, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Place } from "@/data/places";
import { computeRoute } from "@/lib/tripMath";
import { PlaceImage } from "@/components/PlaceImage";
import { cn } from "@/lib/utils";

import { MOODS, wanderRoute } from "@/lib/wander";
import { useTravelPlan } from "@/lib/travel-plan-store";

export function WanderMode({ lang, onExpand, onOpenPlace }: { lang: "en" | "zh"; onExpand: (stops: Place[], rain: boolean) => void; onOpenPlace: (id: string) => void }) {
  const zh = lang === "zh";
  const { wander, setWander } = useTravelPlan();
  const { mood, seed, rain } = wander;
  const stops = useMemo(() => wanderRoute(rain ? "indoor" : mood, seed, rain), [mood, seed, rain]);
  const r = computeRoute(stops);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <Button variant="outline" aria-pressed={mood === m.id} key={m.id} type="button" onClick={() => { setWander({ mood: m.id, seed: 0, rain: m.id === "indoor" }); }}
            className={cn("rounded-lg border px-4 py-2 text-sm transition", mood === m.id ? "border-coral bg-coral text-coral-foreground" : "border-border bg-background hover:border-coral/60")}>
            {zh ? m.zh : m.en}
          </Button>
        ))}
      </div>
      <div className="overflow-hidden border-y border-border/60 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-cream/50 px-5 py-3 text-sm">
          <span className="font-display font-semibold">{zh ? "从太古里出发的一段惊喜漫游" : "A surprise walk from Taikoo Li"}</span>
          <span className="flex items-center gap-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{zh ? `约 ${r.totalMin} 分钟` : `~${r.totalMin} min`}</span>
            <span className="inline-flex items-center gap-1"><Footprints className="size-3.5" />{stops.length} {zh ? "站" : "stops"}</span>
          </span>
        </div>
        <ol className="grid gap-px bg-border/60 sm:grid-cols-2">
          {stops.map((p, i) => (
            <li key={p.id} className="bg-background">
              <Button variant="ghost" type="button" onClick={() => onOpenPlace(p.id)} className="group flex h-auto w-full items-start justify-start gap-4 whitespace-normal p-4 text-left">
                <PlaceImage src={p.image.url} alt={p.image.alt} className="h-20 w-24 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">{zh ? `第 ${i + 1} 站` : `Stop ${i + 1}`} · {r.legs[i]?.minutes} {zh ? "分钟路程" : "min away"}</p>
                  <p className="font-semibold group-hover:text-coral">{zh ? p.zhName : p.name}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{zh ? p.whyFitsZh : p.whyFits}</p>
                </div>
              </Button>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 border-t border-border/60 p-4">
          <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => setWander({ ...wander, seed: seed + 1 })}><Shuffle className="size-4" />{zh ? "换一条" : "Shuffle"}</Button>
          <Button type="button" variant="outline" size="sm" className="rounded-lg" aria-pressed={rain} onClick={() => setWander({ ...wander, rain: !rain, mood: !rain ? mood : mood === "indoor" ? "tea" : mood })}>
            {rain ? <Sun className="size-4" /> : <CloudRain className="size-4" />}{rain ? (zh ? "恢复晴天" : "Back to sunny") : (zh ? "下雨了" : "It’s raining")}
          </Button>
          <Button type="button" size="sm" className="ml-auto rounded-lg bg-foreground text-background" onClick={() => onExpand(stops, rain)}>{zh ? "扩展成两日行程" : "Turn into a full trip"}<ArrowRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}
