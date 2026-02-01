import CustomSwiper from "../CustomSwiper";
import LoadingSpinner from "../LoadingSpinner";
import useDataManager from "@/hooks/useDataManager";

const PlaylistSwiper = () => {
  const { data: playlists, loading } = useDataManager("playlists");

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredPlaylists = playlists.filter(
    (playlist) => (playlist.videos?.length || 0) >= 8,
  );

  return (
    <div className="w-full py-2 text-white">
      {filteredPlaylists.map((playlist) => (
        <div key={playlist.id} className="mb-6">
          <CustomSwiper items={playlist.videos} title={playlist.title} />
        </div>
      ))}
    </div>
  );
};

export default PlaylistSwiper;
