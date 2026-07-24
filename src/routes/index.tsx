import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, MapPin, ShieldCheck, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { TasteProfileDialog } from "@/components/TasteProfileDialog";
import { PlaceImage } from "@/components/PlaceImage";
import { places } from "@/data/places";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chengdu Lens — See Chengdu the way you'd actually live it" },
      {
        name: "description",
        content:
          "An AI city guide that turns your taste into a walkable, source-checked half-day in Chengdu — with a plan B for the rain.",
      },
      { property: "og:title", content: "Chengdu Lens" },
      { property: "og:description", content: "AI city guide for first-time international travelers in Chengdu." },
    ],
  }),
  component: Home,
});

function Home() {
  const lang = useApp((s) => s.lang);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const t = dict[lang];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const heroPlaces = [places[0], places[3], places[2]];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-xs font-medium text-foreground/70 border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            {t.home.demoLabel}
          </span>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
            {t.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/70 leading-relaxed">{t.subtag}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full bg-coral text-coral-foreground hover:bg-coral/90 shadow-lg shadow-coral/20"
              onClick={() => {
                useDemoProfile();
                navigate({ to: "/discover" });
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t.home.ctaPrimary}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
              {t.home.ctaSecondary}
            </Button>
          </div>

          {/* Peek cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {heroPlaces.map((p, i) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl card-soft"
                style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -1.5 : 1.5}deg)` }}
              >
                <PlaceImage src={p.image.url} alt={p.image.alt} className="aspect-[4/3]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-[10px] uppercase tracking-wide text-white/70">{p.area}</p>
                  <p className="font-display text-sm font-semibold text-white">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE BOUNDARIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <BoundaryCard tone="leaf" icon={<Sparkles className="h-4 w-4" />} title={t.home.does} body={t.home.doesBody} />
          <BoundaryCard tone="coral" icon={<ShieldCheck className="h-4 w-4" />} title={t.home.doesnt} body={t.home.doesntBody} />
          <BoundaryCard tone="sky" icon={<MapPin className="h-4 w-4" />} title={t.home.data} body={t.home.dataBody} />
        </div>
      </section>

      {/* LOOP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{t.home.howItWorks}</h2>
          <CloudRain className="h-6 w-6 text-sky hidden sm:block" />
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl card-soft p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background font-display text-sm font-semibold">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
              </div>
              <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            className="rounded-full bg-foreground text-background hover:opacity-90"
            onClick={() => {
              useDemoProfile();
              navigate({ to: "/discover" });
            }}
          >
            {t.home.ctaPrimary}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      <TasteProfileDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v && useApp.getState().profile) navigate({ to: "/discover" });
        }}
      />
    </div>
  );
}

function BoundaryCard({
  tone,
  icon,
  title,
  body,
}: {
  tone: "leaf" | "coral" | "sky";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const toneMap = {
    leaf: "bg-leaf/10 text-leaf",
    coral: "bg-coral/10 text-coral",
    sky: "bg-sky/10 text-sky",
  } as const;
  return (
    <div className="rounded-3xl card-soft p-6">
      <span className={`inline-grid h-9 w-9 place-items-center rounded-full ${toneMap[tone]}`}>{icon}</span>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{body}</p>
    </div>
  );
}
