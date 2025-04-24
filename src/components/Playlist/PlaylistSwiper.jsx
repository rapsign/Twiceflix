import { Box, Text, useDisclosure } from "@chakra-ui/react";
import CustomSwiper from "../CustomSwiper";
import useListPlaylists from "../../hooks/useListPlaylist";
import { useState } from "react";

import VideoModal from "../Videos/VideoModal";
import LoadingSpinner from "../LoadingSpinner";

const PlaylistSwiper = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { playlists, loading } = useListPlaylists();

  const openModal = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Box bg="transparent" color="white" py={2} width="100%">
      {playlists.map((playlist) => (
        <Box key={playlist.id} mb={4}>
          <CustomSwiper
            items={playlist.videos}
            title={playlist.title}
            onItemClick={openModal}
          />
        </Box>
      ))}
      {selectedVideo && (
        <VideoModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
      )}
    </Box>
  );
};

export default PlaylistSwiper;
