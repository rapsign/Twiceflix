"use client";

import { useState } from "react";
import useDataManager from "../../hooks/useDataManager";
import CustomSwiper from "../CustomSwiper";
import VideoModal from "./VideoModal";
import LoadingSpinner from "../LoadingSpinner";

const VideoSwiper = () => {
  const { data: videos, loading } = useDataManager("videos");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-transparent text-white py-2 w-full z-50">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <CustomSwiper
          items={videos}
          title="TWICE Videos"
          onItemClick={handleVideoClick}
        />
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={isOpen}
          onClose={handleClose}
          video={selectedVideo}
        />
      )}
    </div>
  );
};

export default VideoSwiper;
