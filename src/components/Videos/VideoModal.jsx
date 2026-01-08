"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import PlaylistModal from "../Playlist/PlaylistModal";
import useDataManager from "@/hooks/useDataManager";

const VideoModal = ({ isOpen, onClose, video }) => {
  const navigate = useNavigate();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { data: playlists = [], loading } = useDataManager("playlists");

  // 🔥 Filter playlist berdasarkan field video.playlists
  const videoPlaylists = useMemo(() => {
    if (!video?.playlists || playlists.length === 0) return [];
    return playlists.filter((p) => video.playlists.includes(p.id));
  }, [playlists, video]);

  const handlePlayClick = () => {
    if (video?.youtube_url) {
      navigate("/video-player", {
        state: { youtubeUrl: video.youtube_url },
      });
    }
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  if (!video) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-3xl lg:max-w-4xl bg-neutral-900 text-white p-0 overflow-hidden">
          {/* CLOSE BUTTON */}
          <DialogClose className="absolute right-4 top-4 text-white z-50" />

          {/* THUMBNAIL */}
          <div className="relative aspect-video overflow-visible">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover "
            />

            {/* GRADIENT */}
            <div className="absolute -bottom-1  inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />

            {/* TITLE & PLAY */}
            <div className="absolute bottom-4 left-4 right-4 ">
              <h2 className="text-lg md:text-2xl font-bold line-clamp-2">
                {video.title}
              </h2>

              <Button
                onClick={handlePlayClick}
                className="mt-3 bg-white text-black hover:bg-gray-200 cursor-pointer"
                size="sm"
              >
                <Play className="w-4 h-4" />
                Play
              </Button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-4">
            {/* DESCRIPTION */}
            <p className="text-sm text-neutral-300 leading-relaxed">
              {video.description || "No description available."}
            </p>

            {/* PLAYLISTS */}
            <div>
              {loading ? (
                <p className="text-xs text-neutral-500">Loading playlists...</p>
              ) : videoPlaylists.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {videoPlaylists.map((playlist) => (
                    <Badge
                      key={playlist.id}
                      className="cursor-pointer bg-neutral-700 hover:bg-neutral-600"
                      onClick={() => handlePlaylistClick(playlist)}
                    >
                      {playlist.title || "Untitled Playlist"}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">
                  This video is not in any playlist
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PLAYLIST MODAL */}
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={Boolean(selectedPlaylist)}
          onClose={() => setSelectedPlaylist(null)}
          playlist={selectedPlaylist}
        />
      )}
    </>
  );
};

export default VideoModal;
