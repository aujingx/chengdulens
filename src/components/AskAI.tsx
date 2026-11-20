import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BookingPanel } from "@/components/BookingPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { bookingChoice, destinations, journey, type Destination } from "@/lib/journey";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string; demo?: boolean; booking?: Destination };
const message = (role: Msg["role"], content: string, extra?: Pick<Msg, "demo" | "booking">): Msg =>
  ({ id: crypto.randomUUID(), role, content, ...extra });

export function AskAI() {
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const saves = useApp((s) => s.saves);
  const routeIds = useApp((s) => s.routeIds);
  const rainActive = useApp((s) => s.rainActive);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [destination, setDestination] = useState<Destination>("chengdu");
  const [stage, setStage] = useState<"idle" | "today" | "tomorrow">("idle");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const zh = lang === "zh";
  const copy = journey[lang];

  useEffect(() => {
    const pane = scrollRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [messages, error]);
  useEffect(() => () => abortRef.current?.abort(), []);

  function addTurn(text: string, response: string, booking?: Destination) {
    setError(null);
    setMessages((prev) => [...prev, message("user", text), message("assistant", response, { demo: true, booking })]);
  }

  function start() {
    setStage("today");
    setDestination("chengdu");
    addTurn(copy.start, copy.today);
  }

  function selectTomorrow() {
    setStage("tomorrow");
    setDestination("jiuzhaigou");
    addTurn(copy.next, copy.tomorrow);
  }

  function openBooking(scope: Destination, text: string) {
    setDestination(scope);
    const name = destinations[scope][lang];
    addTurn(text, zh ? `只显示 **${name}** 的预订选项。` : `Here are the booking options for **${name}**.`, scope);
  }

  async function send() {
    const text = input.trim();
    if (!text || abortRef.current) return;
    setInput("");
    const scope = bookingChoice(text, destination);
    if (scope === "clarify") {
      addTurn(text, zh ? "你想查哪个目的地的预订？请只告诉我一个，例如「帮我预订成都」或「帮我预订九寨沟」。" : "Which destination would you like to book? Name one, for example ‘Help me book Chengdu’ or ‘Help me book Jiuzhaigou’.");
      return;
    }
    if (scope) {
      openBooking(scope, text);
      return;
    }

    const user = message("user", text);
    const assistant = message("assistant", "");
    setMessages((prev) => [...prev, user, assistant]);
    setError(null);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, user].filter((m) => m.content && !m.booking).slice(-20)
            .map(({ role, content }) => ({ role, content })),
          profileText: profile?.request,
          profile,
          savedIds: saves,
          routeIds,
          rainActive,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { value, done } = await reader.read();
        answer += decoder.decode(value, { stream: !done });
        if (answer) setMessages((prev) => prev.map((m) => m.id === assistant.id ? { ...m, content: answer } : m));
        if (done) break;
      }
      if (!answer.trim()) throw new Error(zh ? "没有收到回复。" : "No reply was received.");
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : (zh ? "暂时无法连接向导。" : "The concierge is unavailable."));
      setMessages((prev) => prev.filter((m) => m.id !== assistant.id || m.content.trim()));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex h-[min(720px,calc(100svh-90px))] min-h-96 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-cream px-4 py-3 sm:px-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-coral text-coral-foreground"><Sparkles className="size-4" /></span>
        <div className="min-w-0">
          <p className="font-display font-semibold">{zh ? "成都旅行向导" : "Chengdu concierge"}</p>
          <p className="text-xs text-muted-foreground">{zh ? "今天在市区，明天去周边" : "Chengdu today, somewhere nearby tomorrow"}</p>
        </div>
      </header>
      <div ref={scrollRef} role="log" aria-label={zh ? "行程对话" : "Trip conversation"} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        {!messages.length && (
          <div className="mx-auto max-w-sm py-6 text-center">
            <p className="font-display text-xl font-semibold">{zh ? "这个下午，想怎么逛成都？" : "What does your Chengdu afternoon look like?"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{zh ? "太古里出发 · 4 小时 · 轻松走走 · 不吃辣" : "Taikoo Li · Four hours · Easy walking · No spicy food"}</p>
            <Button onClick={start} className="mt-5 bg-coral text-coral-foreground hover:bg-coral/90">
              {zh ? "开始行程演示" : "Start the guided trip"} <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" && "justify-end")}>
            <div className={cn("min-w-0 text-sm leading-relaxed break-words", m.role === "user" ? "max-w-[88%] rounded-xl bg-foreground px-4 py-2.5 text-background" : "w-full")}>
              {m.role === "user" ? <p className="whitespace-pre-wrap">{m.content}</p> : (
                <>
                  {m.demo && <p className="mb-1 text-xs font-medium text-muted-foreground">{zh ? "预设演示" : "Guided demo"}</p>}
                  {m.content ? <div className="space-y-2 [&_a]:text-coral [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1"><ReactMarkdown>{m.content}</ReactMarkdown></div> : <span className="inline-flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" />{zh ? "正在思考…" : "Thinking…"}</span>}
                  {m.booking && <BookingPanel destination={m.booking} />}
                </>
              )}
            </div>
          </div>
        ))}
        {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      </div>
      {stage !== "idle" && (
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-border px-3 py-2">
          {!messages.some((m) => m.booking === "chengdu") && <Button size="sm" variant="outline" disabled={streaming} onClick={() => openBooking("chengdu", copy.bookCity)}>{copy.bookCity}</Button>}
          {stage === "today" && <Button size="sm" disabled={streaming} onClick={selectTomorrow}>{copy.chooseRegion} <ArrowRight className="size-4" /></Button>}
          {stage === "tomorrow" && !messages.some((m) => m.booking === "jiuzhaigou") && <Button size="sm" disabled={streaming} onClick={() => openBooking("jiuzhaigou", copy.bookRegion)}>{copy.bookRegion} <ArrowRight className="size-4" /></Button>}
        </div>
      )}
      {stage === "idle" && messages.length > 0 && (
        <div className="shrink-0 border-t border-border px-3 py-2"><Button variant="outline" size="sm" disabled={streaming} onClick={start}>{zh ? "开始行程演示" : "Start the guided trip"}</Button></div>
      )}
      <form className="flex shrink-0 items-end gap-2 border-t border-border bg-background p-3" onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <Textarea value={input} maxLength={2000} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); }
        }} aria-label={zh ? "给向导发消息" : "Message the concierge"} placeholder={zh ? "问问路线、门票或吃什么…" : "Ask about routes, tickets or food…"} rows={1} className="min-h-10 max-h-24 resize-none" disabled={streaming} />
        <Button type="submit" size="icon" aria-label={zh ? "发送" : "Send"} disabled={streaming || !input.trim()} className="size-10 shrink-0 bg-coral text-coral-foreground hover:bg-coral/90">{streaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}</Button>
      </form>
    </div>
  );
}
