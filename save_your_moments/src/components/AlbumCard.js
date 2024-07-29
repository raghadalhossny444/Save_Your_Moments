import React from "react";
import { Box, Image, Text, VStack, Flex, Icon } from "@chakra-ui/react";
import { FaCamera, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AlbumCard = ({ id, name, date_of_creation }) => {
  const navigate = useNavigate();

  const creationDate = new Date(date_of_creation).toLocaleDateString();
  const handleClick = () => {
    navigate(`/albums/${id}`);
  };
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <VStack p={4} align="start" spacing={2}>
        <Text fontWeight="bold" fontSize="xl" noOfLines={1}>
          {name}
        </Text>
        <Flex align="center">
          <Icon as={FaCalendarAlt} color="gray.500" mr={2} />
          <Text color="gray.500" fontSize="sm">
            Created: {creationDate}
          </Text>
        </Flex>
        <Flex align="center">
          <Icon as={FaCamera} color="gray.500" mr={2} />
          <Text color="gray.500" fontSize="sm">
            Album ID: {id}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default AlbumCard;
