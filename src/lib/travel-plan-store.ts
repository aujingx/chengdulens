import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Plan } from "./travel-plan";
import type { Mood } from "./wander";

type PlannerState = {
  plan: Plan | null;
  entryMode: "wander" | "plan";
  wander: { mood: Mood; seed: number; rain: boolean };
  setPlan: (plan: Plan) => void;
  setEntryMode: (mode: "wander" | "plan") => void;
  setWander: (wander: PlannerState["wander"]) => void;
};
export const useTravelPlan = create<PlannerState>()(
  persist((set) => ({
    plan: null,
    entryMode: "wander",
    wander: { mood: "tea", seed: 0, rain: false },
    setPlan: (plan) => set({ plan }),
    setEntryMode: (entryMode) => set({ entryMode }),
    setWander: (wander) => set({ wander }),
  }), { name: "chengdu-lens-planner-v1", skipHydration: true }),
);
