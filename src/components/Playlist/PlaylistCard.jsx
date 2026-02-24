"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ListVideo } from "lucide-react";
import useDataManager from "../../../hooks/useDataManager";

export default function PlaylistCard({ id }) {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [clicking, setClicking] = useState(false);

  const { fetchById, fetchPlaylist } = useDataManager("youtube_playlist");

  // Fetch data playlist dari cache atau API
  useEffect(() => {
    if (!id) return;
    fetchById(id).then((data) => {
      if (data) setPlaylist(data);
    });
  }, [id]);

  const handleClick = async () => {
    if (clicking || !playlist) return;

    try {
      setClicking(true);

      // fetchPlaylist sudah include videos[]
      const full = await fetchPlaylist(id);
      const firstVideoId = full?.videos?.[0]?.id;

      if (!firstVideoId) return;

      navigate(`/watch/${firstVideoId}`, {
        state: { playlistId: id },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setClicking(false);
    }
  };

  // Skeleton saat data belum ada
  if (!playlist) {
    return (
      <div className="w-full rounded-xl p-2 space-y-3">
        <div className="aspect-video w-full bg-neutral-800 rounded-xl animate-pulse " />
        <div className="h-5 w-2/3 bg-neutral-800 rounded animate-pulse" />
        <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="w-full select-none rounded-xl p-2 pt-6 cursor-pointer hover:bg-neutral-700 transition-colors"
      onClick={handleClick}
    >
      <div className="relative aspect-video w-full ">
        <div className="absolute -top-2 left-2 right-2 h-full rounded-xl bg-gray-500 z-0" />
        <div className="absolute -top-1 left-1 right-1 h-full rounded-xl bg-neutral-800/60 z-0" />

        <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <Badge className="absolute top-2 right-2 text-sm px-2 py-0.5 bg-red-500">
            Playlist
          </Badge>

          <span className="absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 bg-black/80 text-white rounded">
            <ListVideo className="w-4 h-4" />
            {playlist.count ?? 0} videos
          </span>
        </div>
      </div>

      <div className="px-2 mt-2 min-h-10 md:min-h-12">
        <p className="text-sm font-medium line-clamp-2">{playlist.title}</p>
        <p className="text-xs text-muted-foreground">Watch playlist</p>
      </div>
    </div>
  );
}
