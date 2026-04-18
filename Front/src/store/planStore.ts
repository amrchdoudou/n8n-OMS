import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PlanType = "free" | "normal" | "premium"

interface PlanState {
  plan: PlanType
  setPlan: (plan: PlanType) => void
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plan: "premium", // Default is premium as requested
      setPlan: (plan) => set({ plan }),
    }),
    {
      name: "oms.plan",
    }
  )
)
