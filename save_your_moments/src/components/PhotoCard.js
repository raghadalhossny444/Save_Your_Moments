import React from "react";
import { Box, Image, Text, VStack, Flex, Icon } from "@chakra-ui/react";
import { FaCalendarAlt, FaCamera } from "react-icons/fa";
const API_BASE_URL = "http://localhost:8000"; // Replace with your actual backend URL

const PhotoCard = ({ id, photo, caption, date_of_uploading, album }) => {
  const uploadDate = new Date(date_of_uploading).toLocaleDateString();
  const photoUrl = photo ? `${API_BASE_URL}${photo}` : "/placeholder-image.jpg";

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
    >
      <Image
        src={photoUrl}
        alt={caption || "Photo"}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <VStack p={4} align="start" spacing={2}>
        <Text fontWeight="bold" fontSize="md" noOfLines={2}>
          {caption || "No caption"}
        </Text>
        <Flex align="center">
          <Icon as={FaCalendarAlt} color="gray.500" mr={2} />
          <Text color="gray.500" fontSize="sm">
            Uploaded: {uploadDate}
          </Text>
        </Flex>
        <Flex align="center">
          <Icon as={FaCamera} color="gray.500" mr={2} />
          <Text color="gray.500" fontSize="sm">
            Album: {album || "Unassigned"}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default PhotoCard;
