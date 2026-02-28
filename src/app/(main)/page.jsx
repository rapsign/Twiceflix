"use client";

import { useState, useEffect } from "react";
import HeroSection from "../../components/Hero/HeroSection";
import PlaylistSwiper from "../../components/Playlist/PlaylistSwiper";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import VideoSwiper from "../../components/Videos/VideoSwiper";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <HeroSection />
      <div className="-mt-24 md:-mt-48 px-0 md:px-4 relative z-10">
        <VideoSwiper />
        <PlaylistSwiper />
      </div>
    </div>
  );
};

export default Home;
