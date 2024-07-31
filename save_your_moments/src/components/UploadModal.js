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
  Image,
  VStack,
  Box,
  Grid,
  GridItem,
  Text,
  Progress,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { uploadPhotos } from "../services/api";

const UploadModal = ({ isOpen, onClose, albumId, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [useLLMVision, setUseLLMVision] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const previewURLs = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(previewURLs);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      await uploadPhotos(
        files,
        albumId,
        useLLMVision,
        setProgress,
        isArabic ? "ar" : "en"
      );
      onUpload();
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
        <ModalHeader>Upload Photos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Choose photos</FormLabel>
              <Button
                as="label"
                htmlFor="file-upload"
                cursor="pointer"
                size="lg"
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                width="full"
              >
                {files.length > 0
                  ? `${files.length} Photo(s) selected`
                  : "Choose Photo(s)"}
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                display="none"
                multiple
              />
            </FormControl>
            <HStack>
              <Switch
                isChecked={useLLMVision}
                onChange={(e) => setUseLLMVision(e.target.checked)}
              />
              <Text>Use LLM Vision for captioning</Text>
            </HStack>
            <HStack>
              <Switch
                isChecked={isArabic}
                onChange={(e) => setIsArabic(e.target.checked)}
              />
              <Text>Caption in Arabic</Text>
            </HStack>
            {previewURLs.length > 0 && (
              <Box width="100%">
                <Text fontWeight="bold" mb={2}>
                  Selected Photos:
                </Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  {previewURLs.map((url, index) => (
                    <GridItem key={index}>
                      <Image
                        src={url}
                        alt={`Selected ${index}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            )}
            {uploading && (
              <Progress
                value={progress}
                size="sm"
                width="100%"
                colorScheme="teal"
              />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="teal.500"
            color="white"
            onClick={handleUpload}
            isLoading={uploading}
            _hover={{ bg: "teal.600" }}
          >
            Upload
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
