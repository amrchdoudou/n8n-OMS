import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import { TopBar } from "../components/TopBar"
import { useSettingsStore } from "../store/settingsStore"
import { DELIVERY_PROVIDERS } from "../entities/Settings"
import type { WebhookConfig } from "../entities/Settings"

const WEBHOOK_FIELDS: { key: keyof WebhookConfig; label: string; description: string }[] = [
  {
    key: "shopifyOrder",
    label: "Shopify new order",
    description: "n8n webhook triggered when Shopify sends a new order.",
  },
  {
    key: "whatsappConfirm",
    label: "Send WhatsApp confirmation",
    description: "n8n webhook that sends confirmation messages to customers.",
  },
  {
    key: "whatsappReply",
    label: "Receive WhatsApp reply",
    description: "n8n webhook called when customers reply YES / NO.",
  },
  {
    key: "pushDelivery",
    label: "Push order to delivery",
    description: "n8n webhook that forwards orders to your delivery provider.",
  },
  {
    key: "refreshTracking",
    label: "Refresh tracking",
    description: "n8n webhook that re-fetches tracking status from the delivery service.",
  },
]

export function SettingsPage() {
  const { settings, setSettings } = useSettingsStore()
  const toast = useToast()
  const [local, setLocal] = useState(settings)

  const cardBg = useColorModeValue("white", "gray.800")
  const border = useColorModeValue("gray.200", "gray.700")

  const save = () => {
    setSettings(local)
    toast({ status: "success", title: "Settings saved", isClosable: true })
  }

  return (
    <Box minH="100vh">
      <TopBar />
      <Container maxW="4xl" px={{ base: 4, md: 6 }} py={6}>
        <Stack spacing={5}>
          <Box>
            <Heading size="lg">Settings</Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Manage your store, delivery provider, and n8n webhook URLs.
            </Text>
          </Box>

          <Card bg={cardBg} borderWidth="1px" borderColor={border} shadow="sm">
            <CardBody>
              <Tabs variant="enclosed" colorScheme="brand">
                <TabList>
                  <Tab>Store</Tab>
                  <Tab>Delivery</Tab>
                  <Tab>n8n Webhooks</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <Stack spacing={4} maxW="lg">
                      <FormControl>
                        <FormLabel fontSize="sm">Store name</FormLabel>
                        <Input
                          value={local.storeName}
                          onChange={(e) =>
                            setLocal({ ...local, storeName: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">WhatsApp number</FormLabel>
                        <Input
                          value={local.whatsappNumber}
                          onChange={(e) =>
                            setLocal({ ...local, whatsappNumber: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Shopify Webhook URL</FormLabel>
                        <Input
                          value={local.shopifyWebhookUrl}
                          isReadOnly
                          fontFamily="mono"
                          fontSize="sm"
                        />
                        <FormHelperText fontSize="xs">
                          Configured automatically from your username.
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </TabPanel>

                  <TabPanel px={0}>
                    <Stack spacing={4} maxW="lg">
                      <FormControl>
                        <FormLabel fontSize="sm">Delivery provider</FormLabel>
                        <Select
                          value={local.deliveryProvider}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              deliveryProvider: e.target.value as typeof local.deliveryProvider,
                            })
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
                        <FormLabel fontSize="sm">API key</FormLabel>
                        <Input
                          type="password"
                          value={local.deliveryApiKey}
                          onChange={(e) =>
                            setLocal({ ...local, deliveryApiKey: e.target.value })
                          }
                        />
                      </FormControl>
                    </Stack>
                  </TabPanel>

                  <TabPanel px={0}>
                    <Stack spacing={5}>
                      {WEBHOOK_FIELDS.map((field) => (
                        <FormControl key={field.key}>
                          <FormLabel fontSize="sm">{field.label}</FormLabel>
                          <Input
                            placeholder="https://n8n.example.com/webhook/..."
                            fontFamily="mono"
                            fontSize="sm"
                            value={local.webhooks[field.key]}
                            onChange={(e) =>
                              setLocal({
                                ...local,
                                webhooks: {
                                  ...local.webhooks,
                                  [field.key]: e.target.value,
                                },
                              })
                            }
                          />
                          <FormHelperText fontSize="xs">{field.description}</FormHelperText>
                        </FormControl>
                      ))}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <HStack justify="flex-end" pt={6}>
                <Button variant="ghost" onClick={() => setLocal(settings)}>
                  Reset
                </Button>
                <Button onClick={save}>Save changes</Button>
              </HStack>
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
