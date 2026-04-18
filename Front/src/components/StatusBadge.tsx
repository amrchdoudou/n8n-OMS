import { Badge } from "@chakra-ui/react"
import { getStatusColor, getStatusLabel } from "../entities/Order"

interface Props {
  status: string
}

export function StatusBadge({ status }: Props) {
  return (
    <Badge
      colorScheme={getStatusColor(status)}
      variant={status === "failed" ? "solid" : "subtle"}
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      textTransform="none"
      fontWeight="600"
    >
      {getStatusLabel(status)}
    </Badge>
  )
}
