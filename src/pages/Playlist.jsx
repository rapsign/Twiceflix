"use client";

import { useState } from "react";
import PlaylistModal from "../components/Playlist/PlaylistModal";
import useDataManager from "../hooks/useDataManager";
import LoadingSpinner from "../components/LoadingSpinner";

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
      <h2 className="mb-3 text-xl md:text-3xl font-bold text-white pt-16">
        TWICE Playlist
      </h2>

      {/* Grid Playlist */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {playlists
          .filter((p) => p.videoCount >= 7)
          .map((playlist) => (
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
              <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-center text-sm truncate">{playlist.title}</p>
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
