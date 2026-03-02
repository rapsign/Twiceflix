"use client";

// src/app/(main)/HomeClient.jsx
import HeroSection from "../../components/Hero/HeroSection";
import PlaylistSwiper from "../../components/Playlist/PlaylistSwiper";
import VideoSwiper from "../../components/Videos/VideoSwiper";

export default function HomeClient() {
  return (
    <div className="relative">
      <HeroSection />
      <div className="-mt-24 md:-mt-48 px-0 md:px-4 relative z-10">
        <VideoSwiper />
        <PlaylistSwiper />
      </div>
    </div>
  );
}
