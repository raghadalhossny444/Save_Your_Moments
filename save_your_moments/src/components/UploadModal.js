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
  Progress,
  Switch,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { uploadPhoto } from "../services/api";

const UploadModal = ({ isOpen, onClose, albumId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useLLMVision, setUseLLMVision] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadPhoto(file, albumId, useLLMVision, setProgress);
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Choose a photo</FormLabel>
              <Button
                as="label"
                htmlFor="file-upload"
                cursor="pointer"
                size="lg"
                colorScheme="teal"
                width="full"
              >
                {file ? file.name : "Choose File"}
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                display="none"
              />
            </FormControl>
            <HStack>
              <Switch
                isChecked={useLLMVision}
                onChange={(e) => setUseLLMVision(e.target.checked)}
              />
              <Text>Use LLM Vision for captioning</Text>
            </HStack>
            {uploading && <Progress value={progress} width="100%" />}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleUpload}
            isLoading={uploading}
          >
            Upload
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
