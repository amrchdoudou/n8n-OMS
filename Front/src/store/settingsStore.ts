import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { StoreSettings } from "../entities/Settings"
import { DEFAULT_WEBHOOKS } from "../entities/Settings"

interface SettingsState {
  settings: StoreSettings
  hasCompletedSetup: boolean
  setSettings: (patch: Partial<StoreSettings>) => void
  completeSetup: () => void
  reset: () => void
}

const defaultSettings: StoreSettings = {
  storeName: "",
  whatsappNumber: "",
  shopifyWebhookUrl: "",
  deliveryProvider: "yalidine",
  deliveryApiKey: "",
  webhooks: DEFAULT_WEBHOOKS,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      hasCompletedSetup: false,
      setSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),
      completeSetup: () => set({ hasCompletedSetup: true }),
      reset: () => set({ settings: defaultSettings, hasCompletedSetup: false }),
    }),
    { name: "oms.settings" },
  ),
)


