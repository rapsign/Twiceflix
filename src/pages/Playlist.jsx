"use client";

import PlaylistCard from "@/components/Playlist/PlaylistCard";
import useDataManager from "@/hooks/useDataManager";
import LoadingSpinner from "@/components/LoadingSpinner";

const Playlist = () => {
  const { data: playlists = [], loading } = useDataManager("playlists");

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 pt-4 md:pt-18">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
