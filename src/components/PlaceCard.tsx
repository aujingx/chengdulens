import { Bookmark, BookmarkCheck, X, ArrowUpRight, AlertTriangle } from "lucide-react";
import type { Place } from "@/data/places";
import { PlaceImage } from "@/components/PlaceImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";

type Props = {
  place: Place;
  onOpen: () => void;
};

export function PlaceCard({ place, onOpen }: Props) {
  const lang = useApp((s) => s.lang);
  const saves = useApp((s) => s.saves);
  const rejects = useApp((s) => s.rejects);
  const toggleSave = useApp((s) => s.toggleSave);
  const reject = useApp((s) => s.reject);
  const t = dict[lang];
  const saved = saves.includes(place.id);
  const rejected = rejects.includes(place.id);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl card-soft transition-all",
        rejected && "opacity-40",
      )}
    >
      <button onClick={onOpen} className="text-left">
        <PlaceImage
          src={place.image.url}
          alt={place.image.alt}
          sourceLabel={place.image.source}
          className="aspect-[4/3] w-full"
        />
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-tight">
              {place.name}
              {lang === "en" && (
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">{place.zhName}</span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "en" ? place.category : place.categoryZh} · {place.area}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px] font-semibold uppercase">
            {place.evidenceGrade}
          </Badge>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
          {lang === "en" ? place.whyFits : place.whyFitsZh}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <ScoreBar label={t.discover.personalFit} value={place.demoPersonalFit} tone="coral" />
          <ScoreBar label={t.discover.evidence} value={place.demoEvidenceConfidence} tone="sky" />
        </div>

        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sun" />
          <span className="leading-snug">{lang === "en" ? place.risk : place.riskZh}</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant={saved ? "default" : "outline"}
            className={cn(saved && "bg-leaf text-leaf-foreground hover:bg-leaf/90 border-transparent")}
            onClick={() => toggleSave(place.id)}
          >
            {saved ? <BookmarkCheck className="h-4 w-4 mr-1" /> : <Bookmark className="h-4 w-4 mr-1" />}
            {saved ? t.discover.saved : t.discover.save}
          </Button>
          {!saved && !rejected && (
            <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => reject(place.id)}>
              <X className="h-4 w-4 mr-1" />
              {t.discover.notForMe}
            </Button>
          )}
          <button
            onClick={onOpen}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground"
          >
            {t.discover.viewDetail}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ScoreBar({ label, value, tone }: { label: string; value: number; tone: "coral" | "sky" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold text-foreground tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tone === "coral" ? "bg-coral" : "bg-sky")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
