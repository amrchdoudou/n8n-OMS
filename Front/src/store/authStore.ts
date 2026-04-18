import { create } from "zustand"
import type { User } from "../entities/User"
import { authService } from "../services/authService"

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem("oms.currentUser")
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getCurrentUser(),
  setUser: (user) => set({ user }),
  logout: async () => {
    await authService.logout()
    set({ user: null })
  },
}))
