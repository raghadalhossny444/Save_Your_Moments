import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  VStack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import PhotoCard from "../components/PhotoCard";
import UploadModal from "../components/UploadModal";
import { getPhotos } from "../services/api";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPhotos();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      setError("Failed to fetch photos. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch photos. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    fetchPhotos();
    toast({
      title: "Upload successful",
      description: "Your photo has been uploaded successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="1200px" margin="auto" mt={8} p={4}>
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="xl">
          Your Photos
        </Heading>
        <Button onClick={onOpen} colorScheme="teal">
          Upload New Photo
        </Button>
        {isLoading ? (
          <Box textAlign="center">
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : photos.length === 0 ? (
          <Text>You don't have any photos yet. Upload one to get started!</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {photos.map((photo) => (
              <PhotoCard key={photo.id} {...photo} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        onUploadComplete={handleUploadComplete}
      />
    </Box>
  );
};

export default Photos;
