import { useState } from "react";

import CustomSwiper from "../CustomSwiper";
import VideoModal from "../Videos/VideoModal";
import LoadingSpinner from "../LoadingSpinner";

import useDataManager from "@/hooks/useDataManager";

const PlaylistSwiper = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: playlists, loading } = useDataManager("playlists");

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredPlaylists = playlists.filter(
    (playlist) => (playlist.videos?.length || 0) >= 8
  );

  return (
    <div className="w-full py-2 text-white">
      {filteredPlaylists.map((playlist) => (
        <div key={playlist.id} className="mb-6">
          <CustomSwiper
            items={playlist.videos}
            title={playlist.title}
            onItemClick={openModal}
          />
        </div>
      ))}

      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          video={selectedVideo}
        />
      )}
    </div>
  );
};

export default PlaylistSwiper;
