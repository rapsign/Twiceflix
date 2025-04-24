import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroContent = ({ title, description, youtubeUrl, onMoreInfo }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/video-player`, {
      state: { youtubeUrl },
    });
  };

  return (
    <Box
      position="absolute"
      bottom="45%"
      left="2%"
      maxWidth={{ base: "auto", md: "50%" }}
      zIndex="2"
      p={4}
      borderRadius="md"
    >
      <Text
        fontSize={{ base: "md", md: "xl", lg: "4xl" }}
        fontWeight="extrabold"
        mb={2}
        textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
      >
        {title}
      </Text>
      <Text
        fontSize={{ base: "xs", md: "sm", lg: "md" }}
        textAlign="justify"
        mt={4}
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.7)"
      >
        {description}
      </Text>
      <Button
        bgColor="white"
        color="black"
        size={{ base: "sm", md: "md", lg: "lg" }}
        leftIcon={<FaPlay />}
        variant="solid"
        mt={6}
        onClick={handlePlayClick}
      >
        Play
      </Button>
      <Button
        leftIcon={<FaInfoCircle />}
        colorScheme="whiteAlpha"
        ml={2}
        mt={6}
        size={{ base: "sm", md: "md", lg: "lg" }}
        onClick={onMoreInfo}
      >
        More Info
      </Button>
    </Box>
  );
};

export default HeroContent;
