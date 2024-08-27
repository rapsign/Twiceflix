import HeroSection from "../components/HeroSection";
import VideoList from "../components/VideoList";
import Playlist from "../components/Playlist";
import LoadingSpinner from "../components/LoadingSpiner";
import { useState, useEffect } from "react";

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
      <HeroSection />
      <VideoList />
      <Playlist />
    </>
  );
};
export default Home;
