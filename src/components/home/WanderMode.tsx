import { useMemo, useState } from "react";
import { Shuffle, CloudRain, Sun, ArrowRight, Clock, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { places, type Place } from "@/data/places";
import { computeRoute } from "@/lib/tripMath";
import { PlaceImage } from "@/components/PlaceImage";
import { cn } from "@/lib/utils";

type Mood = "tea" | "lanes" | "indoor";
const MOODS: { id: Mood; en: string; zh: string; ids: string[] }[] = [
  { id: "tea", en: "🍵 Tea & slow time", zh: "🍵 茶馆发呆", ids: ["peoples-park", "wenshu-monastery", "fangsuo-bookstore", "taikoo-li-street-loop"] },
  { id: "lanes", en: "🏮 Old lanes", zh: "🏮 街巷人文", ids: ["jinli-alley", "wenshu-monastery", "taikoo-li-street-loop", "peoples-park"] },
  { id: "indoor", en: "🌧️ Indoors", zh: "🌧️ 雨天室内", ids: ["chengdu-museum", "fangsuo-bookstore"] },
];

export function wanderRoute(mood: Mood, seed: number, rain: boolean, start = "Taikoo Li"): Place[] {
  const pool = (MOODS.find((m) => m.id === mood)?.ids ?? []).flatMap((id) => places.find((p) => p.id === id) ?? [])
    .filter((p) => !rain || p.indoor);
  const list = pool.length ? pool : places.filter((p) => p.indoor);
  const rotated = [...list.slice(seed % list.length), ...list.slice(0, seed % list.length)];
  const out: Place[] = [];
  for (const p of rotated) {
    if (computeRoute([...out, p], start).totalMin <= 150) out.push(p);
    if (out.length === 2) break;
  }
  return out.length ? out : rotated.slice(0, 1);
}

export function WanderMode({ lang, onExpand, onOpenPlace }: { lang: "en" | "zh"; onExpand: () => void; onOpenPlace: (id: string) => void }) {
  const zh = lang === "zh";
  const [mood, setMood] = useState<Mood>("tea");
  const [seed, setSeed] = useState(0);
  const [rain, setRain] = useState(false);
  const stops = useMemo(() => wanderRoute(rain ? "indoor" : mood, seed, rain), [mood, seed, rain]);
  const r = computeRoute(stops);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <button key={m.id} type="button" onClick={() => { setMood(m.id); setSeed(0); setRain(m.id === "indoor"); }}
            className={cn("rounded-full border px-4 py-2 text-sm transition", mood === m.id ? "border-coral bg-coral text-coral-foreground" : "border-border bg-background hover:border-coral/60")}>
            {zh ? m.zh : m.en}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
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
              <button type="button" onClick={() => onOpenPlace(p.id)} className="group flex w-full gap-4 p-4 text-left">
                <PlaceImage src={p.image.url} alt={p.image.alt} className="h-20 w-24 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">{zh ? `第 ${i + 1} 站` : `Stop ${i + 1}`} · {r.legs[i]?.minutes} {zh ? "分钟路程" : "min away"}</p>
                  <p className="font-semibold group-hover:text-coral">{zh ? p.zhName : p.name}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{zh ? p.whyFitsZh : p.whyFits}</p>
                </div>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 border-t border-border/60 p-4">
          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setSeed((s) => s + 1)}><Shuffle className="size-4" />{zh ? "换一条" : "Shuffle"}</Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full" aria-pressed={rain} onClick={() => setRain((v) => !v)}>
            {rain ? <Sun className="size-4" /> : <CloudRain className="size-4" />}{rain ? (zh ? "恢复晴天" : "Back to sunny") : (zh ? "下雨了" : "It’s raining")}
          </Button>
          <Button type="button" size="sm" className="ml-auto rounded-full bg-foreground text-background" onClick={onExpand}>{zh ? "扩展成两日行程" : "Turn into a full trip"}<ArrowRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}
