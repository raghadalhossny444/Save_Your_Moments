import React, { useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionImage = motion(Image);

const API_BASE_URL = "http://localhost:8000"; // Replace with your actual backend URL

const PhotoGallery = ({ photos }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {photos.map((photo) => (
          <VStack
            key={photo.id}
            spacing={2}
            align="center"
            onClick={() => handlePhotoClick(photo)}
            cursor="pointer"
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            {selectedPhoto && (
              <VStack spacing={4} p={4}>
                <Image
                  src={`${API_BASE_URL}${selectedPhoto.photo}`}
                  alt={selectedPhoto.caption || "Photo"}
                  maxH="70vh"
                  width="100%"
                  objectFit="contain"
                />
                <Text fontSize="lg" fontWeight="medium">
                  {selectedPhoto.caption || (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Processing...
                    </motion.span>
                  )}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Uploaded:{" "}
                  {new Date(
                    selectedPhoto.date_of_uploading
                  ).toLocaleDateString()}
                </Text>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PhotoGallery;
