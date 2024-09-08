import { useState, useEffect } from "react";
import { Box, Heading, Grid, Image, Text } from "@chakra-ui/react";
import PlaylistModal from "../components/PlaylistModal";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const Playlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistSnapshot = await getDocs(collection(db, "playlists"));
        const playlistData = playlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const playlistIds = playlistData.map((playlist) => playlist.id);
        const videoQuery = query(
          collection(db, "videos"),
          where("playlists", "array-contains-any", playlistIds),
          orderBy("published_at", "desc")
        );
        const videoSnapshot = await getDocs(videoQuery);

        const videoMap = {};
        videoSnapshot.docs.forEach((doc) => {
          const video = doc.data();
          video.playlists.forEach((playlistId) => {
            if (!videoMap[playlistId]) {
              videoMap[playlistId] = video;
            }
          });
        });

        const enrichedPlaylists = playlistData.map((playlist) => ({
          ...playlist,
          thumbnail:
            videoMap[playlist.id]?.thumbnail ||
            "https://via.placeholder.com/720x1280",
        }));

        setPlaylists(enrichedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const openModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
    setIsModalOpen(false);
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
      >
        TWICE Playlist
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
        gap={2}
      >
        {playlists.map((playlist) => (
          <Box
            key={playlist.id}
            borderRadius="md"
            overflow="hidden"
            position="relative"
            rounded="none"
            aspectRatio="16/9"
            _hover={{
              "& .overlay": {
                opacity: 1,
                visibility: "visible",
              },
            }}
            cursor="pointer"
            transition="background-color 0.3s ease"
            border="1px solid rgba(255, 255, 255, 0.1)"
            onClick={() => openModal(playlist)}
          >
            <Image
              src={playlist.thumbnail}
              alt={playlist.name}
              objectFit="cover"
              width="100%"
              height="100%"
            />
            <Box
              className="overlay"
              position="absolute"
              bottom={0}
              left={0}
              width="100%"
              p={2}
              bg="linear-gradient(to top right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6))"
              color="white"
              opacity={0}
              visibility="hidden"
              transition="opacity 0.3s ease, visibility 0.3s ease"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                isTruncated
                fontSize="sm"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="center"
              >
                {playlist.name}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={closeModal}
          playlist={selectedPlaylist}
        />
      )}
    </Box>
  );
};

export default Playlist;
