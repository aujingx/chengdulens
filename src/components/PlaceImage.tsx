import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sourceLabel?: string;
};

export function PlaceImage({ src, alt, className, sourceLabel }: Props) {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!err ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErr(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sun/40 via-coral/30 to-leaf/40 text-xs text-foreground/70">
          <span>Image unavailable</span>
        </div>
      )}
      {sourceLabel && !err && (
        <span className="absolute bottom-1 right-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {sourceLabel}
        </span>
      )}
    </div>
  );
}
