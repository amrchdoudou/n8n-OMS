import { useMutation } from "@tanstack/react-query"
import { useToast } from "@chakra-ui/react"
import { authService } from "../services/authService"
import { apiClient } from "../services/apiClient"
import { useAuthStore } from "../store/authStore"
import { useState, useEffect } from "react"

export type AuthStatus = "checking" | "authenticated" | "unauthenticated"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  storeName: string
  telegram: string
  email: string
  password: string
}

export function useAuth() {
  const toast = useToast()
  const setUser = useAuthStore((s) => s.setUser)

  const login = useMutation({
    mutationFn: (creds: LoginCredentials) => authService.login(creds),
    onSuccess: (user) => {
      setUser(user)
      toast({ status: "success", title: `Welcome back!`, isClosable: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Login failed"
      toast({ status: "error", title: "Login failed", description: msg, isClosable: true })
    },
  })

  const register = useMutation({
    mutationFn: (creds: RegisterCredentials) => authService.register(creds),
    onSuccess: (user) => {
      setUser(user)
      toast({ status: "success", title: `Account created — welcome!`, isClosable: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Sign up failed"
      toast({ status: "error", title: "Sign up failed", description: msg, isClosable: true })
    },
  })

  return { login, register }
}

export function useAuthVerification() {
  const [status, setStatus] = useState<AuthStatus>("checking")
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      const accessToken = authService.getAccessToken()

      // No token at all → clear stale user data and mark unauthenticated
      if (!accessToken) {
        await logout()
        if (!cancelled) setStatus("unauthenticated")
        return
      }

      try {
        // Verify current access token with the backend
        await apiClient.post("auth/verify", { token: accessToken })

        if (!cancelled) setStatus("authenticated")
        return
      } catch {
        // Network error or server down — fall through to refresh attempt
      }

      // Access token invalid/expired — try refresh
      const newToken = await authService.refreshAccessToken()
      if (newToken) {
        if (!cancelled) setStatus("authenticated")
      } else {
        // Refresh also failed — force logout
        await logout()
        if (!cancelled) setStatus("unauthenticated")
      }
    }

    verify()

    return () => {
      cancelled = true
    }
  }, [logout])

  return status
}
