import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useListPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = useCallback(async () => {
    try {
      const playlistSnapshot = await getDocs(collection(db, "playlists"));
      const playlistIds = playlistSnapshot.docs.map((doc) => doc.id);
      const playlistData = await Promise.all(
        playlistIds.map(async (playlistId) => {
          const playlist = playlistSnapshot.docs
            .find((doc) => doc.id === playlistId)
            .data();

          const videoQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlistId),
            orderBy("published_at", "desc")
          );
          const videoSnapshot = await getDocs(videoQuery);
          const videos = videoSnapshot.docs.map((doc) => doc.data());

          if (videos.length <= 7) return null;

          return {
            id: playlistId,
            ...playlist,
            videos,
          };
        })
      );

      setPlaylists(playlistData.filter((playlist) => playlist !== null));
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading };
};

export default useListPlaylists;
