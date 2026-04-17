export type OrderStatus =
  | "pending"
  | "confirmed"
  | "pushed"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed"
  | "returned"

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

export const ORDER_STATUSES: { value: OrderStatus | "all"; label: string }[] = [
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

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "yellow",
  confirmed: "blue",
  pushed: "purple",
  in_transit: "cyan",
  delivered: "green",
  cancelled: "red",
  failed: "red",
  returned: "orange",
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  pushed: "Pushed to Delivery",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
  returned: "Returned",
}
