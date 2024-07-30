import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  useDisclosure,
  VStack,
  Text,
  Spinner,
  useToast,
  Container,
  Fade,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PhotoGallery from "../components/PhotoGallery";
import UploadModal from "../components/UploadModal";
import { getPhotos as getAlbumPhotos, uploadPhoto } from "../services/api";

const MotionBox = motion(Box);

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPhotos();
  }, [albumId]);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAlbumPhotos(albumId);
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

  const handleUpload = async (file, useLLMVision) => {
    try {
      await uploadPhoto(file, albumId, useLLMVision);
      fetchPhotos();
      onClose();
      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl" textAlign="center">
          Album Photos (Album ID: {albumId})
        </Heading>
        <Button
          onClick={onOpen}
          colorScheme="teal"
          size="lg"
          width="full"
          maxW="400px"
          alignSelf="center"
        >
          Upload New Photo
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
          ) : photos.length === 0 ? (
            <Text textAlign="center" fontSize="lg">
              This album doesn't have any photos yet. Upload one to get started!
            </Text>
          ) : (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PhotoGallery photos={photos} />
            </MotionBox>
          )}
        </Fade>
      </VStack>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        onUpload={handleUpload}
        albumId={albumId}
      />
    </Container>
  );
};

export default AlbumDetailPage;
