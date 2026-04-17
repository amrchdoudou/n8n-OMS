import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton,
  Container,
  Stack,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { TopBar } from "../components/TopBar"
import { StatsRow } from "../components/StatsRow"
import { FilterBar, type FilterValue } from "../components/FilterBar"
import { OrdersTable } from "../components/OrdersTable"
import { useOrders } from "../hooks/useOrders"
import { ORDER_STATUSES } from "../entities/Order"

export function DashboardPage() {
  const { data: orders = [], isLoading } = useOrders()
  const [filter, setFilter] = useState<FilterValue>("all")
  const [showBanner, setShowBanner] = useState(true)

  const counts = useMemo(() => {
    const c: Partial<Record<FilterValue, number>> = { all: orders.length }
    for (const s of ORDER_STATUSES) {
      if (s.value === "all") continue
      c[s.value] = orders.filter((o) => o.status === s.value).length
    }
    return c
  }, [orders])

  const filtered = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const pendingCount = counts["pending"] ?? 0

  return (
    <Box minH="100vh">
      <TopBar />
      <Container maxW="7xl" px={{ base: 4, md: 6 }} py={6}>
        <Stack spacing={5}>
          {showBanner && pendingCount > 0 && (
            <Alert status="warning" borderRadius="md" variant="left-accent">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                You have {pendingCount} pending order{pendingCount > 1 ? "s" : ""} awaiting
                WhatsApp confirmation.
              </AlertDescription>
              <CloseButton
                position="absolute"
                right={2}
                top={2}
                onClick={() => setShowBanner(false)}
              />
            </Alert>
          )}

          <StatsRow orders={orders} />
          <FilterBar value={filter} onChange={setFilter} counts={counts} />
          <OrdersTable orders={filtered} isLoading={isLoading} />
        </Stack>
      </Container>
    </Box>
  )
}
