import { Link, useRouterState } from "@tanstack/react-router";
import { Languages, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV: Array<{ to: "/" | "/discover" | "/collection" | "/route" | "/case-study"; key: keyof typeof dict.en.nav }> = [
  { to: "/", key: "home" },
  { to: "/discover", key: "discover" },
  { to: "/collection", key: "collection" },
  { to: "/route", key: "route" },
  { to: "/case-study", key: "caseStudy" },
];

export function AppHeader() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const t = dict[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-coral-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{t.brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {t.nav[n.key]}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-foreground/70"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{t.common.langLabel}</span>
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-coral text-coral-foreground hover:bg-coral/90"
            onClick={() => useDemoProfile()}
          >
            {t.profile.useDemo}
          </Button>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}

function MobileNav() {
  const lang = useApp((s) => s.lang);
  const t = dict[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2">
      {NAV.map((n) => {
        const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
        return (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
              active ? "bg-foreground text-background" : "bg-muted text-foreground/70",
            )}
          >
            {t.nav[n.key]}
          </Link>
        );
      })}
    </nav>
  );
}
