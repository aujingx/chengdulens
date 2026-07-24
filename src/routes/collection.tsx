import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { places, findPlace } from "@/data/places";
import { PlaceImage } from "@/components/PlaceImage";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { Trash2, ArrowRight, Clock, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — Chengdu Lens" },
      { name: "description", content: "The Chengdu places you've saved, with time budget and category mix." },
      { property: "og:title", content: "Collection · Chengdu Lens" },
      { property: "og:description", content: "Your saved Chengdu places." },
    ],
  }),
  component: Collection,
});

function Collection() {
  const lang = useApp((s) => s.lang);
  const saves = useApp((s) => s.saves);
  const removeSave = useApp((s) => s.removeSave);
  const setRoute = useApp((s) => s.setRoute);
  const t = dict[lang];
  const nav = useNavigate();

  const saved = useMemo(
    () => saves.map((id) => findPlace(id)).filter(Boolean) as typeof places,
    [saves],
  );
  const totalDwell = saved.reduce((s, p) => s + p.duration, 0);
  const categories = Array.from(new Set(saved.map((p) => (lang === "en" ? p.category : p.categoryZh))));
  const canBuild = saved.length >= 3;

  if (saved.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t.collection.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.collection.empty}</p>
        <Link to="/discover">
          <Button className="mt-6 bg-coral text-coral-foreground hover:bg-coral/90">
            {t.collection.goDiscover}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{t.collection.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.collection.subtitle}</p>
        </div>
        <Button
          size="lg"
          disabled={!canBuild}
          className={cn(
            "rounded-full",
            canBuild ? "bg-coral text-coral-foreground hover:bg-coral/90" : "",
          )}
          onClick={() => {
            const ids = saved.slice(0, 4).map((p) => p.id);
            setRoute(ids);
            nav({ to: "/itinerary" });
          }}
        >
          {t.collection.buildRoute}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Stat icon={<LayoutGrid className="h-4 w-4" />} label={t.discover.filter === "Filter" ? "Saved" : "已收藏"} value={String(saved.length)} />
        <Stat icon={<Clock className="h-4 w-4" />} label={t.collection.total} value={`${totalDwell} ${t.collection.minutes}`} />
        <div className="rounded-2xl card-soft p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
            {t.collection.types}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!canBuild && (
        <p className="mb-6 text-sm text-muted-foreground">
          {t.collection.needMore.replace("{n}", String(3 - saved.length))}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-2xl card-soft p-3">
            <PlaceImage src={p.image.url} alt={p.image.alt} className="h-24 w-28 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {lang === "en" ? p.category : p.categoryZh}
              </p>
              <p className="font-display text-base font-semibold leading-tight">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.duration} {t.collection.minutes} · {p.area}
              </p>
              <button
                onClick={() => removeSave(p.id)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.collection.remove}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl card-soft p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

