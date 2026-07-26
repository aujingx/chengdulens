import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Footprints,
  CloudRain,
  RotateCcw,
  Bookmark,
  Trash2,
  Compass,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { dict } from "@/data/i18n";
import { TasteProfileDialog } from "@/components/TasteProfileDialog";
import { PlaceImage } from "@/components/PlaceImage";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailSheet } from "@/components/PlaceDetailSheet";
import { AskAI } from "@/components/AskAI";
import { AnchorNav, type Section } from "@/components/AnchorNav";
import { caseStudyDocs } from "@/data/caseStudy";
import { places, findPlace, type Place } from "@/data/places";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chengdu Lens — Your AI travel companion for Chengdu" },
      {
        name: "description",
        content:
          "Turn your taste into a walkable Chengdu afternoon: 8 curated places with source-linked ticket info, transit notes, nearby food, and an AI concierge demo.",
      },
      { property: "og:title", content: "Chengdu Lens" },
      { property: "og:description", content: "AI travel companion for first-time visitors to Chengdu." },
    ],
  }),
  component: Home,
});

const SECTIONS: Section[] = [
  { id: "top", en: "Story", zh: "故事" },
  { id: "taste", en: "Your Taste", zh: "你的偏好" },
  { id: "discover", en: "Discover", zh: "发现" },
  { id: "trip", en: "Your Trip", zh: "行程" },
  { id: "ask-ai", en: "Ask AI", zh: "问 AI" },
  { id: "case-study", en: "Case Study", zh: "案例" },
];

const RAIN_SWAP: Record<string, string> = {
  "peoples-park": "chengdu-museum",
  "wenshu-monastery": "chengdu-museum",
  "du-fu-thatched-cottage": "chengdu-museum",
  "jinli-alley": "chengdu-museum",
};

function Home() {
  const lang = useApp((s) => s.lang);
  const profile = useApp((s) => s.profile);
  const useDemoProfile = useApp((s) => s.useDemoProfile);
  const saves = useApp((s) => s.saves);
  const rainActive = useApp((s) => s.rainActive);
  const setRain = useApp((s) => s.setRain);
  const t = dict[lang];
  const [profileOpen, setProfileOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const openPlace = openId ? findPlace(openId) ?? null : null;
  const savedPlaces = saves.map(findPlace).filter(Boolean) as Place[];
  const featured = places[0];
  const rest = places.slice(1);

  return (
    <div>
      <AnchorNav sections={SECTIONS} />

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-20 lg:pl-32">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-coral" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coral">
              {lang === "en" ? "01 · A city guide, remixed" : "01 · 重新设计的城市指南"}
            </span>
          </div>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.98] tracking-tight">
              {lang === "en" ? (
                <>
                  See Chengdu the way you'd <span className="italic font-light text-coral">actually</span> live it.
                </>
              ) : (
                <>
                  以你真实的生活方式，<span className="italic font-light text-coral">看见</span>成都。
                </>
              )}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed lg:pl-8 lg:border-l lg:border-border pb-3">
              {lang === "en"
                ? "An AI concierge demo that turns your taste into a walkable afternoon — 8 curated places with source-linked ticket info, metro notes, nearby recommendations, and an assistant focused on these places."
                : "一个城市 AI 向导 Demo，把你的偏好翻译成一段可以走完的下午 —— 8 个精选地点，含来源链接的票务信息、地铁提示、周边推荐，以及聚焦这些地点的 AI 助手。"}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full bg-coral text-coral-foreground hover:bg-coral/90 shadow-lg shadow-coral/20"
              onClick={() => {
                useDemoProfile();
                document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {lang === "en" ? "Start with a demo taste" : "使用 Demo 偏好开始"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => setProfileOpen(true)}
            >
              {lang === "en" ? "Build your own" : "自己填偏好"}
            </Button>
          </div>

          {/* Featured hero card */}
          <div className="mt-16 grid md:grid-cols-[2fr_1fr] gap-6">
            <button
              onClick={() => setOpenId(featured.id)}
              className="group relative overflow-hidden rounded-3xl aspect-[16/10] text-left"
            >
              <PlaceImage src={featured.image.url} alt={featured.image.alt} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-80 mb-1">
                  {lang === "en" ? "Featured" : "本期推荐"}
                </p>
                <h3 className="font-display text-3xl font-semibold">{featured.name}</h3>
                <p className="mt-1 text-sm opacity-90 max-w-md">
                  {lang === "en" ? featured.whyFits : featured.whyFitsZh}
                </p>
              </div>
            </button>
            <div className="rounded-3xl bg-cream border border-border/60 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted-foreground mb-3">
                  {lang === "en" ? "In this issue" : "本期内容"}
                </p>
                <ul className="space-y-2.5 text-sm">
                  <IssueRow n="01" label={lang === "en" ? "Your taste" : "你的偏好"} note={lang === "en" ? "One-tap demo profile" : "一键 Demo 偏好"} />
                  <IssueRow n="02" label={lang === "en" ? "8 curated places" : "8 个精选地点"} note={lang === "en" ? "Tickets, metro, nearby" : "门票、地铁、周边"} />
                  <IssueRow n="03" label={lang === "en" ? "A walkable trip" : "可走通的行程"} note={lang === "en" ? "With rain plan B" : "含雨天备份"} />
                  <IssueRow n="04" label={lang === "en" ? "AI concierge demo" : "AI 向导 Demo"} note={lang === "en" ? "Ask about these places" : "围绕这 8 个地点提问"} />
                </ul>
              </div>
              <p className="mt-6 text-[11px] text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "Demo scenario. Not based on completed user interviews."
                  : "Demo 场景。未基于完整用户访谈。"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TASTE */}
      <section id="taste" className="border-t border-border/40 bg-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:pl-32">
          <SectionHeader
            no="02"
            title={lang === "en" ? "Your Taste" : "你的偏好"}
            subtitle={
              lang === "en"
                ? "One demo persona: quiet neighborhoods, no spicy food, four hours from Taikoo Li. Edit anytime."
                : "一个 Demo 画像：安静街区、不吃辣、太古里出发 4 小时。随时可改。"
            }
          />
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 mt-10">
            <div className="rounded-3xl bg-background border border-border/60 p-6">
              {profile ? (
                <div className="space-y-4">
                  <TasteRow icon="⏱" label={lang === "en" ? "Time" : "时间"} value={`${profile.hours}h`} />
                  <TasteRow icon="📍" label={lang === "en" ? "Starting" : "出发点"} value={profile.start} />
                  <TasteRow icon="🍜" label={lang === "en" ? "Diet" : "饮食"} value={profile.diet} />
                  <TasteRow icon="🚶" label={lang === "en" ? "Walking" : "步行"} value={profile.walking} />
                  <TasteRow icon="🌦" label={lang === "en" ? "Weather" : "天气"} value={profile.weather} />
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {profile.taste.map((x) => (
                      <span key={x} className="rounded-full bg-cream px-3 py-1 text-xs font-medium capitalize">
                        {x}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setProfileOpen(true)}>
                    {lang === "en" ? "Edit profile" : "修改偏好"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-coral/10 text-coral mb-4">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {lang === "en"
                      ? "Load the demo taste to see everything come alive."
                      : "载入 Demo 偏好，下面的内容会立即适配。"}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className="bg-coral text-coral-foreground hover:bg-coral/90" onClick={useDemoProfile}>
                      {lang === "en" ? "Use demo taste" : "使用 Demo 偏好"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setProfileOpen(true)}>
                      {lang === "en" ? "Or build your own" : "或自己填"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <PrincipleCard
                icon="✍️"
                title={lang === "en" ? "Taste, not vibes" : "偏好，不是氛围"}
                body={
                  lang === "en"
                    ? "Time, diet, walking, weather work as hard gates — not decoration."
                    : "时间、饮食、步行、天气是硬约束，不是装饰。"
                }
              />
              <PrincipleCard
                icon="🔍"
                title={lang === "en" ? "Fit and evidence, separated" : "匹配度与证据分开"}
                body={
                  lang === "en"
                    ? "How well a place suits you, and how solid the source is — never merged."
                    : "一个地点适合你的程度，与来源可信度，永远分开呈现。"
                }
              />
              <PrincipleCard
                icon="🌂"
                title={lang === "en" ? "Rain-ready" : "雨天备份"}
                body={
                  lang === "en"
                    ? "Every outdoor stop has an indoor swap ready in one click."
                    : "每个户外站点都准备好了一键切换的室内备份。"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVER */}
      <section id="discover" className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:pl-32">
          <SectionHeader
            no="03"
            title={lang === "en" ? "8 places worth your afternoon" : "值得留在下午的 8 个地点"}
            subtitle={
              lang === "en"
                ? "Tap any card for tickets, metro directions, nearby food, and the AI's honest take."
                : "点击卡片查看门票、地铁、周边好吃好玩，以及 AI 的诚实点评。"
            }
          />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((p) => (
              <PlaceCard key={p.id} place={p} onOpen={() => setOpenId(p.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* TRIP */}
      <section id="trip" className="border-t border-border/40 bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:pl-32">
          <SectionHeader
            no="04"
            title={lang === "en" ? "Your walkable afternoon" : "你可以走完的下午"}
            subtitle={
              lang === "en"
                ? "Save 3 or more places and the trip stitches itself together — with a rain button ready."
                : "收藏 3 个以上，行程会自动串起来 —— 雨天按钮已准备好。"
            }
          />
          <div className="mt-10">
            <TripSection savedPlaces={savedPlaces} rainActive={rainActive} onToggleRain={() => setRain(!rainActive)} />
          </div>
        </div>
      </section>

      {/* ASK AI */}
      <section id="ask-ai" className="border-t border-border/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 lg:pl-32">
          <SectionHeader
            no="05"
            title={lang === "en" ? "Ask the concierge" : "问一下向导"}
            subtitle={
              lang === "en"
                ? "Ask about these 8 places, your saved route, food options, tickets, transit, and rain backups."
                : "围绕这 8 个地点、你的收藏路线、吃什么、票务、交通和雨天备份提问。"
            }
          />
          <div className="mt-10">
            <AskAI />
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section id="case-study" className="border-t border-border/40 bg-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:pl-32">
          <SectionHeader
            no="06"
            title={lang === "en" ? "Case Study" : "产品案例"}
            subtitle={
              lang === "en"
                ? "The live demo shows the experience. This section explains the product decisions, AI design, evidence boundaries, and roadmap behind it."
                : "上面的 Demo 展示体验；这里说明背后的产品判断、AI 设计、证据边界和未来规划。"
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {caseStudyDocs.map((doc) => (
              <article key={doc.id} className="rounded-3xl border border-border/60 bg-background p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-2 w-2 rounded-full bg-coral" />
                  <h3 className="font-display text-2xl font-semibold">{doc.title[lang]}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{doc.summary[lang]}</p>
                <ul className="mt-5 space-y-3">
                  {doc.points[lang].map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-border/60 bg-background p-6">
            <p className="font-display text-xl font-semibold">
              {lang === "en" ? "Important scope note" : "重要边界说明"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {lang === "en"
                ? "This website is an interactive concept demo. Place descriptions, ticket information, route times, scores, and AI responses are for demonstration and require source registration, live-data pipelines, and user validation before production use."
                : "本网站是交互式概念 Demo。地点描述、票务信息、路线时间、评分和 AI 回复均用于展示；真实上线前需要完成来源登记、实时数据管线和用户验证。"}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:pl-32">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <span className="font-display text-2xl font-semibold">
                {lang === "en" ? "About this demo" : "关于这个 Demo"}
              </span>
              <span className="text-sm text-muted-foreground group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm leading-relaxed text-foreground/80">
              <AboutRow h={lang === "en" ? "Problem" : "问题"} b={lang === "en" ? "For first-time visitors, Chengdu information is overloaded, not scarce. The cost is deciding what fits, what's trustworthy, and what's realistic today." : "对首次到成都的旅客，信息过载才是难点。真正的成本是：哪些合适、哪些可信、今天现实上做不做得到。"} />
              <AboutRow h={lang === "en" ? "MVP scope" : "MVP 范围"} b={lang === "en" ? "One loop, six sections, eight places, one AI concierge demo. No hotels, flights, ticket transactions, or social feed." : "一个循环、六个段落、八个地点、一个 AI 向导 Demo。不做酒店、机票、票务交易或社交流。"} />
              <AboutRow h={lang === "en" ? "AI architecture" : "AI 架构"} b={lang === "en" ? "Chat via Lovable AI Gateway. The 8 places are injected as a scoped knowledge base with ticket info, transit notes, nearby options, and risks." : "通过 Lovable AI Gateway 对话。8 个地点作为限定知识库注入 —— 票务信息、地铁提示、周边选择和风险。"} />
              <AboutRow h={lang === "en" ? "Data boundary" : "数据边界"} b={lang === "en" ? "Everything is inline demo data. No third-party reviews or usernames are copied. Live hours / booking rules would need dedicated pipelines." : "全部为内联 Demo 数据。不复制第三方评论或用户名。真实开放时间和预约规则需要专属数据管线。"} />
            </div>
          </details>
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© Chengdu Lens · Demo project</p>
            <p>
              {lang === "en" ? "Built with Lovable AI · Not affiliated with the city of Chengdu" : "由 Lovable AI 驱动 · 与成都市无关"}
            </p>
          </div>
        </div>
      </footer>

      <PlaceDetailSheet place={openPlace} onClose={() => setOpenId(null)} />
      <TasteProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

function SectionHeader({ no, title, subtitle }: { no: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-coral" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coral">{no}</span>
      </div>
      <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
        {title}
      </h2>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>
    </div>
  );
}

function IssueRow({ n, label, note }: { n: string; label: string; note: string }) {
  return (
    <li className="flex items-baseline gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="font-display text-xs font-semibold text-coral tabular-nums">{n}</span>
      <span className="flex-1 font-medium">{label}</span>
      <span className="text-xs text-muted-foreground text-right">{note}</span>
    </li>
  );
}

function TasteRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold capitalize">{value}</span>
    </div>
  );
}

function PrincipleCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-background border border-border/60 p-5 flex gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-display font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function AboutRow({ h, b }: { h: string; b: string }) {
  return (
    <div>
      <p className="font-display font-semibold text-foreground mb-1">{h}</p>
      <p>{b}</p>
    </div>
  );
}

function TripSection({
  savedPlaces,
  rainActive,
  onToggleRain,
}: {
  savedPlaces: Place[];
  rainActive: boolean;
  onToggleRain: () => void;
}) {
  const lang = useApp((s) => s.lang);
  const removeSave = useApp((s) => s.removeSave);

  const stops = useMemo(() => {
    if (!rainActive) return savedPlaces;
    let swapped = false;
    return savedPlaces.map((p) => {
      if (!swapped && !p.indoor && RAIN_SWAP[p.id]) {
        const swap = findPlace(RAIN_SWAP[p.id]);
        if (swap) {
          swapped = true;
          return swap;
        }
      }
      return p;
    });
  }, [savedPlaces, rainActive]);

  if (savedPlaces.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center bg-background">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-cream text-coral mb-4">
          <Bookmark className="h-6 w-6" />
        </span>
        <p className="font-display text-xl font-semibold mb-2">
          {lang === "en" ? "No places saved yet" : "还没有收藏地点"}
        </p>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {lang === "en"
            ? "Tap the bookmark on any Discover card. Save at least 3 to auto-build a walkable afternoon."
            : "点击任一发现卡片上的书签图标。收藏至少 3 个即可自动生成可走通的下午。"}
        </p>
        <Button
          onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-coral text-coral-foreground hover:bg-coral/90 rounded-full"
        >
          <Compass className="h-4 w-4 mr-1.5" />
          {lang === "en" ? "Explore places" : "去看看地点"}
        </Button>
      </div>
    );
  }

  if (savedPlaces.length < 3) {
    return (
      <div className="rounded-3xl bg-background border border-border/60 p-8">
        <p className="text-sm text-muted-foreground mb-4">
          {lang === "en"
            ? `You've saved ${savedPlaces.length} — one more to unlock the auto-route.`
            : `已收藏 ${savedPlaces.length} 个 —— 再加 1 个即可自动生成路线。`}
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {savedPlaces.map((p) => (
            <SavedMini key={p.id} place={p} onRemove={() => removeSave(p.id)} />
          ))}
        </div>
      </div>
    );
  }

  const totalMin = stops.reduce((s, p) => s + p.duration + p.distanceFromStartMin, 0);

  return (
    <div className="rounded-3xl bg-background border border-border/60 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-5">
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Clock className="h-4 w-4 text-coral" />
            {Math.round(totalMin / 60 * 10) / 10}h {lang === "en" ? "total" : "总时长"}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-leaf" />
            {stops.length} {lang === "en" ? "stops" : "站"}
          </span>
        </div>
        <Button
          size="sm"
          variant={rainActive ? "default" : "outline"}
          className={cn(
            "rounded-full",
            rainActive && "bg-sky text-sky-foreground hover:bg-sky/90",
          )}
          onClick={onToggleRain}
        >
          {rainActive ? (
            <>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              {lang === "en" ? "Back to original" : "回到原方案"}
            </>
          ) : (
            <>
              <CloudRain className="h-4 w-4 mr-1.5" />
              {lang === "en" ? "Rain just started" : "开始下雨了"}
            </>
          )}
        </Button>
      </div>
      <ol className="p-6 space-y-4">
        {stops.map((p, i) => {
          const original = savedPlaces[i];
          const swapped = rainActive && original && original.id !== p.id;
          return (
            <li key={`${p.id}-${i}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background font-display font-semibold text-sm">
                  {i + 1}
                </span>
                {i < stops.length - 1 && <span className="w-px flex-1 bg-border my-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {p.name}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">{p.zhName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {p.duration} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.area}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ticket className="h-3 w-3" /> {lang === "en" ? p.ticket.price : p.ticket.priceZh}
                      </span>
                    </p>
                  </div>
                  {swapped && (
                    <span className="text-[10px] uppercase tracking-widest bg-sky/15 text-sky px-2 py-0.5 rounded-full font-semibold">
                      {lang === "en" ? "Rain swap" : "雨天替换"}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-coral font-medium leading-snug">
                  {lang === "en" ? p.whyFits : p.whyFitsZh}
                </p>
                {swapped && original && (
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    {lang === "en"
                      ? `Swapped in for ${original.name} — indoor, keeps the arc.`
                      : `替换了 ${original.zhName} —— 室内，保持整体节奏。`}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SavedMini({ place, onRemove }: { place: Place; onRemove: () => void }) {
  const lang = useApp((s) => s.lang);
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden bg-cream/40">
      <PlaceImage src={place.image.url} alt={place.image.alt} className="aspect-[4/3] w-full" />
      <div className="p-3">
        <p className="font-display text-sm font-semibold truncate">{place.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{place.area}</p>
        <button
          onClick={onRemove}
          className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
          {lang === "en" ? "Remove" : "移除"}
        </button>
      </div>
    </div>
  );
}
