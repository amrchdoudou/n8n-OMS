export type OrderStatus =
  | "pending"
  | "confirmed"
  | "pushed"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed"
  | "returned"
  | "READY"
  | "PICKUP"
  | "TO_STATION"
  | "IN_STATION"
  | "TO_WILAYA"
  | "PREPARING"
  | "IN_TRANSIT"
  | "SUSPENDED"
  | "DELIVERED"
  | "RETURNED"

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
  { value: "READY", label: "Ready" },
  { value: "PICKUP", label: "Pickup" },
  { value: "TO_STATION", label: "To Station" },
  { value: "IN_STATION", label: "In Station" },
  { value: "TO_WILAYA", label: "To Wilaya" },
  { value: "PREPARING", label: "Preparing" },
  { value: "IN_TRANSIT", label: "In Transit (DHD)" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DELIVERED", label: "Delivered (DHD)" },
  { value: "RETURNED", label: "Returned (DHD)" },
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
  READY: "blue",
  PICKUP: "teal",
  TO_STATION: "purple",
  IN_STATION: "indigo",
  TO_WILAYA: "pink",
  PREPARING: "orange",
  IN_TRANSIT: "cyan",
  SUSPENDED: "gray",
  DELIVERED: "green",
  RETURNED: "red",
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
  READY: "Ready",
  PICKUP: "Pickup",
  TO_STATION: "To Station",
  IN_STATION: "In Station",
  TO_WILAYA: "To Wilaya",
  PREPARING: "Preparing",
  IN_TRANSIT: "In Transit (DHD)",
  SUSPENDED: "Suspended",
  DELIVERED: "Delivered (DHD)",
  RETURNED: "Returned (DHD)",
}
