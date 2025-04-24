import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import HeroSection from "../components/Hero/HeroSection";
import VideoList from "../components/Videos/VideoSwiper";
import Playlist from "../components/Playlist/Playlist";
import PlaylistSwiper from "../components/Playlist/PlaylistSwiper";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="TWICEFLIX is your ultimate source for everything TWICE! Watch their latest music videos, performances, and behind-the-scenes content."
        />
        <meta
          name="keywords"
          content="TWICE, TWICEFLIX, K-pop, music, performances, videos, TWICE members"
        />
        <meta name="author" content="RapSign" />
      </Helmet>
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
