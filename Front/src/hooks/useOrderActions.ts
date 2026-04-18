import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@chakra-ui/react"
import { ordersService } from "../services/ordersService"
import type { Order } from "../entities/Order"
import { ORDERS_QUERY_KEY } from "./useOrders"

export function useOrderActions() {
  const qc = useQueryClient()
  const toast = useToast()

  const invalidate = () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })

  const showError = (err: unknown, fallback: string) => {
    const msg = err instanceof Error ? err.message : fallback
    toast({ status: "error", title: fallback, description: msg, isClosable: true })
  }

  const confirmOrder = useMutation({
    mutationFn: (id: string) => ordersService.updateStatus(id, "confirmed"),
    onSuccess: (order: Order) => {
      invalidate()
      toast({
        status: "success",
        title: `Order #${order.id} confirmed`,
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

  const incrementWhatsAppAttempt = useMutation({
    mutationFn: async (order: Order) => {
      const newAttempts = (order.whatsappAttempts || 0) + 1
      if (newAttempts >= 3) {
        return ordersService.updateStatus(order.id, "cancelled", { whatsappAttempts: newAttempts })
      } else {
        return ordersService.updateStatus(order.id, order.status, { whatsappAttempts: newAttempts })
      }
    },
    onSuccess: (order: Order) => {
      invalidate()
      if (order.status === "cancelled") {
        toast({ status: "warning", title: `Order #${order.id} cancelled (max WhatsApp attempts)`, isClosable: true })
      } else {
        toast({ status: "info", title: `WhatsApp attempt recorded for #${order.id}`, isClosable: true })
      }
    },
    onError: (err) => showError(err, "Failed to record WhatsApp attempt"),
  })

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => invalidate(),
    onError: (err) => showError(err, "Failed to update status"),
  })

  return {
    confirmOrder,
    cancelOrder,
    reopenOrder,
    incrementWhatsAppAttempt,
    setStatus,
  }
}
