import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"

/**
 * Generic API client that wraps axios. All services go through this
 * so we have a single place where GET / POST / PUT / DELETE requests
 * are handled (headers, error parsing, etc).
 */
class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Attach auth token to every request
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("oms.accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("[API] error:", error?.response?.data ?? error?.message)
        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<T>(url, config)
    return res.data
  }

  async post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.post<T>(url, body, config)
    return res.data
  }

  async put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.put<T>(url, body, config)
    return res.data
  }

  async patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.patch<T>(url, body, config)
    return res.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<T>(url, config)
    return res.data
  }
}

export const apiClient = new ApiClient()
