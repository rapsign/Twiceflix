"use client";

import { useState } from "react";
import VideoModal from "../components/Videos/VideoModal";
import VideoGrid from "../components/Videos/VideoGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import useDataManager from "../hooks/useDataManager";

export default function Videos() {
  const { data: videos, loading } = useDataManager("videos");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleVideoClick = (videos) => {
    setSelectedVideo(videos);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setIsOpen(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="mb-3 text-xl md:text-3xl font-bold text-white pt-16">
        TWICE Videos
      </h1>

      <VideoGrid videos={videos} onVideoClick={handleVideoClick} />

      {selectedVideo && (
        <VideoModal
          isOpen={isOpen}
          onClose={handleClose}
          video={selectedVideo}
        />
      )}
    </div>
  );
}
