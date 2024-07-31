import React, { useState, useEffect, useRef } from "react";
import {
  SimpleGrid,
  Image,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  IconButton,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import { getPhotoStatus, deletePhoto } from "../services/api"; // Import the API calls

const MotionImage = motion(Image);

const API_BASE_URL = "http://localhost:8000";

const PhotoGallery = ({ photos, setPhotos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const { isOpen: isAlertOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const openModal = (index) => {
    setSelectedPhotoIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPhotoIndex(null);
  };

  const goToNextPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const goToPreviousPhoto = () => {
    setSelectedPhotoIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  const handleDelete = (photo) => {
    setDeletingPhoto(photo);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deletingPhoto) {
      try {
        await deletePhoto(deletingPhoto.id);
        setPhotos((prevPhotos) =>
          prevPhotos.filter((p) => p.id !== deletingPhoto.id)
        );
      } catch (error) {
        console.error("Failed to delete photo:", error);
      }
      setDeletingPhoto(null);
      onClose();
    }
  };

  useEffect(() => {
    const checkCaptions = async () => {
      try {
        for (const photo of photos) {
          if (!photo.caption) {
            const response = await getPhotoStatus(photo.id);
            if (response.caption) {
              setPhotos((prevPhotos) =>
                prevPhotos.map((p) =>
                  p.id === photo.id ? { ...p, caption: response.caption } : p
                )
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch photo status:", error);
      }
    };

    const intervalId = setInterval(checkCaptions, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [photos, setPhotos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        if (e.key === "ArrowLeft") {
          goToPreviousPhoto();
        } else if (e.key === "ArrowRight") {
          goToNextPhoto();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, selectedPhotoIndex]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {photos.map((photo, index) => (
          <VStack
            key={photo.id}
            spacing={2}
            align="center"
            cursor="pointer"
            position="relative"
          >
            <MotionImage
              src={`${API_BASE_URL}${photo.photo}`}
              alt={photo.caption || "Photo"}
              height="200px"
              width="100%"
              objectFit="cover"
              borderRadius="md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => openModal(index)}
            />
            <IconButton
              icon={<FaTrash />}
              position="absolute"
              top="2"
              right="2"
              colorScheme="red"
              size="sm"
              onClick={() => handleDelete(photo)}
            />
            <Text fontSize="sm" fontWeight="medium" textAlign="center">
              {photo.caption || (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Processing...
                </motion.span>
              )}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>

      {selectedPhotoIndex !== null && (
        <Modal isOpen={isOpen} onClose={closeModal} size="full">
          <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
          <ModalContent bg="transparent">
            <ModalCloseButton color="white" />
            <ModalBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Flex
                position="relative"
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  icon={<FaArrowLeft />}
                  onClick={goToPreviousPhoto}
                  aria-label="Previous Photo"
                  position="absolute"
                  left={30}
                  marginLeft="10px"
                  bg="whiteAlpha.600"
                  _hover={{ bg: "whiteAlpha.800" }}
                  size="lg"
                  borderRadius="full"
                />
                <Image
                  src={`${API_BASE_URL}${photos[selectedPhotoIndex].photo}`}
                  alt={photos[selectedPhotoIndex].caption || "Selected Photo"}
                  maxH="75vh"
                  maxW="50vw"
                  minH="40vh" // Min height for consistent viewing
                  minW="40vw" // Min width for consistent viewing
                  objectFit="contain"
                />
                <IconButton
                  icon={<FaArrowRight />}
                  onClick={goToNextPhoto}
                  aria-label="Next Photo"
                  position="absolute"
                  right={30}
                  marginRight="10px"
                  bg="whiteAlpha.600"
                  _hover={{ bg: "whiteAlpha.800" }}
                  size="lg"
                  borderRadius="full"
                />
              </Flex>
              <VStack
                maxW={"25vw"}
                spacing={4}
                p={1}
                textAlign="center"
                color="white"
              >
                <Text fontSize="lg" fontWeight="medium">
                  {photos[selectedPhotoIndex].caption || (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Processing...Caption is being Generated
                    </motion.span>
                  )}
                </Text>
                <Text fontSize={"md"} color="gray.300">
                  Strategy:{" "}
                  {photos[selectedPhotoIndex].caption_strategy.toUpperCase() ||
                    "No caption"}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  Uploaded:{" "}
                  {new Date(
                    photos[selectedPhotoIndex].date_of_uploading
                  ).toLocaleDateString()}
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Photo
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PhotoGallery;
