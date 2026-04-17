import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@chakra-ui/react"
import { ordersService } from "../services/ordersService"
import type { Order, OrderStatus } from "../entities/Order"
import { ORDERS_QUERY_KEY } from "./useOrders"

export function useOrderActions() {
  const qc = useQueryClient()
  const toast = useToast()

  const invalidate = () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })

  const showError = (err: unknown, fallback: string) => {
    const msg = err instanceof Error ? err.message : fallback
    toast({ status: "error", title: fallback, description: msg, isClosable: true })
  }

  const sendWhatsApp = useMutation({
    mutationFn: (id: string) => ordersService.sendWhatsApp(id),
    onSuccess: (order: Order) => {
      invalidate()
      if (order.status === "cancelled") {
        toast({
          status: "warning",
          title: `Order #${order.id} auto-cancelled`,
          description: "Customer did not reply after 2 attempts.",
          isClosable: true,
        })
      } else {
        toast({
          status: "success",
          title: `WhatsApp sent for #${order.id}`,
          description: `Attempt ${order.whatsappAttempts}/3`,
          isClosable: true,
        })
      }
    },
    onError: (err) => showError(err, "Failed to send WhatsApp"),
  })

  const confirmOrder = useMutation({
    mutationFn: async (id: string) => {
      await ordersService.updateStatus(id, "confirmed")
      return ordersService.pushToDelivery(id)
    },
    onSuccess: (order: Order) => {
      invalidate()
      toast({
        status: "success",
        title: `Order #${order.id} confirmed & pushed`,
        description: order.trackingId ? `Tracking: ${order.trackingId}` : undefined,
        isClosable: true,
      })
    },
    onError: (err) => showError(err, "Failed to confirm order"),
  })

  const cancelOrder = useMutation({
    mutationFn: (id: string) => ordersService.updateStatus(id, "cancelled"),
    onSuccess: (order: Order) => {
      invalidate()
      toast({ status: "info", title: `Order #${order.id} cancelled`, isClosable: true })
    },
    onError: (err) => showError(err, "Failed to cancel order"),
  })

  const reopenOrder = useMutation({
    mutationFn: (id: string) =>
      ordersService.updateStatus(id, "pending", { whatsappAttempts: 0 }),
    onSuccess: (order: Order) => {
      invalidate()
      toast({ status: "info", title: `Order #${order.id} reopened`, isClosable: true })
    },
    onError: (err) => showError(err, "Failed to reopen order"),
  })

  const pushDelivery = useMutation({
    mutationFn: (id: string) => ordersService.pushToDelivery(id),
    onSuccess: (order: Order) => {
      invalidate()
      toast({
        status: "success",
        title: `Order #${order.id} pushed!`,
        description: order.trackingId ? `Tracking: ${order.trackingId}` : undefined,
        isClosable: true,
      })
    },
    onError: (err) => showError(err, "Failed to push to delivery"),
  })

  const refreshTracking = useMutation({
    mutationFn: (id: string) => ordersService.refreshTracking(id),
    onSuccess: (order: Order) => {
      invalidate()
      toast({
        status: "info",
        title: `Tracking refreshed for #${order.id}`,
        description: `Status: ${order.status}`,
        isClosable: true,
      })
    },
    onError: (err) => showError(err, "Failed to refresh tracking"),
  })

  const pushAllConfirmed = useMutation({
    mutationFn: () => ordersService.pushAllConfirmed(),
    onSuccess: () => {
      invalidate()
      toast({ status: "success", title: "All confirmed orders pushed", isClosable: true })
    },
    onError: (err) => showError(err, "Bulk push failed"),
  })

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => invalidate(),
    onError: (err) => showError(err, "Failed to update status"),
  })

  return {
    sendWhatsApp,
    confirmOrder,
    cancelOrder,
    reopenOrder,
    pushDelivery,
    refreshTracking,
    pushAllConfirmed,
    setStatus,
  }
}
