import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const usePlaylistEpisodes = (isOpen, playlist) => {
  const [episodes, setEpisodes] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!playlist) return;

      try {
        const episodesQuery = query(
          collection(db, "videos"),
          where("playlists", "array-contains", playlist.id),
          orderBy("published_at", "desc")
        );

        const snapshot = await getDocs(episodesQuery);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEpisodes(data);
        setSelectedVideo(data[0] || null);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

    if (isOpen && playlist) {
      fetchEpisodes();
    }
  }, [isOpen, playlist]);

  return {
    episodes,
    selectedVideo,
    setSelectedVideo,
  };
};

export default usePlaylistEpisodes;
