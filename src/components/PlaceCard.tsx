import { useState } from "react";
import { Bookmark, BookmarkCheck, Ticket, Train } from "lucide-react";
import type { Place } from "@/data/places";
import { PlaceImage } from "@/components/PlaceImage";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  place: Place;
  onOpen: () => void;
};

export function PlaceCard({ place, onOpen }: Props) {
  const lang = useApp((s) => s.lang);
  const saves = useApp((s) => s.saves);
  const toggleSave = useApp((s) => s.toggleSave);
  const saved = saves.includes(place.id);
  const [pulse, setPulse] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(place.id);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  const price = lang === "en" ? place.ticket.price : place.ticket.priceZh;
  const metro = lang === "en" ? place.transit.metro : place.transit.metroZh;
  const metroShort = metro.split("·")[0].trim();

  return (
    <article className="group relative flex flex-col cursor-pointer" onClick={onOpen}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-4">
        <PlaceImage
          src={place.image.url}
          alt={place.image.alt}
          sourceLabel={place.image.source}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <button
          onClick={handleSave}
          className={cn(
            "absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur-md shadow-sm transition-all",
            saved ? "text-coral" : "text-foreground hover:text-coral",
            pulse && "scale-125",
          )}
          aria-label={saved ? "Remove from collection" : "Save to collection"}
        >
          {saved ? <BookmarkCheck className="h-5 w-5 fill-current" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="space-y-2 px-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{place.name}</h3>
          <span className="text-xs text-muted-foreground font-medium shrink-0">{place.zhName}</span>
        </div>

        <p className="text-sm text-coral font-medium leading-snug line-clamp-2">
          {lang === "en" ? place.whyFits : place.whyFitsZh}
        </p>

        <div className="flex items-center gap-4 pt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Ticket className="h-3 w-3" />
            {price}
          </span>
          <span className="inline-flex items-center gap-1">
            <Train className="h-3 w-3" />
            {metroShort}
          </span>
          <span className={cn("inline-flex items-center gap-1", place.indoor ? "text-sky" : "text-leaf")}>
            {place.indoor ? "Indoor" : "Outdoor"}
          </span>
        </div>
      </div>
    </article>
  );
}
