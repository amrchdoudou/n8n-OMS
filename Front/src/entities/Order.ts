export type OrderStatus = string

export type DeliveryType = "domicile" | "stopdesk"

export interface Order {
  id: string
  shopifyId?: string
  customer: string
  phone: string
  location: string
  product: string
  price: number
  currency: string
  whatsappAttempts: number
  status: OrderStatus
  trackingId?: string
  deliveryType: DeliveryType
  createdAt: string

}

export const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pushed", label: "Pushed to Delivery" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "failed", label: "Failed" },
]

const KNOWN_STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  pushed: "purple",
  in_transit: "cyan",
  delivered: "green",
  cancelled: "red",
  failed: "red",
  returned: "orange",
}

const KNOWN_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  pushed: "Pushed to Delivery",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
  returned: "Returned",
}

/** Returns a color for any status string, with a fallback for unknown statuses */
export function getStatusColor(status: string): string {
  return KNOWN_STATUS_COLORS[status] ?? KNOWN_STATUS_COLORS[status.toLowerCase()] ?? "gray"
}

/** Returns a human-readable label for any status string */
export function getStatusLabel(status: string): string {
  return KNOWN_STATUS_LABELS[status] ?? KNOWN_STATUS_LABELS[status.toLowerCase()] ?? status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

// Keep backwards compatibility for components that reference these directly
export const STATUS_COLORS = new Proxy({} as Record<string, string>, {
  get: (_target, prop: string) => getStatusColor(prop),
})

export const STATUS_LABELS = new Proxy({} as Record<string, string>, {
  get: (_target, prop: string) => getStatusLabel(prop),
})
