import { useState } from "react";
import { Sparkles, X, CheckCircle2, Search, ShieldCheck, XCircle, Star, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { baseAgentLog, rainReplanEntry, type AgentEntry } from "@/data/agent-script";
import { cn } from "@/lib/utils";

const ICONS = {
  understood: Sparkles,
  retrieved: Search,
  checked: ShieldCheck,
  excluded: XCircle,
  recommended: CheckCircle2,
  next: ArrowRight,
};
const COLORS: Record<AgentEntry["stage"], string> = {
  understood: "text-sky bg-sky/10",
  retrieved: "text-sky bg-sky/10",
  checked: "text-leaf bg-leaf/10",
  excluded: "text-destructive bg-destructive/10",
  recommended: "text-coral bg-coral/10",
  next: "text-foreground bg-muted",
};

export function AgentDock() {
  const lang = useApp((s) => s.lang);
  const open = useApp((s) => s.agentOpen);
  const setOpen = useApp((s) => s.setAgentOpen);
  const rainActive = useApp((s) => s.rainActive);
  const t = dict[lang];

  const entries: AgentEntry[] = rainActive ? [...baseAgentLog, rainReplanEntry] : baseAgentLog;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-foreground pl-2 pr-4 py-2 text-background shadow-lg shadow-foreground/10 hover:opacity-90 transition"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral">
            <Sparkles className="h-4 w-4 text-coral-foreground" />
          </span>
          <span className="text-sm font-medium">{t.agent.open}</span>
        </button>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-coral-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <SheetTitle className="font-display">{t.agent.title}</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{t.agent.subtitle}</p>
              </div>
            </div>
          </SheetHeader>
          <div className="px-5 py-4 space-y-3 overflow-y-auto">
            {entries.map((e, i) => {
              const Icon = ICONS[e.stage];
              return (
                <div key={i} className="flex gap-3">
                  <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", COLORS[e.stage])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                      <span className="font-semibold">{t.agent.stages[e.stage]}</span>
                      <span>·</span>
                      <span>{e.time}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug mt-0.5">
                      {lang === "en" ? e.en : e.zh}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AgentToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs text-background shadow-lg animate-in fade-in slide-in-from-bottom-2">
      <Star className="h-3.5 w-3.5 text-sun" />
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="ml-1 opacity-70 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
