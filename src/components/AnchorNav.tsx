import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export type Section = { id: string; en: string; zh: string };

export function AnchorNav({ sections }: { sections: Section[] }) {
  const lang = useApp((s) => s.lang);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(s.id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-1"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={cn(
              "group flex items-center gap-3 py-1.5 pl-1 pr-3 rounded-full transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-all",
                isActive ? "w-8 bg-coral" : "w-4 bg-muted-foreground/40 group-hover:bg-foreground",
              )}
            />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {lang === "en" ? s.en : s.zh}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
