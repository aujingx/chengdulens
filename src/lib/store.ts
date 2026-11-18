import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/data/i18n";

export type Profile = {
  hours: number;
  start: string;
  endBy: string;
  taste: string[];
  diet: string;
  walking: string;
  weather: string;
  request: string;
};

export const DEMO_PROFILE: Profile = {
  hours: 4,
  start: "Taikoo Li",
  endBy: "18:30",
  taste: ["quiet", "local", "photo", "culture-food"],
  diet: "no-spicy",
  walking: "walking",
  weather: "indoor",
  request:
    "I have four hours this afternoon. Staying near Taikoo Li, prefer quiet local neighborhoods, no spicy food, would rather walk than sit in traffic.",
};

export type EventName =
  | "taste_profile_completed"
  | "request_submitted"
  | "place_viewed"
  | "evidence_detail_viewed"
  | "source_opened"
  | "place_saved"
  | "place_rejected"
  | "place_unsaved"
  | "place_confirmed"
  | "plan_confirmed"
  | "booking_opened"
  | "agent_tool_started"
  | "agent_tool_completed"
  | "agent_candidate_excluded"
  | "route_generated"
  | "replan_triggered"
  | "place_replaced"
  | "map_fallback_shown";

export type LogEntry = { name: EventName; ts: number; meta?: Record<string, unknown> };

type State = {
  lang: Lang;
  profile: Profile | null;
  saves: string[];
  rejects: string[];
  routeIds: string[];
  rainActive: boolean;
  rainSwaps: { originalId: string; replacementId: string }[];
  confirmedIds: string[];
  planStatus: "draft" | "confirmed";
  events: LogEntry[];
  agentOpen: boolean;
  setLang: (l: Lang) => void;
  setProfile: (p: Profile) => void;
  useDemoProfile: () => void;
  toggleSave: (id: string) => void;
  reject: (id: string) => void;
  removeSave: (id: string) => void;
  setRoute: (ids: string[]) => void;
  setRain: (v: boolean) => void;
  applyRainSwaps: (swaps: { originalId: string; replacementId: string }[]) => void;
  toggleConfirm: (id: string) => void;
  setPlanStatus: (s: "draft" | "confirmed") => void;
  setAgentOpen: (v: boolean) => void;
  log: (name: EventName, meta?: Record<string, unknown>) => void;
  reset: () => void;
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      lang: "en",
      profile: null,
      saves: [],
      rejects: [],
      routeIds: [],
      rainActive: false,
      rainSwaps: [],
      confirmedIds: [],
      planStatus: "draft",
      events: [],
      agentOpen: false,
      setLang: (lang) => set({ lang }),
      setProfile: (profile) => {
        set({ profile });
        get().log("taste_profile_completed");
      },
      useDemoProfile: () => {
        set({ profile: DEMO_PROFILE });
        get().log("taste_profile_completed", { demo: true });
      },
      toggleSave: (id) => {
        const has = get().saves.includes(id);
        set({
          saves: has ? get().saves.filter((x) => x !== id) : [...get().saves, id],
          rejects: get().rejects.filter((x) => x !== id),
        });
        if (has) set({ confirmedIds: get().confirmedIds.filter((x) => x !== id) });
        get().log(has ? "place_unsaved" : "place_saved", { id });
      },
      reject: (id) => {
        set({
          rejects: get().rejects.includes(id) ? get().rejects : [...get().rejects, id],
          saves: get().saves.filter((x) => x !== id),
        });
        get().log("place_rejected", { id });
      },
      removeSave: (id) => {
        set({
          saves: get().saves.filter((x) => x !== id),
          confirmedIds: get().confirmedIds.filter((x) => x !== id),
          planStatus: "draft",
        });
        get().log("place_unsaved", { id });
      },
      toggleConfirm: (id) => {
        const has = get().confirmedIds.includes(id);
        set({ confirmedIds: has ? get().confirmedIds.filter((x) => x !== id) : [...get().confirmedIds, id] });
        if (!has) get().log("place_confirmed", { id });
      },
      setPlanStatus: (planStatus) => {
        set({ planStatus });
        if (planStatus === "confirmed") get().log("plan_confirmed");
      },
      applyRainSwaps: (rainSwaps) => {
        set({ rainSwaps, rainActive: true });
        get().log("place_replaced", { swaps: rainSwaps });
      },
      setRoute: (routeIds) => {
        set({ routeIds, rainActive: false });
        get().log("route_generated", { ids: routeIds });
      },
      setRain: (rainActive) => {
        set(rainActive ? { rainActive } : { rainActive, rainSwaps: [] });
        if (rainActive) get().log("replan_triggered");
      },
      setAgentOpen: (agentOpen) => set({ agentOpen }),
      log: (name, meta) =>
        set({ events: [...get().events, { name, ts: Date.now(), meta }].slice(-200) }),
      reset: () =>
        set({
          profile: null,
          saves: [],
          rejects: [],
          routeIds: [],
          rainActive: false,
          rainSwaps: [],
          confirmedIds: [],
          planStatus: "draft",
          events: [],
        }),
    }),
    { name: "chengdu-lens-v1" },
  ),
);

export const useT = () => {
  const lang = useApp((s) => s.lang);
  return lang;
};
