import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const useDemoProfile = useApp((s) => s.useDemoProfile);

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background font-display font-bold text-sm">
            成
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Chengdu Lens</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang === "en" ? "AI Travel Companion" : "AI 旅行向导"}
            </p>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-semibold">{lang === "en" ? "中文" : "EN"}</span>
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-coral text-coral-foreground hover:bg-coral/90 rounded-full"
            onClick={() => {
              useDemoProfile();
              document
                .getElementById("discover")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {lang === "en" ? "Try Demo Profile" : "使用 Demo 场景"}
          </Button>
        </div>
      </div>
    </header>
  );
}
