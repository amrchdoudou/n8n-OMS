import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiPackage } from "react-icons/fi"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useAuthStore } from "../store/authStore"
import { useSettingsStore } from "../store/settingsStore"

export function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const hasCompletedSetup = useSettingsStore((s) => s.hasCompletedSetup)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
    storeName: "",
    email: "",
  })

  const pageBg = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")

  if (user) {
    return <Navigate to={hasCompletedSetup ? "/" : "/setup"} replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const u = await login.mutateAsync(loginForm).catch(() => null)
    if (u) navigate(hasCompletedSetup ? "/" : "/setup")
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const u = await register.mutateAsync(signupForm).catch(() => null)
    if (u) navigate("/setup")
  }

  return (
    <Box bg={pageBg} minH="100vh">
      <Center minH="100vh" px={4}>
        <Box w="full" maxW="md">
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
              <Heading size="lg">OMS Dashboard</Heading>
              <Text color="gray.500" fontSize="sm" mt={1}>
                Shopify orders, WhatsApp confirmations, delivery in one place
              </Text>
            </Box>
          </Stack>

          <Card bg={cardBg} shadow="sm" borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")}>
            <CardBody>
              <Tabs variant="soft-rounded" colorScheme="brand" isFitted>
                <TabList mb={6}>
                  <Tab>Log in</Tab>
                  <Tab>Create account</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <form onSubmit={handleLogin}>
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Email</FormLabel>
                          <Input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, email: e.target.value })
                            }
                            placeholder="you@example.com"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Password</FormLabel>
                          <Input
                            type="password"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, password: e.target.value })
                            }
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <Button type="submit" isLoading={login.isPending} size="md">
                          Log in
                        </Button>
                      </Stack>
                    </form>
                  </TabPanel>

                  <TabPanel p={0}>
                    <form onSubmit={handleSignup}>
                      <Stack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Username</FormLabel>
                          <Input
                            value={signupForm.username}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, username: e.target.value })
                            }
                            placeholder="your-store"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Email</FormLabel>
                          <Input
                            type="email"
                            value={signupForm.email}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, email: e.target.value })
                            }
                            placeholder="you@example.com"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Store name</FormLabel>
                          <Input
                            value={signupForm.storeName}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, storeName: e.target.value })
                            }
                            placeholder="My Shopify Store"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Password</FormLabel>
                          <Input
                            type="password"
                            value={signupForm.password}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, password: e.target.value })
                            }
                            placeholder="Choose a password"
                          />
                        </FormControl>
                        <Button type="submit" isLoading={register.isPending} size="md">
                          Create account
                        </Button>
                      </Stack>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          <Text textAlign="center" fontSize="xs" color="gray.500" mt={6}>
            By continuing you agree to store orders and settings locally.{" "}
            <Link color="brand.500">Learn more</Link>
          </Text>
        </Box>
      </Center>
    </Box>
  )
}
