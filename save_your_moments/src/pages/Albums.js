import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  Text,
  VStack,
  useToast,
  Spinner,
  Container,
  Fade,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AlbumCard from "../components/AlbumCard";
import UploadModal from "../components/UploadModal";
import { getAlbums, createAlbum } from "../services/api";

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

  const handleCreateAlbum = async () => {
    const name = prompt("Enter album name:");
    if (name) {
      try {
        await createAlbum(name);
        fetchAlbums();
        toast({
          title: "Album created",
          description: `Album "${name}" has been created successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Failed to create album:", error);
        toast({
          title: "Error",
          description: "Failed to create album. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl" textAlign="center">
          Your Photo Albums
        </Heading>
        <Button
          onClick={handleCreateAlbum}
          colorScheme="teal"
          size="lg"
          width="full"
          maxW="400px"
          alignSelf="center"
        >
          Create New Album
        </Button>
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
            <Text textAlign="center" fontSize="lg">
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
                />
              ))}
            </MotionSimpleGrid>
          )}
        </Fade>
      </VStack>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        onUploadComplete={fetchAlbums}
      />
    </Container>
  );
};

export default Albums;
