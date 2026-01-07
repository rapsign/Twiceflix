import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ===============================
   GLOBAL CACHE
================================ */
let cachedVideos = [];
let cachedVideosMap = {};
let cachedPlaylists = [];
let cachedPlaylistStats = {}; // { playlistId: { count, latestVideo } }
let lastFetchTime = 0;

const REFRESH_INTERVAL = 5 * 60 * 1000;

/* ===============================
   HOOK
================================ */
const useDataManager = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH DATA
  ================================ */
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      /* ========= VIDEOS ========= */
      if (collectionName === "videos") {
        if (cachedVideos.length) {
          setData([...cachedVideos]);
          return;
        }

        const q = query(
          collection(db, "videos"),
          orderBy("published_at", "desc")
        );

        const snap = await getDocs(q);

        cachedVideos = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        cachedVideosMap = {};
        cachedVideos.forEach((v) => (cachedVideosMap[v.id] = v));

        setData([...cachedVideos]);
      }

      /* ========= PLAYLISTS ========= */
      if (collectionName === "playlists") {
        if (cachedPlaylists.length) {
          setData([...cachedPlaylists]);
          return;
        }

        // ambil playlist
        const playlistSnap = await getDocs(collection(db, "playlists"));
        const playlists = playlistSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const playlistIds = playlists.map((p) => p.id);

        cachedPlaylistStats = {}; // untuk count & latestVideo
        const playlistVideosMap = {}; // baru: simpan video per playlist

        // ambil video yang punya playlist
        if (playlistIds.length) {
          const videoQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains-any", playlistIds),
            orderBy("published_at", "desc")
          );

          const videoSnap = await getDocs(videoQuery);

          videoSnap.docs.forEach((doc) => {
            const video = { id: doc.id, ...doc.data() };

            video.playlists?.forEach((pid) => {
              // count video
              if (!cachedPlaylistStats[pid]) {
                cachedPlaylistStats[pid] = { count: 0, latestVideo: null };
              }
              cachedPlaylistStats[pid].count += 1;

              // latest video
              if (
                !cachedPlaylistStats[pid].latestVideo ||
                cachedPlaylistStats[pid].latestVideo.published_at <
                  video.published_at
              ) {
                cachedPlaylistStats[pid].latestVideo = video;
              }

              // simpan video per playlist
              if (!playlistVideosMap[pid]) playlistVideosMap[pid] = [];
              playlistVideosMap[pid].push(video);
            });
          });
        }

        // enrich playlist: tambahkan thumbnail, videoCount, dan array videos
        cachedPlaylists = playlists.map((p) => ({
          ...p,
          videoCount: cachedPlaylistStats[p.id]?.count || 0,
          thumbnail:
            cachedPlaylistStats[p.id]?.latestVideo?.thumbnail ||
            "https://via.placeholder.com/720x1280",
          videos: playlistVideosMap[p.id] || [], // ✅ tambahkan videos
        }));

        setData([...cachedPlaylists]);
      }

      lastFetchTime = Date.now();
    } catch (err) {
      console.error("useDataManager error:", err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  /* ===============================
     AUTO REFRESH
  ================================ */
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      if (Date.now() - lastFetchTime > REFRESH_INTERVAL) {
        fetchData();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  /* ===============================
     CRUD
  ================================ */
  const addItem = async (item) => {
    const ref = await addDoc(collection(db, collectionName), item);
    clearCache(collectionName);
    await fetchData();
    return { id: ref.id, ...item };
  };

  const updateItem = async (id, data) => {
    await updateDoc(doc(db, collectionName, id), data);
    clearCache(collectionName);
    await fetchData();
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, collectionName, id));
    clearCache(collectionName);
    await fetchData();
  };

  return {
    data,
    loading,
    refresh: fetchData,
    addItem,
    updateItem,
    deleteItem,
  };
};

/* ===============================
   CACHE INVALIDATION
================================ */
const clearCache = (collectionName) => {
  if (collectionName === "videos") {
    cachedVideos = [];
    cachedVideosMap = {};
  }

  if (collectionName === "playlists") {
    cachedPlaylists = [];
    cachedPlaylistStats = {};
  }

  lastFetchTime = 0;
};

export default useDataManager;
