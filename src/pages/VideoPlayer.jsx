import React from "react";
import { Box, IconButton, AspectRatio } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const youtubeUrl = location.state?.youtubeUrl || "#";

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|\/v\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bg="black"
      color="white"
      position="relative"
      overflow="hidden"
      m={0}
      p={0}
    >
      <IconButton
        icon={<BiArrowBack />}
        aria-label="Back"
        onClick={handleBack}
        position="absolute"
        top={14}
        left={4}
        colorScheme="white"
        fontSize="30px"
        zIndex={100}
      />

      {embedUrl ? (
        <AspectRatio ratio={16 / 9} width="100%" maxW="100%" maxH="100%">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
      ) : (
        <Box color="red">Invalid YouTube URL</Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
