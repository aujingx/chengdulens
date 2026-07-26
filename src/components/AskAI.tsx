import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS_EN = [
  "Which place fits best if it rains?",
  "Order my saved places into a walkable afternoon.",
  "What's the most photogenic spot at sunset?",
];
const SUGGESTIONS_ZH = [
  "下雨的话哪一个最合适？",
  "把我收藏的地点排成一个可走通的下午。",
  "傍晚哪里最适合拍照？",
];

export function AskAI() {
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const saves = useApp((s) => s.saves);
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
          savedIds: saves,
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
    <div className="rounded-3xl bg-background border border-border/60 shadow-sm overflow-hidden flex flex-col h-[600px]">
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
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {lang === "en"
                ? "Ask about these 8 places, routes, food, tickets, or rain backups:"
                : "可以询问这 8 个地点、路线、饮食、票务或雨天备份："}
            </p>
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
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
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
                    <ReactMarkdown>{m.content}</ReactMarkdown>
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

        {error && (
          <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>
        )}
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
          placeholder={lang === "en" ? "Ask about a place, a route, food…" : "问问某个地点、路线、吃的……"}
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
