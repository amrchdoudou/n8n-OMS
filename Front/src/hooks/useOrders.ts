import { useQuery } from "@tanstack/react-query"
import { ordersService } from "../services/ordersService"
import type { Order } from "../entities/Order"

export const ORDERS_QUERY_KEY = ["orders"] as const

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => ordersService.list(),
    staleTime: 5_000,
  })
}
