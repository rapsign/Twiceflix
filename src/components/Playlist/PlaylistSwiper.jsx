"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import CustomSwiper from "../CustomSwiper";
import useDataManager from "../../../hooks/useDataManager";

const PlaylistSwiper = () => {
  const { data: playlists = [], loading: playlistsLoading } =
    useDataManager("youtube_playlist");

  const { data: videos = [], loading: videosLoading } =
    useDataManager("youtube_video");

  const [visibleCount, setVisibleCount] = useState(3);
  const loadMoreRef = useRef(null);

  const playlistsWithVideos = useMemo(() => {
    if (playlists.length === 0 || videos.length === 0) return [];

    return playlists.map((playlist) => ({
      ...playlist,
      // Videos diurutkan paling lama duluan
      videos: videos
        .filter(
          (video) =>
            video.is_short === false &&
            Array.isArray(video.playlists) &&
            video.playlists.includes(playlist.id),
        )
        .sort((a, b) => {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateA - dateB;
        }),
    }));
  }, [playlists, videos]);

  const filteredPlaylists = useMemo(() => {
    return playlistsWithVideos.filter(
      (playlist) => playlist.videos.length >= 8,
    );
  }, [playlistsWithVideos]);

  // Shuffle playlist sekali saat data siap, tidak berubah selama di halaman
  const shuffledPlaylists = useMemo(() => {
    if (filteredPlaylists.length === 0) return [];
    return [...filteredPlaylists].sort(() => Math.random() - 0.5);
  }, [filteredPlaylists]);

  const visiblePlaylists = useMemo(() => {
    return shuffledPlaylists.slice(0, visibleCount);
  }, [shuffledPlaylists, visibleCount]);

  const handleIntersect = useCallback(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      if (visibleCount >= shuffledPlaylists.length) return;
      setVisibleCount((prev) => Math.min(prev + 3, shuffledPlaylists.length));
    },
    [visibleCount, shuffledPlaylists.length],
  );

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || visibleCount >= shuffledPlaylists.length) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      rootMargin: "200px",
    });

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleIntersect, visibleCount, shuffledPlaylists.length]);

  if (playlistsLoading || videosLoading) {
    return (
      <div className="w-full py-2 text-white">
        {[...Array(3)].map((_, swiperIndex) => (
          <div key={swiperIndex} className="mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="h-7 w-36 md:w-52 bg-neutral-800 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 md:gap-2 lg:gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`space-y-2 ${i === 1 ? "hidden sm:block" : ""} ${i === 2 ? "hidden md:block" : ""}`}
                >
                  <div className="aspect-video bg-neutral-800 lg:rounded-lg rounded-none animate-pulse" />
                  <div className="px-2 space-y-2">
                    <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-1/4 bg-neutral-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (shuffledPlaylists.length === 0) return null;

  return (
    <div className="w-full py-2 text-white">
      {visiblePlaylists.map((playlist) => (
        <div key={playlist.id} className="mb-6">
          <CustomSwiper
            items={playlist.videos}
            title={playlist.title}
            playlistId={playlist.id}
          />
        </div>
      ))}

      {visibleCount < shuffledPlaylists.length && (
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            Loading more playlists...
          </div>
        </div>
      )}

      {visibleCount >= shuffledPlaylists.length &&
        shuffledPlaylists.length > 3 && (
          <div className="w-full py-8 text-center text-neutral-600 text-sm">
            You've reached the end
          </div>
        )}
    </div>
  );
};

export default PlaylistSwiper;
