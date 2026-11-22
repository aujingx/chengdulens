import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_DRAFT, type Draft, type Plan, type Start } from "./travel-plan";
import type { Mood } from "./wander";

type PlannerState = {
  plan: Plan | null;
  /** What the traveler has stated so far; shared by the sentence box, the chips and the wander hand-off. */
  draft: Draft;
  entryMode: "wander" | "plan";
  wander: { mood: Mood; seed: number; rain: boolean; start: Start };
  setPlan: (plan: Plan | null) => void;
  setDraft: (draft: Draft) => void;
  setEntryMode: (mode: "wander" | "plan") => void;
  setWander: (wander: PlannerState["wander"]) => void;
  weather: Weather;
  setWeather: (weather: Weather) => void;
};
export type Weather = { status: "loading" | "live" | "offline"; rain: boolean; temp?: number; override?: boolean };
export const useTravelPlan = create<PlannerState>()(
  persist((set) => ({
    plan: null,
    draft: EMPTY_DRAFT,
    entryMode: "wander",
    wander: { mood: "tea", seed: 0, rain: false, start: "Taikoo Li" },
    setPlan: (plan) => set({ plan }),
    setDraft: (draft) => set({ draft }),
    setEntryMode: (entryMode) => set({ entryMode }),
    setWander: (wander) => set({ wander }),
    weather: { status: "loading", rain: false },
    setWeather: (weather) => set({ weather }),
  }), { name: "chengdu-lens-planner-v2", skipHydration: true, partialize: ({ weather: _w, setWeather: _s, ...rest }) => rest }),
);
