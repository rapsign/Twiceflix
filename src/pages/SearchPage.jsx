"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import VideoCard from "@/components/Videos/VideoCard";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import useDataManager from "@/hooks/useDataManager";
import { Helmet } from "react-helmet";
import { useDisclosure } from "@/hooks/useDisclosure";

export default function SearchPage() {
  const location = useLocation();
  const [queryTerm, setQueryTerm] = useState("");
  const [results, setResults] = useState([]);

  const { data: videos = [], loading: loadingVideos } =
    useDataManager("videos");
  const { data: playlists = [], loading: loadingPlaylists } =
    useDataManager("playlists");

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const {
    isOpen: isVideoModalOpen,
    onOpen: onVideoModalOpen,
    onClose: onVideoModalClose,
  } = useDisclosure();

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQueryTerm(q.trim().toLowerCase());
  }, [location.search]);

  useEffect(() => {
    if (!queryTerm) {
      setResults([]);
      return;
    }

    const filter = (data, type) =>
      data
        .filter((item) => (item.title || "").toLowerCase().includes(queryTerm))
        .map((item) => ({ ...item, type }));

    setResults([...filter(videos, "video"), ...filter(playlists, "playlist")]);
  }, [queryTerm, videos, playlists]);

  useEffect(() => {
    if (selectedVideo) onVideoModalOpen();
    else onVideoModalClose();
  }, [selectedVideo]);

  useEffect(() => {
    setIsPlaylistModalOpen(!!selectedPlaylist);
  }, [selectedPlaylist]);

  const openItem = (item) => {
    if (item.type === "video") {
      setSelectedVideo(item);
      setSelectedPlaylist(null);
    } else {
      setSelectedPlaylist(item);
      setSelectedVideo(null);
    }
  };

  const closeAll = () => {
    setSelectedVideo(null);
    setSelectedPlaylist(null);
  };

  if (loadingVideos || loadingPlaylists) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Search: {queryTerm}</title>
      </Helmet>

      <div className="p-4">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-3 pt-0 md:pt-16">
          Search Results for: "{queryTerm}"
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 ">
            {results.map((item) =>
              item.type === "video" ? (
                <VideoCard key={item.id} video={item} onClick={openItem} />
              ) : (
                <PlaylistCard
                  key={item.id}
                  playlist={item}
                  onClick={openItem}
                />
              ),
            )}
          </div>
        ) : (
          <p className="text-white mt-4">No results found.</p>
        )}

        {selectedVideo && (
          <VideoModal
            isOpen={isVideoModalOpen}
            onClose={onVideoModalClose}
            video={selectedVideo}
          />
        )}

        {selectedPlaylist && (
          <PlaylistModal
            isOpen={isPlaylistModalOpen}
            onClose={closeAll}
            playlist={selectedPlaylist}
          />
        )}
      </div>
    </>
  );
}
