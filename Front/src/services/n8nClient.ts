import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

/**
 * Dedicated API client for communicating with n8n webhooks or APIs.
 */
class N8nClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("[N8N API] error:", error?.response?.data ?? error?.message)
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

export const n8nClient = new N8nClient()
