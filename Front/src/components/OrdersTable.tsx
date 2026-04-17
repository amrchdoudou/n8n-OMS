import {
  Box,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { FiInbox } from "react-icons/fi"
import type { Order } from "../entities/Order"
import { OrderRow } from "./OrderRow"

interface Props {
  orders: Order[]
  isLoading?: boolean
}

export function OrdersTable({ orders, isLoading }: Props) {
  const bg = useColorModeValue("white", "gray.800")
  const border = useColorModeValue("gray.200", "gray.700")
  const headerBg = useColorModeValue("gray.50", "gray.900")

  if (isLoading) {
    return (
      <Box bg={bg} borderWidth="1px" borderColor={border} borderRadius="lg" p={12}>
        <Center>
          <Spinner color="brand.500" size="lg" />
        </Center>
      </Box>
    )
  }

  if (orders.length === 0) {
    return (
      <Box bg={bg} borderWidth="1px" borderColor={border} borderRadius="lg" p={12}>
        <Center>
          <VStack spacing={3}>
            <Box color="gray.400" fontSize="3xl">
              <FiInbox />
            </Box>
            <Text color="gray.500" fontSize="sm">
              No orders match this filter
            </Text>
          </VStack>
        </Center>
      </Box>
    )
  }

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="lg"
      overflow="hidden"
    >
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead bg={headerBg}>
            <Tr>
              <Th>#</Th>
              <Th>Customer</Th>
              <Th>Phone</Th>
              <Th>Location</Th>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>WhatsApp</Th>
              <Th>Status</Th>
              <Th>Tracking</Th>
              <Th>Call</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((o, i) => (
              <OrderRow key={o.id} order={o} index={i} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
