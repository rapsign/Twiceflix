import { useState, useEffect } from "react";
import { Box, Heading, Grid, Image, Text } from "@chakra-ui/react";
import PlaylistModal from "../components/Playlist/PlaylistModal";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet";

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
    <>
      <Helmet>
        <meta
          name="description"
          content="Watch curated playlists of TWICE videos, performances, and more on TWICEFLIX!"
        />
        <meta
          name="keywords"
          content="TWICE, TWICEFLIX, playlist, kpop, videos, music"
        />
        <meta name="author" content="RapSign" />
      </Helmet>
      <Box p={4}>
        <Heading
          mb={3}
          mt={{ base: "10", md: "20" }}
          fontSize={{ base: "lg", md: "3xl" }}
          fontWeight="bold"
        >
          TWICE Playlist
        </Heading>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
          gap={3}
        >
          {playlists.map((playlist) => (
            <Box
              key={playlist.id}
              position="relative"
              borderRadius="xl"
              cursor="pointer"
              aspectRatio="16/9"
              onClick={() => openModal(playlist)}
              _hover={{
                "& .overlay": {
                  opacity: 1,
                  visibility: "visible",
                },
              }}
            >
              <Box
                position="absolute"
                top="-8px"
                left="1%"
                width="96%"
                height="100%"
                bg={"#4d4d4c"}
                borderRadius="xl"
                zIndex="0"
              />
              <Box
                position="absolute"
                top="-4px"
                left="1%"
                width="98%"
                height="100%"
                bg={"#8c8c8c"}
                borderRadius="xl"
                zIndex="1"
              />
              <Image
                src={playlist.thumbnail}
                alt={playlist.title}
                objectFit="cover"
                width="100%"
                height="100%"
                borderRadius="xl"
                position="relative"
                zIndex="2"
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
                zIndex="3"
              >
                <Text
                  isTruncated
                  fontSize="sm"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="center"
                >
                  {playlist.title}
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
    </>
  );
};

export default Playlist;
