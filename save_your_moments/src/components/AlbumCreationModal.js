// AlbumCreationModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import { createAlbum } from "../services/api";

const AlbumCreationModal = ({ isOpen, onClose, onAlbumCreated }) => {
  const [name, setName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAlbum = async () => {
    if (!name) {
      alert("Album name is required.");
      return;
    }
    setIsCreating(true);
    try {
      await createAlbum(name, coverPhoto);
      onAlbumCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create album:", error);
      alert("Failed to create album. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader color="gray.800">Create New Album</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="gray.800">Album Name</FormLabel>
              <Input
                placeholder="Enter album name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg="gray.50"
                color="gray.800"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.800">Cover Photo</FormLabel>
              <Button
                as="label"
                htmlFor="cover-photo-upload"
                cursor="pointer"
                size="lg"
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                width="full"
              >
                {coverPhoto ? "Change Cover Photo" : "Upload Cover Photo"}
              </Button>
              <Input
                id="cover-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                display="none"
              />
              {coverPhotoPreview && (
                <Box mt={4} w="full" textAlign="center">
                  <Text fontWeight="bold" color="gray.800" mb={2}>
                    Cover Photo Preview:
                  </Text>
                  <Image
                    src={coverPhotoPreview}
                    alt="Cover Photo Preview"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                    mx="auto"
                  />
                </Box>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="teal.500"
            color="white"
            _hover={{ bg: "teal.600" }}
            onClick={handleCreateAlbum}
            isLoading={isCreating}
          >
            Create Album
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            ml={3}
            color="gray.800"
            _hover={{ bg: "gray.100" }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlbumCreationModal;
