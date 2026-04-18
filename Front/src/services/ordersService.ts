import { apiClient } from "./apiClient"
import type { Order, OrderStatus } from "../entities/Order"

interface UserInfo {
  id: number
  apiKey?: string
  deliveryProvider?: string
  webhookUrl?: string
}

// Delivery provider API configurations
const DELIVERY_APIS: Record<string, {
  getTrackingUrl: (trackingId: string) => string
  getHeaders: (apiKey: string) => Record<string, string>
  extractStatus: (data: any) => string | null
}> = {
  yalidine: {
    getTrackingUrl: (trackingId) => `https://api.yalidine.app/v1/parcels/?tracking=${trackingId}`,
    getHeaders: (apiKey) => ({
      'X-API-ID': apiKey.split(':')[0] || apiKey,
      'X-API-TOKEN': apiKey.split(':')[1] || apiKey,
    }),
    extractStatus: (data) => {
      const p = data?.data?.[0];
      return p ? (p.status ?? p.statut ?? p.state ?? null) : null;
    },
  },
  maystro: {
    getTrackingUrl: (trackingId) => `https://backend.maystro-delivery.com/api/v1/tracking/${trackingId}`,
    getHeaders: (apiKey) => ({
      'Authorization': `Token ${apiKey}`,
    }),
    extractStatus: (data) => data?.status ?? data?.statut ?? data?.state ?? null,
  },
  dhd: {
    getTrackingUrl: (trackingId) => `https://api.dhd.delivery/api/v1/tracking/${trackingId}`,
    getHeaders: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
    }),
    extractStatus: (data) => data?.status ?? data?.statut ?? data?.state ?? null,
  },
  zrexpress: {
    getTrackingUrl: (trackingId) => `https://api.zrexpress.com/api/tracking/${trackingId}`,
    getHeaders: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
    }),
    extractStatus: (data) => data?.status ?? data?.statut ?? data?.state ?? null,
  },
}

export const ordersService = {
  async list(): Promise<Order[]> {
    try {
      const remoteOrders = await apiClient.get<Order[]>('orders/by-webhook')

      // Fetch user info from backend to get apiKey and deliveryProvider
      let userInfo: UserInfo | null = null
      try {
        userInfo = await apiClient.get<UserInfo>('users/me')
      } catch (err) {
        console.error("Failed to fetch user info for tracking:", err)
      }

      // For orders with a trackingId, fetch their status from the delivery provider
      if (userInfo?.apiKey && userInfo?.deliveryProvider) {
        const provider = DELIVERY_APIS[userInfo.deliveryProvider]
        if (provider) {
          const updatedOrders = await Promise.all(
            remoteOrders.map(async (order) => {
              if (order.trackingId) {
                try {
                  const trackingStatus = await this.fetchTrackingStatus(
                    order.trackingId,
                    userInfo!.apiKey!,
                    userInfo!.deliveryProvider!,
                  )
                  if (trackingStatus && trackingStatus !== order.status) {
                    // Update the order status in the backend
                    try {
                      await apiClient.put(`orders/by-tracking/${order.trackingId}`, { status: trackingStatus })
                    } catch (updateErr) {
                      console.error(`Failed to update status for order ${order.id}:`, updateErr)
                    }
                    return { ...order, status: trackingStatus }
                  } else if (!trackingStatus) {
                    // If tracking fetch did not work, default to this UI status
                    return { ...order, status: "pushing to delevery" }
                  }
                } catch (err) {
                  console.error(`Failed to fetch tracking for order ${order.id}:`, err)
                  return { ...order, status: "pushing to delevery" }
                }
              }
              return order
            })
          )
          return updatedOrders
        }
      }
      
      // Fallback for when tracking ID exists but we can't fetch it (no credentials or no provider)
      return remoteOrders.map(order => 
        order.trackingId ? { ...order, status: "pushing to delevery" } : order
      )
    } catch (err) {
      console.error("Failed to fetch remote orders, returning empty array:", err)
      return []
    }
  },

  async fetchTrackingStatus(trackingId: string, apiKey: string, deliveryProvider: string): Promise<string | null> {
    const provider = DELIVERY_APIS[deliveryProvider]
    if (!provider) return null

    try {
      const response = await fetch(provider.getTrackingUrl(trackingId), {
        headers: provider.getHeaders(apiKey),
      })

      if (!response.ok) return null

      const data = await response.json()
      return provider.extractStatus(data)
    } catch (err) {
      console.error("Tracking API error:", err)
      return null
    }
  },

  async updateStatus(id: string, status: string, patch: Partial<Order> = {}): Promise<Order> {
    const updated = await apiClient.put<Order>(`orders/${id}`, { ...patch, status })
    return updated
  },

  async resetStore(): Promise<void> {
    // No-op for remote orders
  },
}
