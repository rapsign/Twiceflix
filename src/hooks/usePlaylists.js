import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const usePlaylists = () => {
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
            orderBy("published_at", "desc"),
            limit(1)
          );
          const videoSnapshot = await getDocs(videoQuery);

          const latestVideo =
            videoSnapshot.docs.length > 0 ? videoSnapshot.docs[0].data() : null;

          return {
            id: playlistId,
            ...playlist,
            thumbnail: latestVideo
              ? latestVideo.thumbnail
              : "https://via.placeholder.com/720x1280",
          };
        })
      );
      setPlaylists(playlistData);
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

export default usePlaylists;
