import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { places, findPlace } from "@/data/places";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { CloudRain, MapPin, Clock, Footprints, RotateCcw, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("")({
  head: () => ({
    meta: [
      { title: "Route — Chengdu Lens" },
      { name: "description", content: "Your Chengdu half-day route with the Agent's trade-off and a one-click rain replan." },
      { property: "og:title", content: "Route · Chengdu Lens" },
      { property: "og:description", content: "A walkable half-day route with rain-ready replan." },
    ],
  }),
  component: RoutePage,
});

const RAIN_SWAP: Record<string, string> = {
  "peoples-park": "chengdu-museum",
  "wenshu-monastery": "chengdu-museum",
  "du-fu-thatched-cottage": "chengdu-museum",
  "jinli-alley": "chengdu-museum",
};

function RoutePage() {
  const lang = useApp((s) => s.lang);
  const routeIds = useApp((s) => s.routeIds);
  const saves = useApp((s) => s.saves);
  const rainActive = useApp((s) => s.rainActive);
  const setRain = useApp((s) => s.setRain);
  const profile = useApp((s) => s.profile);
  const t = dict[lang];

  const ids = routeIds.length ? routeIds : saves.slice(0, 4);
  const originalStops = useMemo(() => ids.map(findPlace).filter(Boolean) as typeof places, [ids]);

  const rainStops = useMemo(() => {
    if (!rainActive) return originalStops;
    let swapped = false;
    return originalStops.map((p) => {
      if (!swapped && !p.indoor && RAIN_SWAP[p.id]) {
        const swap = findPlace(RAIN_SWAP[p.id]);
        if (swap) {
          swapped = true;
          return swap;
        }
      }
      return p;
    });
  }, [originalStops, rainActive]);

  const stops = rainActive ? rainStops : originalStops;

  if (stops.length < 3) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t.route.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.route.needMore}</p>
        <Link to="/collection">
          <Button className="mt-6 bg-coral text-coral-foreground hover:bg-coral/90">{t.route.goCollection}</Button>
        </Link>
      </div>
    );
  }

  const totalDwell = stops.reduce((s, p) => s + p.duration, 0);
  const totalTransit = stops.reduce((s, p) => s + p.distanceFromStartMin, 0);
  const totalMin = totalDwell + totalTransit;
  const endBy = profile?.endBy ?? "18:30";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{t.route.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.route.subtitle.replace("{time}", endBy)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rainActive ? (
            <Button variant="outline" size="sm" onClick={() => setRain(false)}>
              <RotateCcw className="h-4 w-4 mr-1" />
              {t.route.undoRain}
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-sky text-sky-foreground hover:bg-sky/90"
              onClick={() => setRain(true)}
            >
              <CloudRain className="h-4 w-4 mr-1" />
              {t.route.rain}
            </Button>
          )}
        </div>
      </div>

      {rainActive && (
        <div className="mb-6 rounded-2xl border border-sky/40 bg-sky/10 p-4 text-sm flex items-start gap-3">
          <CloudRain className="h-5 w-5 text-sky shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{t.route.rainActive}</p>
            <RainDiff original={originalStops} replanned={rainStops} lang={lang} />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Timeline */}
        <div className="space-y-3">
          {stops.map((p, i) => {
            const wasReplaced = rainActive && originalStops[i]?.id !== p.id;
            return (
              <div key={p.id + i}>
                {i > 0 && (
                  <div className="ml-5 my-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Footprints className="h-3.5 w-3.5" />
                    <span>~{p.distanceFromStartMin || 12} min {t.route.walk}</span>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="relative flex gap-4 rounded-2xl card-soft p-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background font-display font-semibold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      <span className="text-sm text-muted-foreground">{p.zhName}</span>
                      {wasReplaced && (
                        <span className="rounded-full bg-sky/15 text-sky px-2 py-0.5 text-[10px] font-semibold">
                          {t.route.replaced}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lang === "en" ? p.category : p.categoryZh} · {p.area}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-foreground/75">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {p.duration} {t.collection.minutes} {t.route.stay}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.indoor ? "indoor" : "outdoor"}
                      </span>
                    </div>
                    {i === 1 && (
                      <div className="mt-3 rounded-lg bg-sun/15 border border-sun/40 p-2 text-xs">
                        <span className="font-semibold">{t.route.tradeoff}: </span>
                        {lang === "en"
                          ? "Chose neighborhood texture over one more classic attraction — better fits the 4-hour, walk-first constraint."
                          : "选择街区肌理而非再加一个经典景点 —— 更符合 4 小时步行优先的约束。"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="ml-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Footprints className="h-3.5 w-3.5" />
            <span>~15 min {t.route.buffer}</span>
          </div>
          <div className="rounded-2xl border border-dashed border-border p-4 text-sm">
            <span className="font-semibold">{t.route.totalTime}: </span>
            {Math.round(totalMin / 60 * 10) / 10}h · {stops.length} stops · back by {endBy}
          </div>
        </div>

        {/* Demo map */}
        <aside className="lg:sticky lg:top-24 self-start">
          <DemoMap stops={stops} originalStops={originalStops} rainActive={rainActive} />
        </aside>
      </div>
    </div>
  );
}

function RainDiff({
  original,
  replanned,
  lang,
}: {
  original: (typeof places)[number][];
  replanned: (typeof places)[number][];
  lang: "en" | "zh";
}) {
  const t = dict[lang];
  const diffs = original
    .map((o, i) => ({ o, r: replanned[i] }))
    .filter((d) => d.o.id !== d.r.id);

  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {diffs.map((d, i) => (
        <div key={i} className="rounded-xl bg-background/60 border border-border p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through">{d.o.name}</span>
            <span>→</span>
            <span className="font-semibold text-leaf">{d.r.name}</span>
          </div>
          <p className="mt-1 text-foreground/70">
            <span className="font-semibold">{t.route.reason}: </span>
            {lang === "en"
              ? `Outdoor stop replaced with indoor equivalent (${d.r.duration} min) to preserve route arc.`
              : `将户外点位替换为等长室内项目（${d.r.duration} 分钟），保持路线弧线。`}
          </p>
          <p className="mt-1 text-foreground/60">
            <span className="font-semibold">{t.route.newRisk}: </span>
            {lang === "en"
              ? "Reservation & passport rules should be verified before arrival."
              : "抵达前需核实预约与护照规则。"}
          </p>
        </div>
      ))}
      {diffs.length === 0 && (
        <p className="text-xs text-muted-foreground">
          {lang === "en" ? "All stops already indoor-friendly." : "所有站点已是室内友好。"}
        </p>
      )}
    </div>
  );
}

function DemoMap({
  stops,
  originalStops,
  rainActive,
}: {
  stops: (typeof places)[number][];
  originalStops: (typeof places)[number][];
  rainActive: boolean;
}) {
  const path = stops.map((s) => `${s.x},${s.y}`).join(" ");
  const originalPath = originalStops.map((s) => `${s.x},${s.y}`).join(" ");
  return (
    <div className="rounded-3xl card-soft overflow-hidden">
      <div className="relative aspect-[4/5] bg-gradient-to-br from-sky/10 via-leaf/10 to-sun/15">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" className="text-foreground" />
          {rainActive && (
            <polyline
              points={originalPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="1.5,1.5"
              className="text-muted-foreground"
            />
          )}
          <polyline
            points={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={rainActive ? "text-sky" : "text-coral"}
          />
          {stops.map((s, i) => (
            <g key={s.id + i}>
              <circle cx={s.x} cy={s.y} r="2.6" className="fill-background stroke-foreground" strokeWidth="0.5" />
              <text x={s.x} y={s.y + 1} textAnchor="middle" fontSize="3" className="fill-foreground font-semibold">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-3 left-3 rounded-full bg-background/90 border border-border px-3 py-1 text-xs font-medium">
          Chengdu · demo map
        </div>
      </div>
      <div className="p-4 space-y-1.5 text-xs">
        {stops.map((s, i) => (
          <div key={s.id + i} className="flex items-center gap-2">
            <span className={cn("grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold", rainActive ? "bg-sky text-sky-foreground" : "bg-coral text-coral-foreground")}>
              {i + 1}
            </span>
            <span className="truncate">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

