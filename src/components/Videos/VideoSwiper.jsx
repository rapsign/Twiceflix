import { Box, useDisclosure, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import useVideos from "../../hooks/useVideos";
import CustomSwiper from "../CustomSwiper";
import VideoModal from "./VideoModal";

const VideoSwiper = () => {
  const { videos, loading } = useVideos("videos", 20);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  return (
    <Box bg="transparent" color="white" py={2} width="100%" zIndex={100}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <CustomSwiper
          items={videos}
          title="TWICE Videos"
          onItemClick={handleVideoClick}
        />
      )}

      {selectedVideo && (
        <VideoModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
      )}
    </Box>
  );
};

export default VideoSwiper;
