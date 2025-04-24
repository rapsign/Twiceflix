import { Box, Text, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import CustomSwiper from "../CustomSwiper";
import usePlaylists from "../../hooks/usePlaylists";
import PlaylistModal from "./PlaylistModal";

const Playlist = () => {
  const { playlists, loading } = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  return (
    <Box bg="transparent" color="white" py={2} width="100%">
      <Text
        fontSize={{ base: "md", md: "2xl" }}
        fontWeight="bold"
        mb={2}
        px={2}
      >
        TWICE Playlist
      </Text>

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
          items={playlists}
          onItemClick={openModal}
          badgeLabel="Playlist"
          playlist="Playlist"
        />
      )}

      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={closeModal}
          playlist={selectedPlaylist}
          setPlaylist={setSelectedPlaylist}
        />
      )}
    </Box>
  );
};

export default Playlist;
