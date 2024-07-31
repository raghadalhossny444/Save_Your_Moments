// Navbar.js
import React from "react";
import { Box, Flex, Button, Heading } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Box px={4} py={2} borderBottom="1px solid" borderColor="gray.200">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading
          as={Link}
          to="/"
          size="lg"
          color="text.primary"
          fontWeight="bold"
        >
          Save Your Moments
        </Heading>
        <Flex alignItems="center">
          <Link to="/">
            <Button
              variant="outline"
              bg={isActive("/") ? "gray.200" : "white"}
              color="text.primary"
              borderColor={"teal"}
              _hover={{ bg: "gray.200" }}
              mr={3}
            >
              Home
            </Button>
          </Link>
          {isAuthenticated && (
            <Link to="/albums">
              <Button
                variant="outline"
                bg={isActive("/albums") ? "gray.200" : "white"}
                color="text.primary"
                borderColor={"teal"}
                _hover={{ bg: "gray.200" }}
                mr={3}
              >
                Albums
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <Button
              bg="white"
              color="red.500"
              onClick={logout}
              variant={"outline"}
              borderColor={"red.500"}
              ml={3}
              _hover={{ bg: "red.600", color: "white" }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  bg={isActive("/login") ? "gray.200" : "white"}
                  color="text.primary"
                  borderColor={"teal"}
                  _hover={{ bg: "gray.200" }}
                  mr={3}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="outline"
                  bg={isActive("/signup") ? "gray.200" : "white"}
                  color="text.primary"
                  borderColor={"teal"}
                  _hover={{ bg: "gray.200" }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
