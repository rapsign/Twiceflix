import { Box, Image, Text, useDisclosure, Spinner } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";
import moment from "moment";
import VideoModal from "./VideoModal";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const videosQuery = query(collection(db, "videos"), limit(20));
      const querySnapshot = await getDocs(videosQuery);
      const videoData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      videoData.sort(
        (a, b) => moment(b.published_at).unix() - moment(a.published_at).unix()
      );
      setVideos(videoData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  return (
    <Box bg="transparent" color="white" py={2} width="100%" zIndex={100}>
      <Text
        fontSize={{ base: "md", md: "2xl" }}
        fontWeight="bold"
        mb={2}
        px={2}
      >
        TWICE Videos
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
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <Box
                overflow="hidden"
                _hover={{ bg: "gray.800" }}
                transition="background-color 0.3s ease"
                position="relative"
                aspectRatio="16/9"
                transform="translateY(-10px)"
                onClick={() => handleVideoClick(video)}
                cursor="pointer"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
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
                    fontSize="sm"
                    textAlign="center"
                    textOverflow="ellipsis"
                  >
                    {video.title}
                  </Text>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {selectedVideo && (
        <VideoModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
      )}
    </Box>
  );
};

export default VideoList;
