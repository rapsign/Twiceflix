import CustomSwiper from "../CustomSwiper";
import useDataManager from "../../hooks/useDataManager";

const Playlist = () => {
  const { data: playlists } = useDataManager("playlists");

  return (
    <div className="bg-transparent text-white py-2 w-full">
      <CustomSwiper
        title="TWICE Playlist"
        items={playlists}
        badgeLabel="Playlist"
        type="playlist"
      />
    </div>
  );
};

export default Playlist;
