import { Badge } from "@chakra-ui/react"
import type { OrderStatus } from "../entities/Order"
import { STATUS_COLORS, STATUS_LABELS } from "../entities/Order"

interface Props {
  status: OrderStatus
}

export function StatusBadge({ status }: Props) {
  return (
    <Badge
      colorScheme={STATUS_COLORS[status]}
      variant={status === "failed" ? "solid" : "subtle"}
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      textTransform="none"
      fontWeight="600"
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
