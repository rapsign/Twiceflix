import {
  Box,
  Heading,
  Grid,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoModal from "../components/VideoModal";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Videos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchVideos = () => {
      const videosQuery = query(collection(db, "videos"));
      const unsubscribe = onSnapshot(
        videosQuery,
        (querySnapshot) => {
          const videosData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVideos(videosData);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching videos:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    onOpen();
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
        {videos.map((video) => (
          <Box
            key={video.id}
            borderRadius="md"
            overflow="hidden"
            position="relative"
            rounded="none"
            aspectRatio="16/9"
            cursor="pointer"
            onClick={() => handleVideoClick(video)}
            _hover={{
              "& .overlay": {
                opacity: 1,
                visibility: "visible",
              },
            }}
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
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
                {video.title}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
      {selectedVideo && (
        <VideoModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
      )}
    </Box>
  );
};

export default Videos;
