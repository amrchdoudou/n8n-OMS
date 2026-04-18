import { apiClient } from "./apiClient"
import type { User } from "../entities/User"
import axios from "axios"

import { n8nClient } from "./n8nClient"

const ACCESS_TOKEN_KEY = "oms.accessToken"
const REFRESH_TOKEN_KEY = "oms.refreshToken"
const CURRENT_USER_KEY = "oms.currentUser"


interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface RegisterCredentials {
  username: string
  storeName: string
  email: string
  password: string
}

interface UpdateContactInfoPayload {
  number: string
  storeName: string
  apiKey: string
  deliveryProvider: string
  webhookUrl: string
  webhookStock: string
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<User> {
    const user = await apiClient.post<User>("users/", credentials)
    // After registration, log the user in automatically
    const tokens = await apiClient.post<LoginResponse>("auth/login", {
      email: credentials.email,
      password: credentials.password,
    })
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  async updateContactInfo(payload: UpdateContactInfoPayload): Promise<User> {
    const user = await apiClient.put<User>("users/update-contact-info", payload)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  async getWebhookUrl(): Promise<{ webhookUrl: string }> {
    // Call the external n8n webhook using the dedicated n8n api client
    // The base URL for the n8nClient is already set to process the env variable!
    const response = await n8nClient.get<{ url?: string; webhookUrl?: string } | string>("")
    
    // Attempt to handle both plain text URL response and JSON response
    const data = response;
    if (typeof data === "string") {
      return { webhookUrl: data };
    }
    return { webhookUrl: data.webhookUrl || data.url || "" };
  },

  async login(credentials: { email: string; password: string }): Promise<User & LoginResponse> {
    const tokens = await apiClient.post<LoginResponse>("auth/login", {
      email: credentials.email,
      password: credentials.password,
    })
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    // We don't have a "get current user" endpoint, so store token info
    // The user data will come from the token — for now we store a minimal user
    const user = { ...tokens } as User & LoginResponse
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  async logout(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) return null
    try {
      const tokens = await apiClient.post<LoginResponse>("auth/refresh", { refreshToken })
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
      return tokens.accessToken
    } catch {
      // Refresh failed — user needs to log in again
      await authService.logout()
      return null
    }
  },
}
