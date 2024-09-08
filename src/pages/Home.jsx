import HeroSection from "../components/HeroSection";
import VideoList from "../components/VideoList";
import Playlist from "../components/Playlist";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import PlaylistSwiper from "../components/PlaylistSwiper";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Box position="relative">
        <HeroSection />
        <Box
          position="absolute"
          top="80%"
          left="0"
          width="100%"
          zIndex="1"
          p={4}
          bg="transparent"
        >
          <VideoList />
          <Playlist />
          <PlaylistSwiper />
        </Box>
      </Box>
    </>
  );
};

export default Home;
