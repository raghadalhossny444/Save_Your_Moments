// AlbumDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Spinner,
  useToast,
  Container,
  Fade,
  IconButton,
  VStack,
  Flex,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import PhotoGallery from "../components/PhotoGallery";
import UploadModal from "../components/UploadModal";
import { getPhotos as getAlbumPhotos } from "../services/api";

const MotionBox = motion(Box);

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleUploadComplete = () => {
    fetchPhotos();
  };

  return (
    <Container maxW="container.xl" py={8} position="relative">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" color="text.primary" textAlign="center">
          Album {albumId}
        </Heading>
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
            <Text textAlign="center" fontSize="lg" color="text.primary">
              This album doesn't have any photos yet. Upload one to get started!
            </Text>
          ) : (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PhotoGallery photos={photos} setPhotos={setPhotos} />
            </MotionBox>
          )}
        </Fade>
      </VStack>
      <Tooltip label="Upload New Photo" placement="left">
        <IconButton
          icon={<FaPlus />}
          onClick={() => setIsModalOpen(true)}
          position="fixed"
          bottom={8}
          right={8}
          bg="teal.500"
          color="white"
          borderRadius="full"
          boxShadow="md"
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.700" }}
          size="lg"
          aria-label="Upload New Photo"
        />
      </Tooltip>
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUploadComplete}
        albumId={albumId}
      />
    </Container>
  );
};

export default AlbumDetailPage;
