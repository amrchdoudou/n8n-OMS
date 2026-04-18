import { create } from "zustand"
import type { User } from "../entities/User"
import { authService } from "../services/authService"

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  setUser: (user) => set({ user }),
  logout: async () => {
    await authService.logout()
    set({ user: null })
  },
}))
