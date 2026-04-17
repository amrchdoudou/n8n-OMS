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
import { useSettingsStore, getShopifyWebhookUrl } from "../store/settingsStore"
import { DELIVERY_PROVIDERS } from "../entities/Settings"

export function SetupPage() {
  const user = useAuthStore((s) => s.user)
  const { settings, setSettings, completeSetup } = useSettingsStore()
  const navigate = useNavigate()
  const toast = useToast()

  const [storeName, setStoreName] = useState(settings.storeName || user?.storeName || "")
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber)
  const [deliveryProvider, setDeliveryProvider] = useState(settings.deliveryProvider)
  const [deliveryApiKey, setDeliveryApiKey] = useState(settings.deliveryApiKey)

  const shopifyUrl = useMemo(
    () => getShopifyWebhookUrl(user?.username ?? "store"),
    [user?.username],
  )
  const { hasCopied, onCopy } = useClipboard(shopifyUrl)

  const cardBg = useColorModeValue("white", "gray.800")
  const pageBg = useColorModeValue("gray.50", "gray.900")
  const border = useColorModeValue("gray.200", "gray.700")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSettings({
      storeName,
      whatsappNumber,
      shopifyWebhookUrl: shopifyUrl,
      deliveryProvider,
      deliveryApiKey,
    })
    completeSetup()
    toast({ status: "success", title: "Setup complete!", isClosable: true })
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
                      <Input value={shopifyUrl} isReadOnly fontFamily="mono" fontSize="sm" />
                      <InputRightElement width="3rem">
                        <IconButton
                          aria-label="Copy URL"
                          icon={hasCopied ? <FiCheck /> : <FiCopy />}
                          size="sm"
                          variant="ghost"
                          onClick={onCopy}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText fontSize="xs">
                      Paste this into Shopify → Settings → Notifications → Webhooks (Order
                      created).
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

                  <Button type="submit" size="md">
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
