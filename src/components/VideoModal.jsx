import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
  Link,
  Heading,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./PlaylistModal";

const VideoModal = ({ isOpen, onClose, video }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Create a query for fetching multiple playlists
        const playlistsQuery = query(
          collection(db, "playlists"),
          where("__name__", "in", video.playlists)
        );
        const querySnapshot = await getDocs(playlistsQuery);

        const fetchedPlaylists = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlaylists(fetchedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    if (video?.playlists?.length) {
      fetchPlaylists();
    }
  }, [video]);

  const handlePlayClick = () => {
    navigate(`/video-player`, { state: { youtubeUrl: video.youtube_url } });
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "lg", md: "xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bg="#333333"
          position="relative"
          borderRadius="none"
          maxWidth={{ base: "auto", md: "800px" }}
          margin="auto"
        >
          <ModalCloseButton zIndex={100} size="xl" />
          <Box
            position="relative"
            width="100%"
            height="400px"
            overflow="hidden"
            aspectRatio="16/9"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              objectFit="cover"
              width="100%"
              height="100%"
              rounded="none"
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              height="50%"
              background="linear-gradient(180deg, rgba(51,51,51,0) 9%, rgba(51,51,51,0.742734593837535) 53%, rgba(51,51,51,1) 83%)"
            />
            <Box
              position="absolute"
              top={{ base: "50%", md: "60%" }}
              px={5}
              color="white"
            >
              <Heading size="lg">{video.title}</Heading>
              <Flex align="center">
                <Button
                  bgColor="white"
                  color="black"
                  size={{ base: "sm", md: "md", lg: "lg" }}
                  rounded="none"
                  leftIcon={<FaPlay />}
                  variant="solid"
                  onClick={handlePlayClick}
                  mt={2}
                >
                  Play
                </Button>
              </Flex>
            </Box>
          </Box>
          <Grid
            templateColumns={{ base: "1", md: "repeat(3, 1fr)" }}
            gap={5}
            p={5}
          >
            <GridItem colSpan={2}>
              <Box>
                <Text
                  color="white"
                  textAlign="justify"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {video.description}
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                {playlists.length > 0 ? (
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                    Playlist :{" "}
                    {playlists
                      .map((playlist, index) => (
                        <Link
                          key={playlist.id}
                          color="white"
                          onClick={() => handlePlaylistClick(playlist)}
                        >
                          {playlist.name || "Untitled Playlist"}
                        </Link>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr])}
                  </Text>
                ) : (
                  <Text color="gray.500"></Text>
                )}
              </Box>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={Boolean(selectedPlaylist)}
          onClose={() => setSelectedPlaylist(null)}
          playlist={selectedPlaylist}
        />
      )}
    </>
  );
};

export default VideoModal;
