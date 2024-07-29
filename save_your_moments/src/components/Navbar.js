import React from "react";
import { Box, Flex, Button, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box bg="brand.300" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg" color="brand.100">
          Save Your Moments
        </Heading>
        <Flex alignItems="center">
          <Link to="/">
            <Button colorScheme="teal" variant="ghost" mr={3}>
              Home
            </Button>
          </Link>
          <Link to="/albums">
            <Button colorScheme="teal" variant="ghost" mr={3}>
              Albums
            </Button>
          </Link>

          {isAuthenticated ? (
            <Button colorScheme="teal" variant="solid" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button colorScheme="teal" variant="solid" mr={3}>
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button colorScheme="teal" variant="outline">
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
