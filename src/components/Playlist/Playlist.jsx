"use client";

import { useState } from "react";
import CustomSwiper from "../CustomSwiper";
import PlaylistModal from "./PlaylistModal";
import useDataManager from "../../hooks/useDataManager"; // hook data
import LoadingSpinner from "../LoadingSpinner";

const Playlist = () => {
  const { data: playlists, loading } = useDataManager("playlists");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  return (
    <div className="bg-transparent text-white py-2 w-full">
      {/* Title */}
      <h2 className="text-md md:text-xl lg:text-2xl font-bold mb-2 px-2">
        TWICE Playlist
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <CustomSwiper
          items={playlists}
          onItemClick={openModal}
          badgeLabel="Playlist"
          playlist="Playlist"
        />
      )}

      {/* Modal */}
      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={closeModal}
          playlist={selectedPlaylist}
          setPlaylist={setSelectedPlaylist}
        />
      )}
    </div>
  );
};

export default Playlist;
