"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import VideoCard from "@/components/Videos/VideoCard";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import useDataManager from "@/hooks/useDataManager";

export default function SearchPage() {
  const location = useLocation();
  const [queryTerm, setQueryTerm] = useState("");

  const { data: videos = [], loading: loadingVideos } =
    useDataManager("videos");
  const { data: playlists = [], loading: loadingPlaylists } =
    useDataManager("playlists");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    setQueryTerm(q.trim().toLowerCase());
  }, [location.search]);

  const results = useMemo(() => {
    if (!queryTerm) return [];

    const filter = (data, type) =>
      data
        .filter((item) => (item.title ?? "").toLowerCase().includes(queryTerm))
        .map((item) => ({ ...item, type }));

    return [...filter(videos, "video"), ...filter(playlists, "playlist")];
  }, [queryTerm, videos, playlists]);

  const openItem = useCallback((item) => {
    // handler click
  }, []);

  if (loadingVideos || loadingPlaylists) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{queryTerm ? `Search: ${queryTerm}` : "Search"}</title>
      </Helmet>

      <div className="p-0 md:p-4">
        <h1 className="text-base md:text-xl font-semibold text-white mb-3 md:pt-16 px-2">
          {queryTerm ? `Search Results for: "${queryTerm}"` : "Search Results"}
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-2">
            {results.map((item) =>
              item.type === "video" ? (
                <VideoCard
                  key={`video-${item.id}`}
                  video={item}
                  onClick={openItem}
                />
              ) : (
                <PlaylistCard
                  key={`playlist-${item.id}`}
                  playlist={item}
                  onClick={openItem}
                />
              ),
            )}
          </div>
        ) : (
          <p className="text-white mt-4">No results found.</p>
        )}
      </div>
    </>
  );
}
