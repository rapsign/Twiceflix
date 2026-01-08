"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const PlaylistModal = ({ isOpen, onClose, playlist }) => {
  const navigate = useNavigate();
  const episodes = playlist?.videos || [];
  const latestVideo = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    const sorted = [...episodes].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
    return sorted[0];
  }, [episodes]);

  const [selectedVideo, setSelectedVideo] = useState(latestVideo);

  useEffect(() => {
    setSelectedVideo(latestVideo);
  }, [latestVideo]);

  const handlePlayClick = () => {
    if (selectedVideo) {
      navigate("/video-player", {
        state: { youtubeUrl: selectedVideo.youtube_url },
      });
    }
  };

  const handleEpisodeClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 text-white w-full max-w-3xl lg:max-w-4xl p-0 overflow-hidden rounded-lg">
        {/* HEADER / THUMBNAIL */}
        <div className="relative aspect-video overflow-visible">
          <img
            src={selectedVideo ? selectedVideo.thumbnail : playlist?.thumbnail}
            alt={selectedVideo ? selectedVideo.title : playlist?.title}
            className="w-full h-full object-cover"
          />

          {/* GRADIENT */}
          <div className="absolute -bottom-1  inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />

          {/* TITLE & PLAY */}
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="text-base sm:text-xl font-bold line-clamp-2">
              {selectedVideo ? selectedVideo.title : playlist?.title}
            </h2>

            <Button
              size="sm"
              className="mt-2 bg-white text-black hover:bg-gray-200 cursor-pointer"
              onClick={handlePlayClick}
            >
              <Play className="w-4 h-4 mr-1" />
              Play
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative bg-neutral-900">
          {/* FADE ATAS (ANTI GARIS) */}
          <div className="p-4 space-y-4">
            <h3 className="text-base font-semibold">{playlist?.title}</h3>

            {playlist?.description && (
              <p className="text-sm text-neutral-300">{playlist.description}</p>
            )}

            <h4 className="text-sm font-medium">Videos</h4>

            <ScrollArea className="h-60 w-full overflow-x-hidden">
              <div className="space-y-2 pr-2 w-full">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    onClick={() => handleEpisodeClick(episode)}
                    className={`w-full flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors
                      ${
                        selectedVideo?.id === episode.id
                          ? "bg-neutral-700"
                          : "hover:bg-neutral-800"
                      }
                    `}
                  >
                    {/* THUMBNAIL */}
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-16 h-9 sm:w-32 sm:h-18 object-cover rounded-md shrink-0"
                    />

                    {/* TEXT (INI KUNCI UTAMA) */}
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold ">
                        {episode.title}
                      </p>

                      <p className="hidden sm:block text-[11px] sm:text-xs text-neutral-400 line-clamp-2 break-words">
                        {episode.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
