import LoadingSpinner from "../components/LoadingSpiner";
import { useState, useEffect } from "react";
import { Box, Heading, Grid, Image } from "@chakra-ui/react";
import VideoModal from "../components/VideoModal";

const playlistData = [
  {
    id: 1,
    title: "Video 1",
    imageUrl: "https://i.ytimg.com/vi/M2fDbYeYHtE/maxresdefault.jpg",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
  },
  { id: 2, title: "Video 2", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 3, title: "Video 3", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 4, title: "Video 4", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 5, title: "Video 5", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 6, title: "Video 6", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 7, title: "Video 7", imageUrl: "https://via.placeholder.com/720x1280" },
  { id: 8, title: "Video 8", imageUrl: "https://via.placeholder.com/720x1280" },
];

const Videos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box p={4}>
      <Heading mb={6} mt={20}>
        TWICE Videos
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
        gap={2}
      >
        {playlistData.map((item) => (
          <Box
            key={item.id}
            borderRadius="md"
            overflow="hidden"
            _hover={{ bg: "gray.800", cursor: "pointer" }}
            transition="background-color 0.3s ease"
            border="1px solid rgba(255, 255, 255, 0.1)"
            position="relative"
            rounded="none"
            aspectRatio="16/9"
            onClick={() => openModal(item)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        ))}
      </Grid>
      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          video={selectedVideo}
        />
      )}
    </Box>
  );
};

export default Videos;
