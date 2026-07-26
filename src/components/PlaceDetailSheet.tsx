import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, Ticket, Train, Clock, MapPin, ExternalLink, UtensilsCrossed, Coffee, ShoppingBag, Mountain, Wine, AlertTriangle } from "lucide-react";
import type { Place, NearbyItem } from "@/data/places";
import { PlaceImage } from "@/components/PlaceImage";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";

type Props = { place: Place | null; onClose: () => void };

const NEARBY_ICON: Record<NearbyItem["kind"], typeof UtensilsCrossed> = {
  food: UtensilsCrossed,
  cafe: Coffee,
  shop: ShoppingBag,
  view: Mountain,
  bar: Wine,
};

export function PlaceDetailSheet({ place, onClose }: Props) {
  const lang = useApp((s) => s.lang);
  const saves = useApp((s) => s.saves);
  const toggleSave = useApp((s) => s.toggleSave);
  const t = dict[lang];

  if (!place) return null;
  const saved = saves.includes(place.id);

  return (
    <Sheet open={!!place} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <PlaceImage
            src={place.image.url}
            alt={place.image.alt}
            sourceLabel={place.image.source}
            className="h-full w-full"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6 pt-16">
            <p className="text-xs uppercase tracking-widest text-coral font-semibold mb-1">
              {lang === "en" ? place.category : place.categoryZh}
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight">
              {place.name}
              <span className="ml-2 text-lg font-normal text-muted-foreground">{place.zhName}</span>
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick facts strip */}
          <div className="grid grid-cols-3 gap-3">
            <QuickFact icon={Ticket} label="Ticket" value={lang === "en" ? place.ticket.price : place.ticket.priceZh} />
            <QuickFact icon={Clock} label="Best" value={`${place.duration} min`} />
            <QuickFact icon={Train} label="Metro" value={(lang === "en" ? place.transit.metro : place.transit.metroZh).split("·")[0].trim()} />
          </div>

          {/* Why it fits */}
          <section>
            <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              {t.detail.why}
            </p>
            <p className="text-base text-coral font-medium leading-relaxed">
              {lang === "en" ? place.whyFits : place.whyFitsZh}
            </p>
          </section>

          {/* Deep intro */}
          <section>
            <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              {lang === "en" ? "About this place" : "关于这里"}
            </p>
            <p className="text-[15px] leading-relaxed text-foreground/85">
              {lang === "en" ? place.intro : place.introZh}
            </p>
          </section>

          {/* Practical info block */}
          <section className="rounded-2xl bg-cream border border-border/60 p-5 space-y-3 text-sm">
            <InfoRow icon={Ticket} label={lang === "en" ? "Ticket" : "门票"}>
              <span className="font-semibold">{lang === "en" ? place.ticket.price : place.ticket.priceZh}</span>
              <span className="text-muted-foreground"> · {place.ticket.hours}</span>
              {place.ticket.bookingUrl && (
                <a
                  href={place.ticket.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-0.5 text-coral hover:underline"
                >
                  {lang === "en" ? "Book" : "预约"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {place.ticket.note && (
                <p className="mt-1 text-xs text-muted-foreground">{place.ticket.note}</p>
              )}
            </InfoRow>
            <InfoRow icon={Train} label={lang === "en" ? "How to arrive" : "怎么到"}>
              <span>{lang === "en" ? place.transit.metro : place.transit.metroZh}</span>
              <span className="text-muted-foreground"> · {place.transit.walkMin} min walk</span>
              <p className="mt-1 text-xs text-muted-foreground">
                {lang === "en" ? place.transit.tips : place.transit.tipsZh}
              </p>
            </InfoRow>
            <InfoRow icon={Clock} label={lang === "en" ? "Best time" : "最佳时段"}>
              <span>{lang === "en" ? place.bestTime : place.bestTimeZh}</span>
            </InfoRow>
          </section>

          {/* Nearby */}
          <section>
            <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              {lang === "en" ? "Nearby worth pairing" : "顺路推荐"}
            </p>
            <div className="grid gap-2">
              {place.nearby.map((n) => {
                const Icon = NEARBY_ICON[n.kind];
                return (
                  <div
                    key={n.name}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 hover:border-coral/40 transition-colors"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-coral">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-sm truncate">
                          {lang === "en" ? n.name : n.nameZh}
                        </p>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {n.walkMin === 0 ? (lang === "en" ? "on-site" : "现场") : `${n.walkMin} min`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {lang === "en" ? n.note : n.noteZh}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Watch out */}
          <section className="rounded-2xl bg-sun/15 border border-sun/40 p-4">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-sun-foreground" />
              <div>
                <p className="font-semibold mb-0.5">{t.detail.risk}</p>
                <p className="text-foreground/80 leading-relaxed">
                  {lang === "en" ? place.risk : place.riskZh}
                </p>
              </div>
            </div>
          </section>

          {/* Evidence collapsed */}
          <details className="rounded-2xl border border-border/60 bg-background/50 p-4 group">
            <summary className="cursor-pointer text-sm font-semibold text-muted-foreground list-none flex items-center justify-between">
              <span>{t.detail.sources}</span>
              <span className="text-xs group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <MetricPill label={t.discover.personalFit} value={place.demoPersonalFit} tone="coral" />
                <MetricPill label={t.discover.evidence} value={place.demoEvidenceConfidence} tone="sky" />
              </div>
              <p className="text-xs text-muted-foreground">{place.sourceSummary}</p>
              <ul className="space-y-1">
                {place.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky hover:underline"
                    >
                      {s.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.type}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge variant="outline" className="text-[10px]">
                  {t.detail.grade}: {place.evidenceGrade}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {t.detail.international}: {place.internationalRelevance}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {t.detail.local}: {place.localRelevance}
                </Badge>
              </div>
            </div>
          </details>

          <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-border bg-background/95 backdrop-blur p-4 flex items-center gap-3">
            <Button
              size="lg"
              className={cn(
                "flex-1",
                saved
                  ? "bg-leaf text-leaf-foreground hover:bg-leaf/90"
                  : "bg-coral text-coral-foreground hover:bg-coral/90",
              )}
              onClick={() => toggleSave(place.id)}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  {t.detail.saved}
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  {t.detail.save}
                </>
              )}
            </Button>
            <a
              href={`https://uri.amap.com/marker?position=${place.x / 10 + 104},${place.y / 10 + 30}&name=${encodeURIComponent(place.name)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-4 w-4" />
              {t.detail.openMap}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function QuickFact({ icon: Icon, label, value }: { icon: typeof Ticket; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold leading-tight">{value}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Ticket;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-background text-coral">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">
          {label}
        </p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: number; tone: "coral" | "sky" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tone === "coral" ? "bg-coral" : "bg-sky")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
