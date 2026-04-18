import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { FiCheck, FiCopy, FiPackage } from "react-icons/fi"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useSettingsStore } from "../store/settingsStore"
import { DELIVERY_PROVIDERS } from "../entities/Settings"
import { useAuth, useWebhookUrl } from "../hooks/useAuth"

export function SetupPage() {
  const user = useAuthStore((s) => s.user)
  const { settings, setSettings, completeSetup } = useSettingsStore()
  const { updateContactInfo } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [storeName, setStoreName] = useState(settings.storeName || user?.storeName || "")
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber)
  const [deliveryProvider, setDeliveryProvider] = useState(settings.deliveryProvider)
  const [deliveryApiKey, setDeliveryApiKey] = useState(settings.deliveryApiKey)
  const [webhookStock, setWebhookStock] = useState(user?.webhookStock || "")

  const { webhookUrl, isLoading: isWebhookLoading } = useWebhookUrl()
  const shopifyUrl = webhookUrl || "https://bendaoud-bilal.app.n8n.cloud/webhook-test/fetchh"
  const { hasCopied, onCopy } = useClipboard(shopifyUrl)

  const cardBg = useColorModeValue("white", "gray.800")
  const pageBg = useColorModeValue("gray.50", "gray.900")
  const border = useColorModeValue("gray.200", "gray.700")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Call the backend to persist contact info
    await updateContactInfo.mutateAsync({
      number: whatsappNumber,
      storeName,
      apiKey: deliveryApiKey,
      deliveryProvider,
      webhookUrl: shopifyUrl,
      webhookStock: webhookStock,
    })

    // Also update local settings store
    setSettings({
      storeName,
      whatsappNumber,
      shopifyWebhookUrl: shopifyUrl,
      deliveryProvider,
      deliveryApiKey,
    })
    completeSetup()
    navigate("/")
  }

  return (
    <Box bg={pageBg} minH="100vh" py={10}>
      <Center px={4}>
        <Box w="full" maxW="2xl">
          <Stack spacing={6} align="center" mb={8}>
            <Flex
              w={14}
              h={14}
              bg="brand.500"
              color="white"
              borderRadius="xl"
              align="center"
              justify="center"
            >
              <FiPackage size={28} />
            </Flex>
            <Box textAlign="center">
              <Heading size="lg">Let&apos;s set up your OMS</Heading>
              <Text color="gray.500" fontSize="sm" mt={2}>
                Connect Shopify, WhatsApp, and your delivery provider to get started.
              </Text>
            </Box>
          </Stack>

          <Card bg={cardBg} borderWidth="1px" borderColor={border} shadow="sm">
            <CardHeader pb={2}>
              <Heading size="md">Store configuration</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Store name</FormLabel>
                    <Input
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="My Shopify Store"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">WhatsApp sender number</FormLabel>
                    <Input
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+213 555 00 00 00"
                    />
                    <FormHelperText fontSize="xs">
                      Used as the sender for customer confirmation messages.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Shopify Webhook URL</FormLabel>
                    <InputGroup>
                      <Input 
                        value={isWebhookLoading ? "Loading..." : shopifyUrl} 
                        isReadOnly 
                        fontFamily="mono" 
                        fontSize="sm" 
                        color={isWebhookLoading ? "gray.500" : "inherit"}
                      />
                      <InputRightElement width="3rem">
                        <IconButton
                          aria-label="Copy URL"
                          icon={hasCopied ? <FiCheck /> : <FiCopy />}
                          size="sm"
                          variant="ghost"
                          onClick={onCopy}
                          isDisabled={isWebhookLoading || !shopifyUrl}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText fontSize="xs">
                      Paste this into Shopify → Settings → Notifications → Webhooks (Order
                      created).
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Webhook Stock</FormLabel>
                    <Input
                      value={webhookStock}
                      onChange={(e) => setWebhookStock(e.target.value)}
                      placeholder="https://..."
                    />
                    <FormHelperText fontSize="xs">
                      The webhook endpoint for processing stock updates.
                    </FormHelperText>
                  </FormControl>

                  <HStack align="start" spacing={4} flexDir={{ base: "column", md: "row" }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Delivery provider</FormLabel>
                      <Select
                        value={deliveryProvider}
                        onChange={(e) =>
                          setDeliveryProvider(e.target.value as typeof deliveryProvider)
                        }
                      >
                        {DELIVERY_PROVIDERS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Delivery API key</FormLabel>
                      <Input
                        type="password"
                        value={deliveryApiKey}
                        onChange={(e) => setDeliveryApiKey(e.target.value)}
                        placeholder="••••••••"
                      />
                    </FormControl>
                  </HStack>

                  <Alert status="info" borderRadius="md" fontSize="sm">
                    <AlertIcon />
                    You can edit webhook URLs and n8n endpoints anytime in Settings.
                  </Alert>

                  <Button type="submit" size="md" isLoading={updateContactInfo.isPending}>
                    Finish setup &amp; open dashboard
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </Box>
      </Center>
    </Box>
  )
}
