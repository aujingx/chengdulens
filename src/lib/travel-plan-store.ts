import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Plan } from "./travel-plan";

export const useTravelPlan = create<{ plan: Plan | null; setPlan: (plan: Plan) => void }>()(
  persist((set) => ({ plan: null, setPlan: (plan) => set({ plan }) }), {
    name: "chengdu-lens-planner-v1",
    skipHydration: true,
  }),
);
