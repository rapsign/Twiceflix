"use client";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function PlaylistCard({ playlist }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!playlist?.videos?.length) return;

    const firstVideo = playlist.videos[0];

    navigate(`/watch/${firstVideo.id}`, {
      state: {
        playlistId: playlist.id,
      },
    });
  };

  return (
    <div
      className="w-full cursor-pointer select-none rounded-xl p-2 transition-colors duration-200 hover:bg-neutral-700"
      onClick={handleClick}
    >
      <div className="relative aspect-video w-full mt-2">
        <div className="absolute -top-2 left-2 right-2 h-full rounded-xl bg-gray-500 z-0" />
        <div className="absolute -top-1 left-1 right-1 h-full rounded-xl bg-neutral-800/60 z-0" />
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 text-sm px-2 py-0.5 bg-red-500">
            Playlist
          </Badge>
          {playlist.count && (
            <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-black/80 text-white rounded">
              {playlist.count} videos
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 min-h-12">
        <p
          className="text-sm font-medium leading-snug line-clamp-2"
          title={playlist.title}
        >
          {playlist.title}
        </p>
      </div>
    </div>
  );
}
