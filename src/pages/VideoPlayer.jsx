"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { Button } from "@/components/ui/button";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const youtubeUrl = location.state?.youtubeUrl || "#";

  // Ambil video ID dari YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|\/v\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-4 text-white text-2xl z-50 hover:bg-white/10"
        onClick={handleBack}
      >
        <BiArrowBack />
      </Button>

      {/* Video */}
      {embedUrl ? (
        <div className="w-full max-h-screen aspect-video">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="text-red-500">Invalid YouTube URL</div>
      )}
    </div>
  );
};

export default VideoPlayer;
