import { useEffect } from "react";
import { CloudRain, Sun, Loader2 } from "lucide-react";
import { useTravelPlan } from "@/lib/travel-plan-store";
import { fetchChengduWeather } from "@/lib/weather";
import { changeWeather } from "@/lib/travel-plan";
import { cn } from "@/lib/utils";

/** Detects Chengdu weather once and applies it to both modes; a small link lets the traveler override it. */
export function useAutoWeather() {
  const setWeather = useTravelPlan((s) => s.setWeather);
  useEffect(() => {
    const ctl = new AbortController();
    fetchChengduWeather(ctl.signal)
      .then(({ rain, temp }) => { setWeather({ status: "live", rain, temp }); applyRain(rain); })
      .catch(() => { if (!ctl.signal.aborted) setWeather({ status: "offline", rain: false }); });
    return () => ctl.abort();
  }, [setWeather]);
}

function applyRain(rain: boolean) {
  const { plan, setPlan, wander, setWander } = useTravelPlan.getState();
  setWander({ ...wander, rain, mood: rain ? wander.mood : wander.mood === "indoor" ? "tea" : wander.mood });
  if (plan) setPlan(changeWeather(plan, rain));
}

export function WeatherPill({ lang, className }: { lang: "en" | "zh"; className?: string }) {
  const zh = lang === "zh";
  const weather = useTravelPlan((s) => s.weather);
  const setWeather = useTravelPlan((s) => s.setWeather);
  const { rain, status, temp, override } = weather;
  if (status === "loading") return <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}><Loader2 className="size-3.5 animate-spin" />{zh ? "正在获取成都天气…" : "Checking Chengdu weather…"}</span>;
  const label = status === "live" && !override
    ? (zh ? `成都此刻${rain ? "有雨" : "无雨"}${temp !== undefined ? ` · ${temp}°C` : ""}` : `Chengdu now: ${rain ? "rain" : "dry"}${temp !== undefined ? ` · ${temp}°C` : ""}`)
    : (zh ? (rain ? "按雨天安排" : "按晴天安排") : rain ? "Planning for rain" : "Planning for dry weather");
  const hint = rain ? (zh ? "已换成室内与有遮蔽的地点" : "Indoor & covered stops") : (zh ? "户外街巷都可去" : "Outdoor streets are fine");
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs", className)}>
      {rain ? <CloudRain className="size-3.5 text-sky" /> : <Sun className="size-3.5 text-sun-foreground" />}
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{hint}</span>
      <button type="button" className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
        onClick={() => { setWeather({ ...weather, rain: !rain, override: true }); applyRain(!rain); }}>
        {zh ? (rain ? "其实没下雨" : "其实在下雨") : rain ? "It’s not raining" : "It’s raining"}
      </button>
    </span>
  );
}
