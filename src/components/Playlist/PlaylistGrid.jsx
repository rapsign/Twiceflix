// PlaylistGrid.jsx
import PlaylistCard from "./PlaylistCard";

export default function PlaylistGrid({ playlists, fetchPlaylist }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 px-2">
      {playlists.map((playlist, index) => (
        <PlaylistCard
          key={`${playlist.id}-${index}`}
          playlist={playlist}
          fetchPlaylist={fetchPlaylist}
        />
      ))}
    </div>
  );
}
