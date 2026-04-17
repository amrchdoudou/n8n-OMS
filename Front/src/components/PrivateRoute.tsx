import { Navigate, Outlet } from "react-router-dom"
import { Center, Spinner, Text, VStack } from "@chakra-ui/react"
import { useAuthVerification } from "../hooks/useAuth"

/**
 * Wraps all private routes. Verifies the access token against the backend.
 * If the token is expired, it attempts a refresh. If both fail, it redirects
 * to /login. Public routes (login, setup) should NOT be wrapped by this.
 */
export function PrivateRoute() {
  const status = useAuthVerification()

  if (status === "checking") {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.500" fontSize="sm">
            Verifying authentication…
          </Text>
        </VStack>
      </Center>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
