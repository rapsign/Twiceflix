import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
  List,
  ListItem,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const PlaylistModal = ({ isOpen, onClose, playlist }) => {
  const [episodes, setEpisodes] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && playlist) {
      const fetchEpisodes = async () => {
        try {
          const episodesQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlist.id),
            orderBy("published_at", "desc")
          );
          const episodeSnapshot = await getDocs(episodesQuery);
          const episodesData = episodeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEpisodes(episodesData);

          if (episodesData.length > 0) {
            setSelectedVideo(episodesData[0]);
          }
        } catch (error) {
          console.error("Error fetching episodes:", error);
        }
      };

      fetchEpisodes();
    }
  }, [isOpen, playlist]);

  const handlePlayClick = () => {
    if (selectedVideo) {
      navigate(`/video-player`, {
        state: { youtubeUrl: selectedVideo.youtube_url },
      });
    }
  };

  const handleEpisodeClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "lg", md: "full" }}>
      <ModalOverlay />
      <ModalContent
        bg="#333333"
        position="relative"
        borderRadius="none"
        maxWidth={{ base: "auto", md: "800px" }}
        margin="auto"
      >
        <ModalCloseButton zIndex={100} size="xl" />
        <Box position="relative" width="100%" height="400px" overflow="hidden">
          <Image
            src={selectedVideo ? selectedVideo.thumbnail : playlist.thumbnail}
            alt={selectedVideo ? selectedVideo.title : playlist.title}
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
          <Box position="absolute" top="60%" px={5} color="white">
            <Heading size="lg">
              {selectedVideo ? selectedVideo.title : playlist.title}
            </Heading>
            <Button
              bgColor="white"
              color="black"
              size={{ base: "sm", md: "md", lg: "lg" }}
              rounded="none"
              leftIcon={<FaPlay />}
              variant="solid"
              mt={2}
              onClick={handlePlayClick}
            >
              Play
            </Button>
          </Box>
        </Box>
        <Box
          p={5}
          background="linear-gradient(to bottom, rgba(51, 51, 51, 0) 0%, rgba(51, 51, 51, 0.8) 100%)"
        >
          <Heading size="md" mb={2}>
            {playlist.name}
          </Heading>
          <Text
            color="white"
            textAlign="justify"
            fontSize={{ base: "xs", md: "sm" }}
          >
            {playlist.description}
          </Text>
          <Heading size="md" my={5}>
            Videos
          </Heading>
          <Box
            maxHeight="600px"
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "&": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
            <List spacing={4}>
              {episodes.length > 0 ? (
                episodes.map((episode) => (
                  <ListItem
                    key={episode.id}
                    color="white"
                    mb={2}
                    px={4}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: "#6b6b6b" }}
                    bg={
                      selectedVideo?.id === episode.id
                        ? "#4f4d4d"
                        : "transparent"
                    }
                    onClick={() => handleEpisodeClick(episode)}
                  >
                    <Flex align="center">
                      <Image
                        src={episode.thumbnail}
                        alt={episode.title}
                        aspectRatio="16/9"
                        objectFit="cover"
                        mr={4}
                        w={{ base: "100px", md: "200px" }}
                      />
                      <Box>
                        <Text
                          fontWeight="bold"
                          mb={1}
                          isTruncated
                          textOverflow="ellipsis"
                          fontSize={{ base: "xs", md: "sm" }}
                          w={{ base: "200px", md: "500px" }}
                        >
                          {episode.title}
                        </Text>
                        <Text
                          w={{ base: "auto", md: "500px" }}
                          textAlign="justify"
                          textOverflow="ellipsis"
                          overflow="hidden"
                          height={{ base: "3em", md: "auto" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {episode.description}
                        </Text>
                      </Box>
                    </Flex>
                  </ListItem>
                ))
              ) : (
                <Box textAlign="center">
                  <Text color="white">No videos available.</Text>
                </Box>
              )}
            </List>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PlaylistModal;
