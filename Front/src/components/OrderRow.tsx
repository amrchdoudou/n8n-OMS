import {
  Button,
  HStack,
  IconButton,
  Tag,
  TagLabel,
  Td,
  Text,
  Tooltip,
  Tr,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  FiCheck,
  FiRotateCcw,
  FiX,
} from "react-icons/fi"
import { IoLogoWhatsapp, IoCallSharp } from "react-icons/io5"

import type { Order } from "../entities/Order"
import { StatusBadge } from "./StatusBadge"
import { useOrderActions } from "../hooks/useOrderActions"
import { usePlanStore } from "../store/planStore"

interface Props {
  order: Order
  index: number
}

export function OrderRow({ order, index }: Props) {
  const {
    confirmOrder,
    cancelOrder,
    reopenOrder,
    incrementWhatsAppAttempt,
  } = useOrderActions()

  const { plan } = usePlanStore()
  
  const showConfirm = plan === "premium"
  const showCancel = plan === "normal" || plan === "premium"
  const showWhatsApp = plan === "normal" || plan === "premium"

  const isPending = order.status === "pending" || order.status === "new" || order.status === "true"
  const isFailedOrCancelled =
    order.status === "cancelled" || order.status === "failed" || order.status === "returned"

  const attempts = order.whatsappAttempts || 0
  const attemptColor =
    attempts === 0
      ? "gray.500"
      : attempts === 1
        ? "orange.500"
        : "red.500"

  const hoverBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Tr _hover={{ bg: hoverBg }} transition="background 0.15s">
      <Td fontSize="sm" color="gray.500" fontWeight="500">
        {index + 1}
      </Td>
      <Td>
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="600" dir="auto">
            {order.customer}
          </Text>
          <Text fontSize="xs" color="gray.500">
            #{order.id}
          </Text>
        </VStack>
      </Td>
      <Td fontSize="sm" whiteSpace="nowrap">
        {order.phone}
      </Td>
      <Td>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" dir="auto">
            {order.location}
          </Text>
          <Tag
            size="sm"
            colorScheme={order.deliveryType === "domicile" ? "teal" : "orange"}
            variant="subtle"
          >
            <TagLabel fontSize="xs">
              {order.deliveryType === "domicile" ? "Domicile" : "Stop Desk"}
            </TagLabel>
          </Tag>
        </VStack>
      </Td>
      <Td>
        <VStack align="start" spacing={0} maxW="220px">
          <Text fontSize="sm" fontWeight="500" noOfLines={1}>
            {order.product}
          </Text>
        </VStack>
      </Td>
      <Td fontSize="sm" fontWeight="600" whiteSpace="nowrap">
        {order.price.toLocaleString()} {order.currency}
      </Td>
      <Td>
        <Text fontSize="sm" fontWeight="600" color={attemptColor}>
          {attempts}/3
        </Text>
      </Td>
      <Td>
        <StatusBadge status={order.status} />
      </Td>
      <Td>
        {order.trackingId ? (
          <Text fontSize="xs" fontFamily="mono" color="gray.600" _dark={{ color: "gray.300" }}>
            {order.trackingId}
          </Text>
        ) : (
          <Text fontSize="xs" color="gray.400">
            —
          </Text>
        )}
      </Td>
      <Td>
        <Tooltip label="Call via WhatsApp" hasArrow>
          <IconButton
            aria-label="WhatsApp Call"
            icon={<IoCallSharp size="20" />}
            size="sm"
            variant="ghost"
            color="#25D366"
            _hover={{ bg: "rgba(37, 211, 102, 0.1)" }}
            as="a"
            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
          />
        </Tooltip>
      </Td>
      <Td>
        <HStack spacing={1} justify="flex-end">
          {isPending && (
            <>
              {showWhatsApp && (
                <Tooltip label="Record WhatsApp attempt" hasArrow>
                  <IconButton
                    aria-label="WhatsApp Attempt"
                    icon={<IoLogoWhatsapp />}
                    size="sm"
                    colorScheme="whatsapp"
                    variant="outline"
                    onClick={() => incrementWhatsAppAttempt.mutate(order)}
                    isLoading={
                      incrementWhatsAppAttempt.isPending &&
                      incrementWhatsAppAttempt.variables?.id === order.id
                    }
                  />
                </Tooltip>
              )}
              {showConfirm && (
                <Tooltip label="Confirm order" hasArrow>
                  <IconButton
                    aria-label="Confirm"
                    icon={<FiCheck />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => confirmOrder.mutate(order)}
                    isLoading={
                      confirmOrder.isPending && confirmOrder.variables?.id === order.id
                    }
                  />
                </Tooltip>
              )}
              {showCancel && (
                <Tooltip label="Cancel order" hasArrow>
                  <IconButton
                    aria-label="Cancel"
                    icon={<FiX />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => cancelOrder.mutate(order.id)}
                    isLoading={
                      cancelOrder.isPending && cancelOrder.variables === order.id
                    }
                  />
                </Tooltip>
              )}
            </>
          )}

          {isFailedOrCancelled && (
            <Tooltip label="Reopen — reset to Pending" hasArrow>
              <Button
                leftIcon={<FiRotateCcw />}
                size="sm"
                colorScheme="orange"
                variant="outline"
                onClick={() => reopenOrder.mutate(order.id)}
                isLoading={reopenOrder.isPending && reopenOrder.variables === order.id}
              >
                Reopen
              </Button>
            </Tooltip>
          )}

          {order.status.toLowerCase().includes("deliver") && (
            <Text fontSize="xs" color="green.500" fontWeight="500">
              Completed
            </Text>
          )}
        </HStack>
      </Td>
    </Tr>
  )
}
