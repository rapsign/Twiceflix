"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import useDataManager from "../../hooks/useDataManager";

const PLAYLISTS_PER_PAGE = 30;

const Playlist = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: playlists = [], loading: playlistsLoading } =
    useDataManager("youtube_playlist");

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

    if (distanceToBottom < 500 && hasMore && !playlistsLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, playlistsLoading]);

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

  const metaData = useMemo(
    () => ({
      title: `Playlists - TWICEFLIX`,
      description: `Explore ${playlists.length} curated TWICE playlists.`,
    }),
    [playlists.length],
  );

  if (playlistsLoading && playlists.length === 0) {
    return (
      <>
        <Helmet>
          <title>Loading Playlists - TWICEFLIX</title>
        </Helmet>
        <div className="pt-0 md:pt-18 bg-black min-h-screen px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2 ">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-neutral-800 rounded-lg animate-pulse" />
                <div className="h-5 w-2/3 bg-neutral-800 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!playlistsLoading && playlists.length === 0) {
    return (
      <div className="px-4 pt-4 md:pt-18 min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 text-xl">No playlists available</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
      </Helmet>

      <div className="pt-0 md:pt-18 bg-black min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2">
          {displayedPlaylists.map((playlist, index) => (
            <PlaylistCard key={`${playlist.id}-${index}`} id={playlist.id} />
          ))}
        </div>

        {!hasMore && playlists.length > 0 && (
          <div className="w-full py-12 text-center bg-black">
            <p className="text-neutral-600 text-sm">
              You&#39;ve reached the end • {playlists.length} playlists
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Playlist;
