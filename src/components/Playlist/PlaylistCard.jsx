"use client";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ListVideo } from "lucide-react";
import useDataManager from "@/hooks/useDataManager";

export default function PlaylistCard({ playlist }) {
  const navigate = useNavigate();
  const { data: videos = [] } = useDataManager("youtube_video");

  const handleClick = () => {
    const firstVideo = videos.find((v) => v.playlists?.includes(playlist.id));
    if (!firstVideo) return;

    navigate(`/watch/${firstVideo.id}`, { state: { playlistId: playlist.id } });
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
          {playlist.itemCount && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 bg-black/80 text-white rounded">
              <ListVideo className="w-4 h-4" />
              {playlist.itemCount} videos
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
        <p className="text-xs  leading-snug line-clamp-2 text-muted-foreground">
          View full playlist
        </p>
      </div>
    </div>
  );
}
