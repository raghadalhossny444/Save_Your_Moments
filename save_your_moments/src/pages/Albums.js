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
} from "@chakra-ui/react";
import AlbumCard from "../components/AlbumCard";
import UploadModal from "../components/UploadModal";
import { getAlbums, createAlbum } from "../services/api";

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
      // Check if the response has a data property
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
    <Box maxWidth="1200px" margin="auto" mt={8} p={4}>
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="xl">
          Your Albums
        </Heading>
        <Button onClick={handleCreateAlbum} colorScheme="teal">
          Create New Album
        </Button>
        {isLoading ? (
          <Box textAlign="center">
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : albums.length === 0 ? (
          <Text>You don't have any albums yet. Create one to get started!</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                name={album.name}
                date_of_creation={album.date_of_creation}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        onUploadComplete={fetchAlbums}
      />
    </Box>
  );
};

export default Albums;
