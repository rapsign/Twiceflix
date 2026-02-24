import { useMemo } from "react";
import useDataManager from "./useDataManager";

const useDashboardStats = () => {
  const { data: videos = [], loading: loadingVideos } =
    useDataManager("youtube_video");
  const { data: playlists = [], loading: loadingPlaylists } =
    useDataManager("youtube_playlist");

  const videoCount = useMemo(() => videos.length, [videos]);
  const playlistCount = useMemo(() => playlists.length, [playlists]);
  const loading = loadingVideos || loadingPlaylists;

  return { videoCount, playlistCount, loading };
};

export default useDashboardStats;
