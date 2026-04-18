import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiMoon, FiPackage, FiRefreshCw, FiSettings, FiSun } from "react-icons/fi"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

import { useQueryClient } from "@tanstack/react-query"
import { ORDERS_QUERY_KEY } from "../hooks/useOrders"
import { PlansModal } from "./PlansModal"
import { useDisclosure } from "@chakra-ui/react"
import { FiStar } from "react-icons/fi"

export function TopBar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { isOpen: isPlansOpen, onOpen: onPlansOpen, onClose: onPlansClose } = useDisclosure()


  const border = useColorModeValue("gray.200", "gray.700")
  const bg = useColorModeValue("white", "gray.800")

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <Box
      as="header"
      bg={bg}
      borderBottomWidth="1px"
      borderColor={border}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={3}
        align="center"
        justify="space-between"
        gap={4}
      >
        <HStack spacing={3} as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex
            w={10}
            h={10}
            bg="brand.500"
            color="white"
            borderRadius="lg"
            align="center"
            justify="center"
          >
            <FiPackage size={20} />
          </Flex>
          <Box>
            <Heading size="sm" lineHeight="1">
              OMS Dashboard
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Order Management System
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Button
            leftIcon={<FiStar />}
            colorScheme="brand"
            variant="solid"
            size="sm"
            onClick={onPlansOpen}
            display={{ base: "none", md: "inline-flex" }}
          >
            Plans
          </Button>
          <Button
            leftIcon={<FiRefreshCw />}
            variant="outline"
            size="sm"
            onClick={() => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })}
            display={{ base: "none", md: "inline-flex" }}
          >
            Refresh Orders
          </Button>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            variant="ghost"
            size="sm"
            onClick={toggleColorMode}
          />
          <Menu>
            <MenuButton>
              <HStack spacing={2} cursor="pointer">
                <Avatar size="sm" name={user?.username ?? "U"} bg="brand.500" color="white" />
                <Box display={{ base: "none", md: "block" }} textAlign="left">
                  <Text fontSize="sm" fontWeight="600" lineHeight="1">
                    {user?.username ?? "Guest"}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {user?.storeName ?? ""}
                  </Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiSettings />} onClick={() => navigate("/settings")}>
                Settings
              </MenuItem>
              <MenuItem
                icon={<FiRefreshCw />}
                onClick={() => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })}
              >
                Refresh Orders
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      <PlansModal isOpen={isPlansOpen} onClose={onPlansClose} />
    </Box>
  )
}
