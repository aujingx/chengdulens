import { Compass, Languages } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const zh = lang === "zh";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <a href="#top" className="inline-flex items-center gap-2.5 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-planner-green text-planner-on-green"><Compass className="size-[18px]" /></span>
          {zh ? "成都漫游" : "Chengdu Lens"}
        </a>
        <nav className="flex items-center gap-1 sm:gap-3" aria-label={zh ? "导航" : "Navigation"}>
          <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex"><a href="#trip">{zh ? "我的行程" : "My trip"}</a></Button>
          <Button asChild size="sm" variant="ghost"><a href="#case-study">{zh ? "关于" : "About"}</a></Button>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <Button size="sm" variant="ghost" aria-label={zh ? "Switch to English" : "切换为中文"} onClick={() => setLang(zh ? "en" : "zh")}><Languages className="size-4" /> {zh ? "EN" : "中文"}</Button>
        </nav>
      </div>
    </header>
  );
}
