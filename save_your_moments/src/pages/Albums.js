// Albums.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  useDisclosure,
  Spinner,
  Container,
  Fade,
  IconButton,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AddIcon } from "@chakra-ui/icons";
import AlbumCard from "../components/AlbumCard";
import AlbumCreationModal from "../components/AlbumCreationModal";
import { getAlbums } from "../services/api";

const MotionSimpleGrid = motion(SimpleGrid);

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAlbums();
      const albumsData = response.data || response;
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
      setError("Failed to fetch albums. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onAlbumCreated = () => {
    fetchAlbums();
    toast({
      title: "Album created",
      description: "Your new album has been created successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8} position="relative">
      <VStack spacing={8} align="center">
        {" "}
        {/* Changed align="stretch" to align="center" */}
        <Heading as="h1" size="xl" color="text.primary" textAlign="center">
          Albums
        </Heading>
        <Flex justify="space-between" align="center" mb={4} w="100%">
          {" "}
          {/* Added w="100%" */}
          <Tooltip label="Create New Album" placement="left">
            <IconButton
              icon={<AddIcon />}
              onClick={onOpen}
              bg="teal.500"
              color="white"
              size="lg"
              isRound
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
              aria-label="Add Album"
              position={"absolute"}
              top={20}
              right={10}
            />
          </Tooltip>
        </Flex>
        <Fade in={!isLoading}>
          {isLoading ? (
            <Box textAlign="center">
              <Spinner size="xl" color="teal.500" thickness="4px" />
            </Box>
          ) : error ? (
            <Text color="red.500" textAlign="center" fontSize="lg">
              {error}
            </Text>
          ) : albums.length === 0 ? (
            <Text textAlign="center" fontSize="lg" color="text.primary">
              You don't have any albums yet. Create one to get started!
            </Text>
          ) : (
            <MotionSimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  name={album.name}
                  date_of_creation={album.date_of_creation}
                  cover_photo={album.cover_photo}
                />
              ))}
            </MotionSimpleGrid>
          )}
        </Fade>
      </VStack>
      <AlbumCreationModal
        isOpen={isOpen}
        onClose={onClose}
        onAlbumCreated={onAlbumCreated}
      />
    </Container>
  );
};

export default Albums;
