import { apiClient } from "./apiClient"
import type { Order, OrderStatus } from "../entities/Order"
import { useSettingsStore } from "../store/settingsStore"

const ORDERS_KEY = "oms.orders"

function readLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (raw) return JSON.parse(raw) as Order[]
  } catch {
    /* ignore */
  }
  const seeded = seedOrders()
  writeLocalOrders(seeded)
  return seeded
}

function writeLocalOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function seedOrders(): Order[] {
  const now = new Date()
  const iso = (offset: number) => new Date(now.getTime() - offset * 3600_000).toISOString()
  return [
    {
      id: "10321",
      customer: "Amine Benali",
      phone: "+213 555 12 34 56",
      location: "Alger Centre, Algiers",
      product: "Wireless Earbuds Pro",
      price: 4500,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "pending",
      deliveryType: "domicile",
      createdAt: iso(1),
    },
    {
      id: "10322",
      customer: "Sara Haddad",
      phone: "+213 661 78 90 12",
      location: "Hydra, Algiers",
      product: "Smart Watch Series 8",
      price: 12900,
      currency: "DZD",
      whatsappAttempts: 1,
      status: "pending",
      deliveryType: "stopdesk",
      createdAt: iso(3),
    },
    {
      id: "10323",
      customer: "Yacine Khelifi",
      phone: "+213 770 45 67 89",
      location: "Oran, Oran",
      product: "Portable Bluetooth Speaker",
      price: 3200,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "confirmed",
      deliveryType: "domicile",
      createdAt: iso(5),
    },
    {
      id: "10324",
      customer: "ليلى بوزيد",
      phone: "+213 550 00 11 22",
      location: "Constantine",
      product: "Leather Wallet",
      price: 2500,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "pushed",
      trackingId: "YAL-7821-334",
      deliveryType: "domicile",
      createdAt: iso(8),
    },
    {
      id: "10325",
      customer: "Mohamed Larbi",
      phone: "+213 699 33 44 55",
      location: "Setif",
      product: "Running Shoes",
      price: 6800,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "in_transit",
      trackingId: "MAY-1182-901",
      deliveryType: "stopdesk",
      createdAt: iso(24),
    },
    {
      id: "10326",
      customer: "Imene Toumi",
      phone: "+213 540 22 88 99",
      location: "Annaba",
      product: "Cotton T-Shirt Pack",
      price: 3900,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "delivered",
      trackingId: "DHD-4401-002",
      deliveryType: "domicile",
      createdAt: iso(72),
    },
    {
      id: "10327",
      customer: "Karim Messaoudi",
      phone: "+213 551 77 00 11",
      location: "Blida",
      product: "Sunglasses Classic",
      price: 2100,
      currency: "DZD",
      whatsappAttempts: 2,
      status: "cancelled",
      deliveryType: "domicile",
      createdAt: iso(30),
    },
    {
      id: "10328",
      customer: "Nadia Aït",
      phone: "+213 665 40 50 60",
      location: "Tizi Ouzou",
      product: "Kitchen Blender 900W",
      price: 8700,
      currency: "DZD",
      whatsappAttempts: 0,
      status: "pending",
      deliveryType: "domicile",
      createdAt: iso(2),
    },
  ]
}

function hook(path: keyof ReturnType<typeof getWebhooks>) {
  const webhooks = getWebhooks()
  return webhooks[path]
}

function getWebhooks() {
  return useSettingsStore.getState().settings.webhooks
}

export const ordersService = {
  async list(): Promise<Order[]> {
    // If a real webhook is configured for fetching, call it; else use local.
    return readLocalOrders().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  async updateStatus(id: string, status: OrderStatus, patch: Partial<Order> = {}): Promise<Order> {
    const orders = readLocalOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    const updated: Order = {
      ...orders[idx],
      ...patch,
      status,
    }
    orders[idx] = updated
    writeLocalOrders(orders)
    return updated
  },

  async sendWhatsApp(id: string): Promise<Order> {
    const orders = readLocalOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    const current = orders[idx]
    const attempts = current.whatsappAttempts + 1
    const url = hook("whatsappConfirm")
    if (url) {
      try {
        await apiClient.post(url, {
          orderId: current.id,
          phone: current.phone,
          product: current.product,
          price: current.price,
          attempt: attempts,
        })
      } catch (err) {
        console.error("[v0] whatsapp webhook failed, continuing in MVP mode", err)
      }
    }
    const nextStatus: OrderStatus =
      attempts >= 3 ? "cancelled" : current.status
    const updated: Order = {
      ...current,
      whatsappAttempts: attempts,
      status: nextStatus,
    }
    orders[idx] = updated
    writeLocalOrders(orders)
    return updated
  },

  async pushToDelivery(id: string): Promise<Order> {
    const orders = readLocalOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    const current = orders[idx]
    const url = hook("pushDelivery")
    let trackingId = current.trackingId
    if (url) {
      try {
        const res = await apiClient.post<{ trackingId?: string }>(url, { orderId: current.id })
        trackingId = res?.trackingId ?? trackingId
      } catch (err) {
        console.error("[v0] push-delivery webhook failed, continuing in MVP mode", err)
      }
    }
    if (!trackingId) {
      trackingId = `TRK-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        100 + Math.random() * 900,
      )}`
    }
    const updated: Order = {
      ...current,
      status: "pushed",
      trackingId,
    }
    orders[idx] = updated
    writeLocalOrders(orders)
    return updated
  },

  async refreshTracking(id: string): Promise<Order> {
    const orders = readLocalOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    const current = orders[idx]
    const url = hook("refreshTracking")
    let status: OrderStatus = current.status
    if (url) {
      try {
        const res = await apiClient.post<{ status?: OrderStatus }>(url, {
          orderId: current.id,
          trackingId: current.trackingId,
        })
        status = res?.status ?? status
      } catch (err) {
        console.error("[v0] refresh-tracking webhook failed, using mock", err)
      }
    }
    // MVP simulated progress
    if (!url) {
      if (current.status === "pushed") status = "in_transit"
      else if (current.status === "in_transit") status = "delivered"
    }
    const updated: Order = {
      ...current,
      status,
    }
    orders[idx] = updated
    writeLocalOrders(orders)
    return updated
  },

  async pushAllConfirmed(): Promise<Order[]> {
    const orders = readLocalOrders()
    const toPush = orders.filter((o) => o.status === "confirmed")
    for (const o of toPush) {
      await this.pushToDelivery(o.id)
    }
    return readLocalOrders()
  },

  async resetStore(): Promise<void> {
    localStorage.removeItem(ORDERS_KEY)
  },
}
