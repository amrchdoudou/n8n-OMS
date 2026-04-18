import { Box, Button, HStack, useColorModeValue } from "@chakra-ui/react"
import type { OrderStatus } from "../entities/Order"
import { ORDER_STATUSES } from "../entities/Order"

export type FilterValue = string

interface Props {
  value: FilterValue
  onChange: (v: FilterValue) => void
  counts: Partial<Record<FilterValue, number>>
}

export function FilterBar({ value, onChange, counts }: Props) {
  const bg = useColorModeValue("white", "gray.800")
  const border = useColorModeValue("gray.200", "gray.700")

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="lg"
      p={2}
      overflowX="auto"
    >
      <HStack spacing={2} minW="max-content">
        {ORDER_STATUSES.map((s) => {
          const active = value === s.value
          const count = counts[s.value] ?? 0
          return (
            <Button
              key={s.value}
              size="sm"
              variant={active ? "solid" : "ghost"}
              colorScheme={active ? "brand" : "gray"}
              onClick={() => onChange(s.value)}
              fontWeight="500"
            >
              {s.label}
              <Box
                as="span"
                ml={2}
                px={2}
                py={0.5}
                borderRadius="full"
                bg={active ? "whiteAlpha.300" : "gray.100"}
                color={active ? "white" : "gray.600"}
                fontSize="xs"
                fontWeight="600"
                _dark={{
                  bg: active ? "whiteAlpha.300" : "gray.700",
                  color: active ? "white" : "gray.300",
                }}
              >
                {count}
              </Box>
            </Button>
          )
        })}
      </HStack>
    </Box>
  )
}
