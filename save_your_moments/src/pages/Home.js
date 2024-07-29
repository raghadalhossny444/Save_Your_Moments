import React from "react";
import { Box, Heading, Text, Button, VStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box maxWidth="800px" margin="auto" mt={8} p={4}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl" color="brand.300">
          Welcome to Save Your Moments
        </Heading>
        <Text fontSize="xl" textAlign="center" color="brand.400">
          Capture, organize, and relive your precious memories with our
          intuitive photo album app.
        </Text>

        {!isAuthenticated && (
          <Button
            as={Link}
            to="/signup"
            size="lg"
            colorScheme="teal"
            bg="brand.300"
            color="brand.100"
          >
            Get Started
          </Button>
        )}
        {isAuthenticated && (
          <Button
            as={Link}
            to="/albums"
            size="lg"
            colorScheme="teal"
            bg="brand.300"
            color="brand.100"
          >
            View Your Albums
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
