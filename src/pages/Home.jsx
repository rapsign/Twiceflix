"use client";

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/Hero/HeroSection";
import PlaylistSwiper from "../components/Playlist/PlaylistSwiper";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoSwiper from "../components/Videos/VideoSwiper";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>
          TWICEFLIX — Your Ultimate Source for TWICE Videos & Content
        </title>
        <meta
          name="description"
          content="Everything TWICE in one place — music videos, live performances, and behind-the-scenes content. Watch TWICE videos, shorts, and playlists on TWICEFLIX."
        />
        <meta
          name="keywords"
          content="TWICE, TWICEFLIX, K-pop, music videos, performances, Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="TWICEFLIX — Your Ultimate Source for TWICE Videos & Content"
        />
        <meta
          property="og:description"
          content="Everything TWICE in one place — music videos, live performances, and behind-the-scenes content."
        />
        <meta
          property="og:image"
          content="https://twiceflix.vercel.app/og.webp"
        />
        <meta property="og:url" content="https://twiceflix.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="TWICEFLIX — Your Ultimate Source for TWICE Videos & Content"
        />
        <meta
          name="twitter:description"
          content="Everything TWICE in one place — music videos, live performances, and behind-the-scenes content."
        />
        <meta
          name="twitter:image"
          content="https://twiceflix.vercel.app/og.webp"
        />
      </Helmet>

      <div className="relative">
        <HeroSection />
        <div className="-mt-24 md:-mt-48 px-0 md:px-4 relative z-10">
          <VideoSwiper />
          <PlaylistSwiper />
        </div>
      </div>
    </>
  );
};

export default Home;
