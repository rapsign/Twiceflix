import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <VideoList />
      <VideoPlayer />
    </>
  );
}

export default App;
