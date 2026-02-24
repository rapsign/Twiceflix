import { useEffect, useState } from "react";

/**
 * Hook untuk mengambil daftar video (episodes) dari playlist
 * - Aman saat modal ditutup
 * - Reset otomatis saat playlist berubah
 * - Bisa dipakai barengan dengan useDataManager
 */
const usePlaylistEpisodes = (isOpen, playlist) => {
  const [episodes, setEpisodes] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Jika modal ditutup → reset state
    if (!isOpen || !playlist) {
      setEpisodes([]);
      setSelectedVideo(null);
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        setLoading(true);

        /**
         * ASUMSI STRUKTUR DATA:
         * playlist.videos sudah tersedia dari API
         * Jika ambil dari API → ganti di sini
         */
        const videos = playlist.videos || [];

        setEpisodes(videos);
        setSelectedVideo(videos[0] || null);
      } catch (error) {
        console.error("Failed to load playlist episodes:", error);
        setEpisodes([]);
        setSelectedVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [isOpen, playlist?.id]);

  return {
    episodes,
    selectedVideo,
    setSelectedVideo,
    loading,
  };
};

export default usePlaylistEpisodes;
