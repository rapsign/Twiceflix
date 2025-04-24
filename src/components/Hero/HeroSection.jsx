import React from "react";
import { Box } from "@chakra-ui/react";
import useLatestVideo from "../../hooks/useLatestVideo";
import LoadingSpinner from "../LoadingSpinner";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import VideoModal from "../Videos/VideoModal";
import { useDisclosure } from "@chakra-ui/react";

const HeroSection = () => {
  const { latestVideo, loading } = useLatestVideo();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loading || !latestVideo) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      position="relative"
      color="white"
      height={{ base: "500px", md: "100vh" }}
      aspectRatio="16/9"
      width="100%"
      overflow="hidden"
      bg="black"
    >
      <HeroBackground thumbnail={latestVideo.thumbnail} />
      <HeroContent
        title={latestVideo.title}
        description={latestVideo.description}
        youtubeUrl={latestVideo.youtube_url}
        onMoreInfo={onOpen}
      />
      <VideoModal isOpen={isOpen} onClose={onClose} video={latestVideo} />
    </Box>
  );
};

export default HeroSection;
