"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/Hero/HeroSection";
import VideoList from "../components/Videos/VideoSwiper";
import Playlist from "../components/Playlist/Playlist";
import PlaylistSwiper from "../components/Playlist/PlaylistSwiper";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet";
import VideoSwiper from "../components/Videos/VideoSwiper";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Konten video dan playlist */}
        <div className="absolute top-[80%] left-0 w-full z-10 p-4 bg-transparent">
          <VideoSwiper />
          <Playlist />
          <PlaylistSwiper />
        </div>
      </div>
    </>
  );
};

export default Home;
