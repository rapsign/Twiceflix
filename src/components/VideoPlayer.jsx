import React from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const VideoPlayer = () => {
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="black"
      color="white"
      p={0}
      position="relative"
    >
      <IconButton
        icon={<BiArrowBack />}
        aria-label="Back"
        onClick={handleBack}
        position="absolute"
        top={4}
        left={4}
        colorScheme="white"
        fontSize="30px"
        zIndex={100}
      ></IconButton>

      <video controls width="100%" height="auto" src="#">
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoPlayer;
