"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import PlaylistGrid from "@/app/(main)/playlists/_components/PlaylistGrid";
import useDataManager from "@/hooks/useDataManager";
import { Loader2 } from "lucide-react";

const PLAYLISTS_PER_PAGE = 30;

const PlaylistSkeleton = () => (
  <div className="w-full rounded-xl p-2 pt-6">
    <div className="relative aspect-video w-full">
      <div className="absolute -top-2 left-2 right-2 h-full rounded-xl bg-neutral-700 z-0" />
      <div className="absolute -top-1 left-1 right-1 h-full rounded-xl bg-neutral-800 z-0" />
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-800 animate-pulse" />
    </div>
    <div className="px-2 mt-2 space-y-2">
      <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
      <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
    </div>
  </div>
);

export default function PlaylistsClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: playlists = [],
    loading: playlistsLoading,
    fetchPlaylist,
  } = useDataManager("youtube-playlist");

  const displayedPlaylists = useMemo(
    () => playlists.slice(0, currentPage * PLAYLISTS_PER_PAGE),
    [playlists, currentPage],
  );

  const hasMore = displayedPlaylists.length < playlists.length;

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (
      distanceToBottom < 500 &&
      hasMore &&
      !playlistsLoading &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => setIsLoadingMore(false), 300);
    }
  }, [hasMore, playlistsLoading, isLoadingMore]);

  useEffect(() => {
    let timeoutId = null;
    let lastExecuted = 0;
    const THROTTLE_DELAY = 300;

    const throttledScroll = () => {
      const now = Date.now();
      if (timeoutId) clearTimeout(timeoutId);
      if (now - lastExecuted < THROTTLE_DELAY) {
        timeoutId = setTimeout(() => {
          lastExecuted = Date.now();
          handleScroll();
        }, THROTTLE_DELAY);
      } else {
        lastExecuted = now;
        handleScroll();
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  useEffect(() => {
    return () => setCurrentPage(1);
  }, []);

  if (playlistsLoading && playlists.length === 0) {
    return (
      <div className="lg:pt-12 bg-black min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-2">
          {[...Array(30)].map((_, i) => (
            <PlaylistSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!playlistsLoading && playlists.length === 0) {
    return (
      <div className="px-4 pt-4 min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 text-xl">No playlists available</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen lg:pt-12">
      <PlaylistGrid
        playlists={displayedPlaylists}
        fetchPlaylist={fetchPlaylist}
      />

      {isLoadingMore && hasMore && (
        <div className="w-full py-8 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        </div>
      )}

      {!hasMore && playlists.length > 0 && (
        <div className="w-full py-12 text-center bg-black">
          <p className="text-neutral-600 text-sm">
            You&#39;ve reached the end • {playlists.length} playlists
          </p>
        </div>
      )}
    </div>
  );
}
