"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import VideoModal from "@/components/Videos/VideoModal";
import PlaylistModal from "@/components/Playlist/PlaylistModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import useDataManager from "@/hooks/useDataManager";
import { Helmet } from "react-helmet";
import { useDisclosure } from "@/hooks/useDisclosure";

export default function SearchPage() {
  const location = useLocation();
  const [queryTerm, setQueryTerm] = useState("");

  // Ambil videos dan playlists dari useDataManager
  const { data: videos = [], loading: loadingVideos } =
    useDataManager("videos");
  const { data: playlists = [], loading: loadingPlaylists } =
    useDataManager("playlists");

  const [results, setResults] = useState([]);

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const {
    isOpen: isVideoModalOpen,
    onOpen: onVideoModalOpen,
    onClose: onVideoModalClose,
  } = useDisclosure();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  // Ambil query dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q") || "";
    setQueryTerm(searchQuery.trim().toLowerCase());
  }, [location.search]);

  // Filter hasil search
  useEffect(() => {
    if (!queryTerm) {
      setResults([]);
      return;
    }

    const filterData = (data, type) =>
      data
        .filter((item) =>
          (item.title || "").toString().toLowerCase().includes(queryTerm)
        )
        .map((item) => ({
          ...item,
          type,
        }));

    const filteredVideos = filterData(videos, "video");
    const filteredPlaylists = filterData(playlists, "playlist");

    setResults([...filteredVideos, ...filteredPlaylists]);
  }, [queryTerm, videos, playlists]);

  // Modal handling
  useEffect(() => {
    if (selectedVideo) onVideoModalOpen();
    else onVideoModalClose();
  }, [selectedVideo, onVideoModalOpen, onVideoModalClose]);

  useEffect(() => {
    setIsPlaylistModalOpen(!!selectedPlaylist);
  }, [selectedPlaylist]);

  const openModal = (item) => {
    if (item.type === "video") {
      setSelectedVideo(item);
      setSelectedPlaylist(null);
    } else if (item.type === "playlist") {
      setSelectedPlaylist(item);
      setSelectedVideo(null);
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedPlaylist(null);
  };

  if (loadingVideos || loadingPlaylists) return <LoadingSpinner />;

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-3 pt-16">
          Search Results for: "{queryTerm}"
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="relative rounded-xl overflow-hidden cursor-pointer border border-white/10 aspect-video"
                onClick={() => openModal(result)}
              >
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 to-black/50 text-center text-white opacity-0 hover:opacity-100 transition-opacity">
                  <p className="truncate">{result.title}</p>
                </div>

                {result.type === "playlist" && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded"
                  >
                    Playlist
                  </Badge>
                )}
              </div>
            ))}
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
            onClose={closeModal}
            playlist={selectedPlaylist}
          />
        )}
      </div>
    </>
  );
}
