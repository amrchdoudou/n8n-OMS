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
  status: string
  trackingId?: string
  deliveryType: DeliveryType
  createdAt: string
}

/** Returns a color for any status string */
export function getStatusColor(status: string): string {
  const s = status.toLowerCase()
  if (s.includes("deliver")) return "green"
  if (s.includes("return")) return "orange"
  if (s.includes("cancel") || s.includes("fail")) return "red"
  if (s.includes("transit") || s.includes("wilaya")) return "cyan"
  if (s.includes("confirm") || s.includes("ready")) return "blue"
  if (s.includes("push") || s.includes("station")) return "purple"
  if (s.includes("pending")) return "yellow"
  if (s.includes("pickup")) return "teal"
  if (s.includes("suspend")) return "gray"
  if (s.includes("prepar")) return "orange"
  return "gray"
}

/** Returns a human-readable label for any status string */
export function getStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}
