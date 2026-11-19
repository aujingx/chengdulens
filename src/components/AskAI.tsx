import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { BookingPanel } from "@/components/BookingPanel";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS_EN = [
  "First visit, four hours, rain, local culture, and no spicy food — what fits best?",
  "Order my saved places into a walkable afternoon.",
  "What's the most photogenic spot at sunset?",
];
const SCRIPTS = {
  en: [
    { label: "Demo A · 4h near Taikoo Li", text: "I have four hours this afternoon near Taikoo Li. I like quiet local streets, no spicy food, and I'd rather walk. Plan it for me." },
    { label: "Demo B · Chengdu → Jiuzhaigou", text: "I land in Chengdu at 10am. Today I want culture and mild food; tomorrow I want Jiuzhaigou, Huanglong or Songpan. Compare two options and explain the station-to-hotel transfer choices." },
  ],
  zh: [
    { label: "演示 A · 太古里 4 小时", text: "我今天下午在太古里附近有四个小时，喜欢安静的本地街区，不吃辣，想步行。帮我安排。" },
    { label: "演示 B · 成都 → 九寨沟", text: "我上午 10 点到成都，今天想看文化、吃不辣的美食；明天想去九寨沟、黄龙或松潘。比较两个方案，并说明高铁站到酒店的接驳选择。" },
  ],
};
const SUGGESTIONS_ZH = [
  "第一次来，只有四小时，下雨，想看本地文化且不吃辣，怎么安排？",
  "把我收藏的地点排成一个可走通的下午。",
  "傍晚哪里最适合拍照？",
];

export function AskAI() {
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const saves = useApp((s) => s.saves);
  const routeIds = useApp((s) => s.routeIds);
  const rainActive = useApp((s) => s.rainActive);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const suggestions = lang === "en" ? SUGGESTIONS_EN : SUGGESTIONS_ZH;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          profileText: profile?.request,
          profile,
          savedIds: saves,
          routeIds,
          rainActive,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "");
        throw new Error(err || `Error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg)),
        );
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message || "Something went wrong.");
      setMessages((m) => m.filter((msg) => msg.id !== assistantId));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="rounded-3xl bg-background border border-border/60 shadow-sm overflow-hidden flex flex-col h-[680px]">
      <div className="border-b border-border/60 bg-cream px-6 py-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-coral-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display font-semibold">
            {lang === "en" ? "Ask your Chengdu concierge" : "问一下成都向导"}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === "en"
              ? "AI concierge demo · scoped to your taste, saves, and these 8 places"
              : "AI 向导 Demo · 聚焦你的偏好、收藏和这 8 个地点"}
          </p>
        </div>
        <span className="ml-auto rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-leaf">
          {lang === "en" ? "Live Lovable AI" : "Lovable AI 实时响应"}
        </span>
      </div>

      <div className="border-b border-border/60 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">
            {lang === "en" ? "Current context" : "当前上下文"}
          </span>
          <ContextChip
            label={
              profile
                ? `${profile.hours}h · ${profile.start}`
                : lang === "en"
                  ? "No taste profile"
                  : "尚未设置偏好"
            }
          />
          {profile && (
            <ContextChip
              label={
                profile.diet === "no-spicy"
                  ? lang === "en"
                    ? "No spicy food"
                    : "不吃辣"
                  : profile.diet
              }
            />
          )}
          <ContextChip
            label={lang === "en" ? `${saves.length} saved` : `已收藏 ${saves.length} 个`}
          />
          {rainActive && (
            <ContextChip label={lang === "en" ? "Rain plan active" : "雨天方案已开启"} />
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {lang === "en"
                ? "Ask about these 8 places, routes, food, tickets, or rain backups:"
                : "可以询问这 8 个地点、路线、饮食、票务或雨天备份："}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {SCRIPTS[lang === "en" ? "en" : "zh"].map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.text)}
                  className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground hover:bg-coral/90"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="grid gap-2 max-w-md mx-auto">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left rounded-xl border border-border/60 bg-cream/50 px-4 py-2.5 text-sm hover:border-coral hover:bg-cream transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5",
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-foreground",
              )}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-strong:text-foreground prose-a:text-coral">
                  {m.content ? (
                    <>
                      <ReactMarkdown>{m.content.replace("[[BOOKING]]", "").trim()}</ReactMarkdown>
                      {m.content.includes("[[BOOKING]]") && !streaming && <BookingPanel />}
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {lang === "en" ? "Thinking…" : "思考中……"}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {messages.length > 0 && !streaming && !messages.some((m) => m.content.includes("[[BOOKING]]")) && (
          <div className="flex justify-center">
            <button
              onClick={() => send(lang === "en" ? "Help me book" : "帮我预订")}
              className="rounded-full border border-border/60 px-4 py-1.5 text-xs font-medium hover:border-coral"
            >
              {lang === "en" ? "Help me book" : "帮我预订"}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-border/60 bg-cream/40 px-6 py-2.5 text-[11px] leading-relaxed text-muted-foreground flex gap-2">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />
        <span>
          {lang === "en"
            ? "Bounded to 8 curated place records. Hours, booking, and on-site details must be confirmed with the linked source."
            : "回答范围限定为 8 条精选地点记录；开放时间、预约及现场信息仍需通过来源链接确认。"}
        </span>
      </div>

      <form
        className="border-t border-border/60 p-3 flex items-end gap-2 bg-background"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={
            lang === "en" ? "Ask about a place, a route, food…" : "问问某个地点、路线、吃的……"
          }
          rows={1}
          className="min-h-[44px] max-h-32 resize-none border-border/60"
          disabled={streaming}
        />
        <Button
          type="submit"
          size="icon"
          disabled={streaming || !input.trim()}
          className="bg-coral text-coral-foreground hover:bg-coral/90 shrink-0"
        >
          {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}

function ContextChip({ label }: { label: string }) {
  return <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{label}</span>;
}
