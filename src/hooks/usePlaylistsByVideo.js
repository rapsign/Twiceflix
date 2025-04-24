import { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const usePlaylistsByVideo = (video) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!video?.playlists?.length) {
        setLoading(false);
        return;
      }

      try {
        const playlistsQuery = query(
          collection(db, "playlists"),
          where("__name__", "in", video.playlists)
        );
        const querySnapshot = await getDocs(playlistsQuery);

        const fetchedPlaylists = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlaylists(fetchedPlaylists);
      } catch (error) {
        setError(error);
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [video]);

  return { playlists, loading, error };
};

export default usePlaylistsByVideo;
