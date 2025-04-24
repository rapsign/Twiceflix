import { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import useVideos from "../hooks/useVideos";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoModal from "../components/Videos/VideoModal";
import VideoGrid from "../components/Videos/VideoGrid";

const Videos = () => {
  const { videos, isLoading } = useVideos();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box p={4}>
      <Heading
        mb={3}
        mt={{ base: "10", md: "20" }}
        fontSize={{ base: "lg", md: "3xl" }}
        fontWeight="bold"
      >
        TWICE Videos
      </Heading>
      <VideoGrid videos={videos} onVideoClick={handleVideoClick} />
      {selectedVideo && (
        <VideoModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
      )}
    </Box>
  );
};

export default Videos;
