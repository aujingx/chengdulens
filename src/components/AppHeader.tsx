import { Link } from "@tanstack/react-router";
import { Github, Languages, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { Button } from "@/components/ui/button";

const ANCHORS = [
  { id: "taste", en: "Taste", zh: "偏好" },
  { id: "discover", en: "Discover", zh: "发现" },
  { id: "trip", en: "Trip", zh: "行程" },
  { id: "ask-ai", en: "Ask AI", zh: "问 AI" },
  { id: "case-study", en: "Case Study", zh: "案例" },
];

export function AppHeader() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const t = dict[lang];

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-coral-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{t.brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {ANCHORS.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(a.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/65 hover:text-foreground hover:bg-muted transition-colors"
            >
              {lang === "en" ? a.en : a.zh}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-coral/40 bg-coral/10 text-coral hover:bg-coral hover:text-coral-foreground"
          >
            <a href="https://github.com/aujingx/chengdulens" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-foreground/70"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{lang === "en" ? "中" : "EN"}</span>
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex rounded-full bg-coral text-coral-foreground hover:bg-coral/90"
            onClick={() => useDemoProfile()}
          >
            {lang === "en" ? "Try demo" : "试用 Demo"}
          </Button>
        </div>
      </div>
    </header>
  );
}
