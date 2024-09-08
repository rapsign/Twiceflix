import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

import VideoModal from "./VideoModal";

const PlaylistSwiper = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = useCallback(async () => {
    try {
      const playlistSnapshot = await getDocs(collection(db, "playlists"));
      const playlistIds = playlistSnapshot.docs.map((doc) => doc.id);
      const playlistData = await Promise.all(
        playlistIds.map(async (playlistId) => {
          const playlist = playlistSnapshot.docs
            .find((doc) => doc.id === playlistId)
            .data();

          const videoQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlistId),
            orderBy("published_at", "desc")
          );
          const videoSnapshot = await getDocs(videoQuery);
          const videos = videoSnapshot.docs.map((doc) => doc.data());

          if (videos.length <= 7) return null;

          return {
            id: playlistId,
            ...playlist,
            videos,
          };
        })
      );

      setPlaylists(playlistData.filter((playlist) => playlist !== null));
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const openModal = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box bg="transparent" color="white" py={2} width="100%">
      {playlists.map((playlist) => (
        <Box key={playlist.id} mb={4}>
          <Text
            fontSize={{ base: "md", md: "2xl" }}
            fontWeight="bold"
            mb={2}
            px={2}
          >
            {playlist.name}
          </Text>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
              1440: {
                slidesPerView: 7,
              },
            }}
          >
            {playlist.videos.map((video, index) => (
              <SwiperSlide key={index}>
                <Box
                  overflow="hidden"
                  _hover={{ bg: "gray.800", cursor: "pointer" }}
                  transition="background-color 0.3s ease"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  position="relative"
                  aspectRatio="16/9"
                  transform="translateY(-10px)"
                  onClick={() => openModal(video)}
                >
                  <Image
                    src={
                      video.thumbnail || "https://via.placeholder.com/720x1280"
                    }
                    alt={video.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  width="100%"
                  bg="linear-gradient(to top right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6))"
                  p={2}
                  color="white"
                  opacity={0}
                  visibility="hidden"
                  transition="opacity 0.3s ease, visibility 0.3s ease"
                  _groupHover={{ opacity: 1, visibility: "visible" }}
                >
                  <Text
                    isTruncated
                    textAlign="center"
                    fontSize="sm"
                    textOverflow="ellipsis"
                  >
                    {video.title}
                  </Text>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ))}
      {selectedVideo && (
        <VideoModal
          isOpen={isOpen}
          onClose={onClose}
          video={selectedVideo} // Pass the selected video to the modal
        />
      )}
    </Box>
  );
};

export default PlaylistSwiper;
