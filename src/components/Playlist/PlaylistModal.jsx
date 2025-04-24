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
import { useNavigate } from "react-router-dom";
import usePlaylistEpisodes from "../../hooks/usePlaylistEpisodes";

const PlaylistModal = ({ isOpen, onClose, playlist }) => {
  const { episodes, selectedVideo, setSelectedVideo } = usePlaylistEpisodes(
    isOpen,
    playlist
  );
  const navigate = useNavigate();

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
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "lg", md: "xl" }}>
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
          width="100%"
          aspectRatio="16/9"
          overflow="hidden"
          borderTopRadius="xl"
        >
          <Image
            src={selectedVideo ? selectedVideo.thumbnail : playlist.thumbnail}
            alt={selectedVideo ? selectedVideo.title : playlist.title}
            objectFit="cover"
            rounded="none"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="50%"
            background="linear-gradient(180deg, rgba(15, 15, 15, 0) 9%, rgba(15, 15, 15, 0.74) 53%, rgba(15, 15, 15, 1) 83%)"
          />
          <Box
            position="absolute"
            top={{ base: "60%", md: "70%" }}
            px={5}
            color="white"
          >
            <Heading
              size={{ base: "md", md: "md", lg: "lg" }}
              fontWeight="bold"
            >
              {selectedVideo ? selectedVideo.title : playlist.title}
            </Heading>
            <Button
              bgColor="white"
              color="black"
              size={{ base: "xs", md: "md", lg: "lg" }}
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
          borderRadius="xl"
          background="linear-gradient(180deg, rgba(15, 15, 15, 0) 9%, rgba(15, 15, 15, 0.74) 53%, rgba(15, 15, 15, 1) 83%)"
        >
          <Heading size={{ base: "sm", md: "lg" }} mb={2} fontWeight="bold">
            {playlist.title}
          </Heading>
          <Text
            color="white"
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="normal"
          >
            {playlist.description}
          </Text>
          <Heading size={{ base: "sm", md: "sm" }} my={5} fontWeight="semibold">
            Videos
          </Heading>
          <Box
            maxHeight="300px"
            overflowY="auto"
            borderRadius="xl"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#4c4c4c",
                borderRadius: "10px",
              },
            }}
          >
            <List spacing={2}>
              {episodes.length > 0 ? (
                episodes.map((episode) => (
                  <ListItem
                    key={episode.id}
                    color="white"
                    width="99%"
                    p={1}
                    cursor="pointer"
                    borderRadius="xl"
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
                        borderRadius="xl"
                        objectFit="cover"
                        mr={4}
                        w={{ base: "100px", md: "130px" }}
                      />
                      <Box>
                        <Text
                          fontWeight="semibold"
                          mb={1}
                          isTruncated={{ base: "false", md: "true" }}
                          fontSize={{ base: "xs", md: "sm" }}
                          w={{ base: "200px", md: "auto" }}
                          sx={{
                            display: {
                              base: "-webkit-box",
                              md: "block",
                            },
                            WebkitLineClamp: {
                              base: "4",
                              md: "unset",
                            },
                            WebkitBoxOrient: {
                              base: "vertical",
                              md: "unset",
                            },
                            overflow: {
                              base: "hidden",
                              md: "visible",
                            },
                            textOverflow: {
                              base: "ellipsis",
                              md: "unset",
                            },
                          }}
                        >
                          {episode.title}
                        </Text>
                        <Text
                          w={{ base: "auto", md: "auto" }}
                          textOverflow="ellipsis"
                          overflow="hidden"
                          display={{ base: "none", md: "block" }}
                          height={"3em"}
                          fontSize={"sm"}
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
