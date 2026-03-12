"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import CustomSwiper from "@/components/CustomSwiper";
import useDataManager from "@/hooks/useDataManager";

const PlaylistSwiper = () => {
  const { data: playlists = [], loading: playlistsLoading } =
    useDataManager("youtube-playlist");

  const [playlistsWithVideos, setPlaylistsWithVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const loadMoreRef = useRef(null);

  /* ===============================
     Fetch videos per playlist (by ID)
     Hanya fetch 3 playlist pertama dulu,
     sisanya lazy saat scroll
  ================================ */
  const { fetchPlaylist } = useDataManager("youtube-playlist");

  useEffect(() => {
    if (!playlists.length) return;

    const filtered = playlists.filter((p) => p.count >= 8);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const initialBatch = shuffled.slice(0, 3);

    Promise.all(initialBatch.map((p) => fetchPlaylist(p.id))).then(
      (results) => {
        const withVideos = results
          .filter((r) => r?.videos?.length >= 8)
          .map((r) => ({ ...r, _shuffled: shuffled }));
        setPlaylistsWithVideos(withVideos);
        setVideosLoading(false);
        setRemainingPlaylists(shuffled.slice(3));
      },
    );
  }, [playlists]);

  const [remainingPlaylists, setRemainingPlaylists] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  /* ===============================
     Lazy load playlist berikutnya saat scroll
  ================================ */
  const loadMore = useCallback(async () => {
    if (loadingMore || remainingPlaylists.length === 0) return;
    setLoadingMore(true);

    const nextBatch = remainingPlaylists.slice(0, 3);
    const results = await Promise.all(
      nextBatch.map((p) => fetchPlaylist(p.id)),
    );

    const withVideos = results.filter((r) => r?.videos?.length >= 8);
    setPlaylistsWithVideos((prev) => [...prev, ...withVideos]);
    setRemainingPlaylists((prev) => prev.slice(3));
    setLoadingMore(false);
  }, [loadingMore, remainingPlaylists, fetchPlaylist]);

  /* ===============================
     IntersectionObserver untuk lazy load
  ================================ */
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || remainingPlaylists.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore, remainingPlaylists.length]);

  /* ===============================
     RENDER
  ================================ */
  if (playlistsLoading || videosLoading) {
    return (
      <div className="w-full py-2 text-white">
        {[...Array(3)].map((_, swiperIndex) => (
          <div key={swiperIndex} className="mb-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="h-7 w-36 md:w-52 bg-neutral-800 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`space-y-2 ${i === 1 ? "hidden md:block" : ""} ${i === 2 ? "hidden lg:block" : ""}`}
                >
                  <div className="aspect-video bg-neutral-800 md:rounded-lg rounded-none animate-pulse" />
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

  if (playlistsWithVideos.length === 0) return null;

  return (
    <div className="w-full py-2 text-white">
      {playlistsWithVideos.map((playlist) => (
        <div key={playlist.id} className="mb-6">
          <CustomSwiper
            items={playlist.videos}
            title={playlist.title}
            playlistId={playlist.id}
          />
        </div>
      ))}

      {remainingPlaylists.length > 0 && (
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            Loading more playlists...
          </div>
        </div>
      )}

      {remainingPlaylists.length === 0 && playlistsWithVideos.length > 3 && (
        <div className="w-full py-8 text-center text-neutral-600 text-sm">
          You've reached the end
        </div>
      )}
    </div>
  );
};

export default PlaylistSwiper;
