import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Badge,
  HStack,
  Box,
  Icon,
  Divider,
} from "@chakra-ui/react"
import { FiCheck, FiStar } from "react-icons/fi"
import { usePlanStore } from "../store/planStore"

interface PlansModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PlansModal({ isOpen, onClose }: PlansModalProps) {
  const { plan: currentPlan, setPlan } = usePlanStore()

  const handleSelectPlan = (plan: "free" | "normal" | "premium") => {
    setPlan(plan)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Choose Your Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <Text textAlign="center" color="gray.500" mb={6}>
            With limited-time free access by referal system (tree-based) the more you refer to us the more you get benefit!
          </Text>

          <HStack spacing={6} align="stretch" justify="center">
            {/* Free Plan */}
            <PlanCard
              title="Free Plan"
              isActive={currentPlan === "free"}
              onSelect={() => handleSelectPlan("free")}
              features={["Fetch data and dashboard"]}
            />

            {/* Normal Plan */}
            <PlanCard
              title="Normal Plan"
              isActive={currentPlan === "normal"}
              onSelect={() => handleSelectPlan("normal")}
              features={["Fetch data and dashboard", "Order approval"]}
            />

            {/* Premium Plan */}
            <PlanCard
              title="Premium Plan"
              isActive={currentPlan === "premium"}
              onSelect={() => handleSelectPlan("premium")}
              features={[
                "Fetch data and dashboard",
                "Order approval",
                "Auto_status change",
                "Automated delivery",
                "Stock tracking",
              ]}
              isPremium
            />
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function PlanCard({
  title,
  isActive,
  onSelect,
  features,
  isPremium,
}: {
  title: string
  isActive: boolean
  onSelect: () => void
  features: string[]
  isPremium?: boolean
}) {
  return (
    <Box
      flex={1}
      borderWidth="2px"
      borderColor={isActive ? "brand.500" : "gray.200"}
      borderRadius="xl"
      p={5}
      position="relative"
      bg={isActive ? "brand.50" : "white"}
      _dark={{ bg: isActive ? "brand.900" : "gray.800", borderColor: isActive ? "brand.500" : "gray.600" }}
    >
      {isPremium && (
        <Badge
          colorScheme="purple"
          position="absolute"
          top="-3"
          right="4"
          px={2}
          py={1}
          borderRadius="md"
        >
          <HStack spacing={1}>
            <Icon as={FiStar} />
            <Text>BEST VALUE</Text>
          </HStack>
        </Badge>
      )}

      <VStack spacing={4} align="stretch" h="full">
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          {isActive && (
            <Badge colorScheme="green" mt={2}>
              Current Plan
            </Badge>
          )}
        </Box>

        <Divider />

        <VStack align="start" spacing={3} flex={1}>
          {features.map((feature, idx) => (
            <HStack key={idx} align="start">
              <Icon as={FiCheck} color="brand.500" mt={1} />
              <Text fontSize="sm" fontWeight={isPremium ? "500" : "normal"}>{feature}</Text>
            </HStack>
          ))}
        </VStack>

        <Button
          colorScheme="brand"
          variant={isActive ? "solid" : "outline"}
          onClick={onSelect}
          w="full"
        >
          {isActive ? "Selected" : "Select Plan"}
        </Button>
      </VStack>
    </Box>
  )
}
