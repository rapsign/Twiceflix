"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import CustomSwiper from "../CustomSwiper";
import LoadingSpinner from "../LoadingSpinner";
import useDataManager from "@/hooks/useDataManager";

const PlaylistSwiper = () => {
  const { data: playlists, loading: loadingPlaylists } =
    useDataManager("youtube_playlist");
  const { data: videos, loading: loadingVideos } =
    useDataManager("youtube_video");
  const [visibleCount, setVisibleCount] = useState(3);
  const loadMoreRef = useRef(null);

  const loading = loadingPlaylists || loadingVideos;

  // Map videos ke setiap playlist
  const playlistsWithVideos = useMemo(() => {
    if (!playlists || !videos) return [];

    return playlists.map((playlist) => ({
      ...playlist,
      videos: videos.filter((video) => video.playlists?.includes(playlist.id)),
    }));
  }, [playlists, videos]);

  // Filter playlist dengan minimal 8 videos
  const filteredPlaylists = useMemo(() => {
    return playlistsWithVideos.filter(
      (playlist) => playlist.videos.length >= 8,
    );
  }, [playlistsWithVideos]);

  // Intersection Observer untuk lazy load
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || visibleCount >= filteredPlaylists.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + 3, filteredPlaylists.length),
          );
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Mulai load sebelum sampai ke bawah
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, filteredPlaylists.length]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!playlistsWithVideos || playlistsWithVideos.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-400">
        No playlists available
      </div>
    );
  }

  if (filteredPlaylists.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-400">
        No playlists with 8+ videos found
      </div>
    );
  }

  const visiblePlaylists = filteredPlaylists.slice(0, visibleCount);

  return (
    <div className="w-full py-2 text-white">
      {visiblePlaylists.map((playlist) => (
        <div key={playlist.id} className="mb-6">
          <CustomSwiper items={playlist.videos} title={playlist.title} />
        </div>
      ))}

      {visibleCount < filteredPlaylists.length && (
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default PlaylistSwiper;
