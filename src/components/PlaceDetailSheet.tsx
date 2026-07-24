import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceImage } from "@/components/PlaceImage";
import { ExternalLink, MapPin, Bookmark, BookmarkCheck, AlertTriangle } from "lucide-react";
import type { Place } from "@/data/places";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";

type Props = { place: Place | null; onClose: () => void };

export function PlaceDetailSheet({ place, onClose }: Props) {
  const lang = useApp((s) => s.lang);
  const saves = useApp((s) => s.saves);
  const toggleSave = useApp((s) => s.toggleSave);
  const log = useApp((s) => s.log);
  const t = dict[lang];

  if (!place) return null;
  const saved = saves.includes(place.id);

  return (
    <Sheet
      open={!!place}
      onOpenChange={(o) => {
        if (!o) onClose();
        else log("evidence_detail_viewed", { id: place.id });
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-y-auto">
        <div className="relative">
          <PlaceImage
            src={place.image.url}
            alt={place.image.alt}
            sourceLabel={place.image.source}
            className="h-56 w-full"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
            <p className="text-xs text-white/80">{lang === "en" ? place.category : place.categoryZh}</p>
            <h2 className="font-display text-2xl font-semibold text-white">
              {place.name}
              <span className="ml-2 text-base font-normal text-white/70">{place.zhName}</span>
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Metric label={t.discover.personalFit} value={place.demoPersonalFit} tone="coral" />
            <Metric label={t.discover.evidence} value={place.demoEvidenceConfidence} tone="sky" />
          </div>

          <Section title={t.detail.why}>
            <p>{lang === "en" ? place.whyFits : place.whyFitsZh}</p>
          </Section>

          <Section title={t.detail.whatToKnow}>
            <p>{lang === "en" ? place.whatToKnow : place.whatToKnowZh}</p>
          </Section>

          <div className="rounded-2xl bg-sun/15 border border-sun/40 p-4">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-foreground/70" />
              <div>
                <p className="font-medium mb-0.5">{t.detail.risk}</p>
                <p className="text-foreground/80">{lang === "en" ? place.risk : place.riskZh}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SignalCard label={t.detail.international} value={place.internationalRelevance} />
            <SignalCard label={t.detail.local} value={place.localRelevance} />
            <SignalCard label={t.detail.operational} value={place.operationalAccessibility} highlight />
          </div>

          <Section title={t.detail.sources}>
            <div className="space-y-2">
              {place.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => log("source_opened", { id: place.id, url: s.url })}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm hover:border-foreground/30 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{s.type}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{place.sourceSummary}</p>
          </Section>

          <Section title={t.detail.map}>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-sky/10 via-leaf/10 to-sun/10">
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {place.area} · demo map
                </div>
              </div>
              <a
                href={`https://uri.amap.com/marker?name=${encodeURIComponent(place.name)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="absolute bottom-2 right-2 rounded-full bg-background/90 border border-border px-3 py-1 text-xs font-medium hover:bg-background"
              >
                {t.detail.openMap}
              </a>
            </div>
          </Section>

          <div className="flex items-center gap-3 pt-2">
            <Button
              className={cn(
                "flex-1",
                saved
                  ? "bg-leaf text-leaf-foreground hover:bg-leaf/90"
                  : "bg-coral text-coral-foreground hover:bg-coral/90",
              )}
              onClick={() => toggleSave(place.id)}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
              {saved ? t.detail.saved : t.detail.save}
            </Button>
            <Badge variant="outline" className="text-[10px] uppercase">
              {t.detail.grade} · {place.evidenceGrade}
            </Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="text-sm text-foreground/85 leading-relaxed">{children}</div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "coral" | "sky" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tone === "coral" ? "bg-coral" : "bg-sky")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SignalCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", highlight && "text-coral")}>{value}</p>
    </div>
  );
}
