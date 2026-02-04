"use client";

import { useState, useRef, useEffect } from "react";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import useDataManager from "@/hooks/useDataManager";
import LoadingSpinner from "@/components/LoadingSpinner";

const Playlist = () => {
  const {
    data: playlists = [],
    loading,
    error,
  } = useDataManager("youtube_playlist");
  const [visibleCount, setVisibleCount] = useState(30);
  const bottomRef = useRef(null);

  // Intersection Observer - trigger pas mentok bawah
  useEffect(() => {
    const currentRef = bottomRef.current;
    if (!currentRef || !playlists || visibleCount >= playlists.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 30, playlists.length));
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, playlists]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="px-4 pt-4 md:pt-18 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">Failed to load playlists</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="px-4 pt-4 md:pt-18 min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">No playlists available</p>
      </div>
    );
  }

  const visiblePlaylists = playlists.slice(0, visibleCount);

  return (
    <div className="px-4 pt-4 md:pt-18 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
        {visiblePlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Trigger di paling bawah */}
      {visibleCount < playlists.length && (
        <div ref={bottomRef} className="w-full py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Playlist;
