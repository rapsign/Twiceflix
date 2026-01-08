"use client";

import { useState } from "react";
import PlaylistModal from "../components/Playlist/PlaylistModal";
import useDataManager from "../hooks/useDataManager";
import LoadingSpinner from "../components/LoadingSpinner";
import { cn } from "@/lib/utils";

const Playlist = () => {
  const { data: playlists = [], loading } = useDataManager("playlists");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
    setIsModalOpen(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      {/* Heading */}
      <h2 className="mb-3 text-xl md:text-3xl font-bold text-white pt-0 md:pt-16">
        TWICE Playlist
      </h2>

      {/* Grid Playlist */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="relative cursor-pointer rounded-xl aspect-video overflow-hidden group"
            onClick={() => openModal(playlist)}
          >
            {/* Thumbnail */}
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Overlay */}
            <div
              className={cn(
                "absolute bottom-0 left-0 w-full p-2 flex items-center justify-center text-white",
                "bg-gradient-to-tr from-black/95 to-black/60",
                "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300"
              )}
            >
              <span className="text-xs text-center truncate">
                {playlist.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Playlist Modal */}
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={closeModal}
          playlist={selectedPlaylist}
        />
      )}
    </div>
  );
};

export default Playlist;
