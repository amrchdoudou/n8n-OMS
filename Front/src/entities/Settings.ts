export type DeliveryProvider = "maystro" | "yalidine" | "dhd" | "zrexpress" | "other"

export interface WebhookConfig {
  shopifyOrder: string
  whatsappConfirm: string
  whatsappReply: string
  pushDelivery: string
  refreshTracking: string
}

export interface StoreSettings {
  storeName: string
  whatsappNumber: string
  shopifyWebhookUrl: string
  deliveryProvider: DeliveryProvider
  deliveryApiKey: string
  webhooks: WebhookConfig
}

export const DEFAULT_WEBHOOKS: WebhookConfig = {
  shopifyOrder: "",
  whatsappConfirm: "",
  whatsappReply: "",
  pushDelivery: "",
  refreshTracking: "",
}

export const DELIVERY_PROVIDERS: { value: DeliveryProvider; label: string }[] = [
  { value: "maystro", label: "Maystro Delivery" },
  { value: "yalidine", label: "Yalidine" },
  { value: "dhd", label: "DHD" },
  { value: "zrexpress", label: "ZR Express" },
  { value: "other", label: "Other" },
]
