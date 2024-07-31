// SignUp.js
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, username);
      navigate("/");
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please check your details and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="400px"
      margin="auto"
      mt={8}
      p={6}
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="lg" color="text.primary">
          Sign Up
        </Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </FormControl>
        <Button
          type="submit"
          bg="teal.500"
          color="white"
          width="full"
          mt={4}
          _hover={{ bg: "teal.600" }}
        >
          Sign Up
        </Button>
        <Text mt={2} color="text.secondary">
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="teal.500" fontWeight="bold">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;
