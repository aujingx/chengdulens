import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { places } from "@/data/places";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailSheet } from "@/components/PlaceDetailSheet";
import { TasteProfileDialog } from "@/components/TasteProfileDialog";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";
import { Sparkles, SlidersHorizontal, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Chengdu Lens" },
      { name: "description", content: "Eight Chengdu places matched to your taste, with evidence and risk shown separately." },
      { property: "og:title", content: "Discover · Chengdu Lens" },
      { property: "og:description", content: "Trusted, source-checked place recommendations for a Chengdu afternoon." },
    ],
  }),
  component: Discover,
});

type Filter = "all" | "indoor" | "photogenic" | "lowSpice";

function Discover() {
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const saves = useApp((s) => s.saves);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const t = dict[lang];
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const sorted = [...places].sort((a, b) => b.demoPersonalFit - a.demoPersonalFit);
    return sorted.filter((p) => {
      if (filter === "indoor") return p.indoor;
      if (filter === "photogenic") return p.photogenic;
      if (filter === "lowSpice") return p.spiceRisk === "none" || p.spiceRisk === "low";
      return true;
    });
  }, [filter]);

  const openPlace = filtered.find((p) => p.id === openId) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{t.discover.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">{t.discover.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {saves.length >= 3 && (
            <Button
              size="sm"
              className="bg-leaf text-leaf-foreground hover:bg-leaf/90"
              onClick={() => navigate({ to: "/itinerary" })}
            >
              Build route
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Edit profile
          </Button>
        </div>
      </div>

      {/* Profile chip strip */}
      {profile ? (
        <div className="flex flex-wrap gap-2 mb-8">
          <Chip>⏱ {profile.hours}h</Chip>
          <Chip>📍 {profile.start}</Chip>
          <Chip>🍜 {profile.diet}</Chip>
          <Chip>🚶 {profile.walking}</Chip>
          {profile.taste.map((x) => (
            <Chip key={x}>{x}</Chip>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Sparkles className="h-5 w-5 text-coral" />
          <p className="text-sm flex-1">
            No profile yet. Load the demo to see how Personal Fit changes.
          </p>
          <Button size="sm" onClick={useDemoProfile}>
            {t.profile.useDemo}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">
          {t.discover.filter}
        </span>
        {(["all", "indoor", "photogenic", "lowSpice"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              filter === f
                ? "bg-foreground text-background"
                : "bg-muted text-foreground/70 hover:bg-muted/70",
            )}
          >
            {t.discover[f as keyof typeof t.discover] as string}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-16 text-center">{t.discover.empty}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PlaceCard key={p.id} place={p} onOpen={() => setOpenId(p.id)} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl bg-sun/15 border border-sun/40 p-4 text-sm">
        <p>
          <span className="font-semibold">{saves.length}</span> saved. Save at least{" "}
          <span className="font-semibold">3</span> to unlock route building.{" "}
          <Link to="/collection" className="underline underline-offset-4">
            View collection →
          </Link>
        </p>
      </div>

      <PlaceDetailSheet place={openPlace} onClose={() => setOpenId(null)} />
      <TasteProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 capitalize">
      {children}
    </span>
  );
}

