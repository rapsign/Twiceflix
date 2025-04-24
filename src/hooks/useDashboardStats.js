import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useDashboardStats = () => {
  const [videoCount, setVideoCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videosRef = collection(db, "videos");
    const playlistsRef = collection(db, "playlists");

    const unsubscribeVideos = onSnapshot(
      videosRef,
      (snapshot) => {
        setVideoCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    );

    const unsubscribePlaylists = onSnapshot(
      playlistsRef,
      (snapshot) => {
        setPlaylistCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching playlists:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeVideos();
      unsubscribePlaylists();
    };
  }, []);

  return { videoCount, playlistCount, loading };
};

export default useDashboardStats;
