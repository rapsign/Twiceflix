import { Box, Image, Text, Badge } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import PlaylistModal from "./PlaylistModal";

const Playlist = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            orderBy("published_at", "desc"),
            limit(1)
          );
          const videoSnapshot = await getDocs(videoQuery);

          const latestVideo =
            videoSnapshot.docs.length > 0 ? videoSnapshot.docs[0].data() : null;

          return {
            id: playlistId,
            ...playlist,
            thumbnail: latestVideo
              ? latestVideo.thumbnail
              : "https://via.placeholder.com/720x1280",
          };
        })
      );
      setPlaylists(playlistData);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const openModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist.id}>
            <Box
              overflow="hidden"
              _hover={{ bg: "gray.800", cursor: "pointer" }}
              transition="background-color 0.3s ease"
              border="1px solid rgba(255, 255, 255, 0.1)"
              position="relative"
              aspectRatio="16/9"
              transform="translateY(-10px)"
              onClick={() => openModal(playlist)}
            >
              <Badge
                position="absolute"
                top={2}
                left={0}
                backgroundColor="red"
                color="white"
                paddingX={{ base: 2, md: 3 }}
                paddingY={{ base: 0, md: 1 }}
                fontSize={{ base: "0.5em", md: "0.7em" }}
                size="sm"
                fontWeight="bold"
              >
                Playlist
              </Badge>
              <Image
                src={playlist.thumbnail}
                alt={playlist.name}
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
                {playlist.name}
              </Text>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
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
