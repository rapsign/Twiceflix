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
      <DialogContent className="bg-neutral-900 text-white w-full min-w-3xl p-0 sm:rounded-lg overflow-hidden">
        {/* Header dengan gambar dan play button */}
        <div className="relative w-full h-full aspect-video">
          <img
            src={selectedVideo ? selectedVideo.thumbnail : playlist?.thumbnail}
            alt={selectedVideo ? selectedVideo.title : playlist?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
              {selectedVideo ? selectedVideo.title : playlist?.title}
            </h2>
            <Button
              variant="default"
              size="sm"
              className="mt-3 bg-white text-black hover:bg-gray-200 cursor-pointer"
              onClick={handlePlayClick}
            >
              <Play /> Play
            </Button>
          </div>
        </div>

        {/* Konten list video */}
        <div className="p-4 bg-neutral-900">
          <h3 className="text-lg font-semibold mb-2">{playlist?.title}</h3>
          {playlist?.description && (
            <p className="text-sm text-gray-300 mb-4">{playlist.description}</p>
          )}
          <h4 className="text-md font-medium mb-2">Videos</h4>

          <ScrollArea className="h-72">
            <div className="space-y-2   ">
              {episodes.length > 0 ? (
                episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className={`flex gap-3 items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedVideo?.id === episode.id
                        ? "bg-neutral-700"
                        : "hover:bg-neutral-800"
                    }`}
                    onClick={() => handleEpisodeClick(episode)}
                  >
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-28 h-16 object-cover rounded-md shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{episode.title}</p>
                      <p className="text-sm text-gray-400 line-clamp-2 max-w-140">
                        {episode.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No videos available.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
