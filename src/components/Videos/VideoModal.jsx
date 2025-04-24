import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Badge,
  Button,
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "../Playlist/PlaylistModal";
import usePlaylistsByVideo from "../../hooks/usePlaylistsByVideo";

const VideoModal = ({ isOpen, onClose, video }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const navigate = useNavigate();

  const { playlists, loading } = usePlaylistsByVideo(video);

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
          bg="#0f0f0f"
          position="relative"
          maxWidth={{ base: "auto", md: "800px" }}
          margin="auto"
        >
          <ModalCloseButton zIndex={100} size="xl" />
          <Box
            position="relative"
            overflow="hidden"
            aspectRatio="16/9"
            borderTopRadius="10px"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              objectFit="cover"
              rounded="none"
            />
            <Box
              position="absolute"
              bottom="-10"
              left="0"
              right="0"
              p="0"
              height="110%"
              background="linear-gradient(180deg, rgba(15, 15, 15, 0) 9%, rgba(15, 15, 15, 0.74) 53%, rgba(15, 15, 15, 1) 83%)"
            />
            <Box
              position="absolute"
              top={{ base: "60%", md: "70%" }}
              px={5}
              color="white"
            >
              <Heading
                size={{ base: "sm", md: "md", lg: "lg" }}
                fontWeight="bold"
              >
                {video.title}
              </Heading>
              <Flex align="center">
                <Button
                  bgColor="white"
                  color="black"
                  size={{ base: "xs", md: "md", lg: "lg" }}
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
            templateColumns={{ base: "1", md: "repeat(2, 1fr)" }}
            gap={5}
            p={5}
          >
            <GridItem colSpan={2}>
              <Box>
                <Text
                  color="white"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {video.description}
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box>
                {loading ? (
                  <Text color="gray.500">Loading playlists...</Text>
                ) : playlists.length > 0 ? (
                  <Flex wrap="wrap" gap={2}>
                    {playlists.map((playlist) => (
                      <Badge
                        key={playlist.id}
                        variant="subtle"
                        px={3}
                        py={1}
                        backgroundColor={"#40403a"}
                        color={"white"}
                        borderRadius="md"
                        fontSize={{ base: "10px", md: "xs" }}
                        fontWeight="normal"
                        cursor="pointer"
                        onClick={() => handlePlaylistClick(playlist)}
                        _hover={{ bg: "gray" }}
                      >
                        {playlist.title || "Untitled Playlist"}
                      </Badge>
                    ))}
                  </Flex>
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
