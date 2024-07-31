// Home.js
import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box maxWidth="800px" margin="auto" mt={8} p={4} textAlign="center">
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl" color="text.primary">
          Welcome to Save Your Moments
        </Heading>
        <Text fontSize="xl" color="text.secondary" maxW="600px">
          Capture, organize, and relive your precious memories with our
          intuitive photo album app. Whether you're storing personal moments or
          sharing with loved ones, we make it easy and enjoyable.
        </Text>

        {!isAuthenticated ? (
          <Button
            as={Link}
            to="/signup"
            size="lg"
            bg="teal.500"
            color="white"
            mt={4}
            _hover={{ bg: "teal.600" }}
            _focus={{ boxShadow: "outline" }}
          >
            Get Started
          </Button>
        ) : (
          <Button
            as={Link}
            to="/albums"
            size="lg"
            bg="teal.500"
            color="white"
            mt={4}
            _hover={{ bg: "teal.600" }}
            _focus={{ boxShadow: "outline" }}
          >
            View Your Albums
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
