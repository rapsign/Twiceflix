"use client";

// src/app/(main)/HomeClient.jsx
import HeroSection from "./HeroSection";
import PlaylistSwiper from "./PlaylistSwiper";
import VideoSwiper from "./VideoSwiper";

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
