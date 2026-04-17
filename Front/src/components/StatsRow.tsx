import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react"
import type { IconType } from "react-icons"
import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiSend,
  FiTruck,
  FiXCircle,
} from "react-icons/fi"
import type { Order } from "../entities/Order"

interface Props {
  orders: Order[]
}

interface StatConfig {
  label: string
  value: number
  icon: IconType
  color: string
}

export function StatsRow({ orders }: Props) {
  const count = (statuses: string[]) =>
    orders.filter((o) => statuses.includes(o.status)).length

  const stats: StatConfig[] = [
    { label: "Total", value: orders.length, icon: FiPackage, color: "gray.500" },
    { label: "Pending", value: count(["pending"]), icon: FiClock, color: "yellow.500" },
    { label: "Confirmed", value: count(["confirmed"]), icon: FiCheckCircle, color: "blue.500" },
    { label: "Pushed", value: count(["pushed", "in_transit"]), icon: FiSend, color: "purple.500" },
    { label: "Delivered", value: count(["delivered"]), icon: FiTruck, color: "green.500" },
    { label: "Cancelled", value: count(["cancelled", "failed", "returned"]), icon: FiXCircle, color: "red.500" },
  ]

  const bg = useColorModeValue("white", "gray.800")
  const border = useColorModeValue("gray.200", "gray.700")

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
      {stats.map((s) => (
        <Box
          key={s.label}
          bg={bg}
          borderWidth="1px"
          borderColor={border}
          borderRadius="lg"
          p={4}
        >
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel fontSize="xs" color="gray.500" fontWeight="500">
                {s.label}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="700" mt={1}>
                {s.value}
              </StatNumber>
            </Stat>
            <Flex
              w={10}
              h={10}
              borderRadius="md"
              bg={useColorModeValue("gray.50", "gray.700")}
              align="center"
              justify="center"
              color={s.color}
            >
              <Icon as={s.icon} boxSize={5} />
            </Flex>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  )
}
