import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ===============================
   GLOBAL CACHE (PER COLLECTION)
================================ */
const cache = {
  videos: {
    data: null,
    promise: null,
  },
  playlists: {
    data: null,
    promise: null,
  },
};

/* ===============================
   HOOK
================================ */
const useDataManager = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      // 1. return cache if exists
      if (cache[collectionName]?.data) {
        if (mounted) {
          setData(cache[collectionName].data);
          setLoading(false);
        }
        return;
      }

      // 2. wait ongoing request (anti double-fetch)
      if (cache[collectionName]?.promise) {
        const result = await cache[collectionName].promise;
        if (mounted) {
          setData(result);
          setLoading(false);
        }
        return;
      }

      // 3. create single request
      cache[collectionName].promise = fetchCollection(collectionName);

      const result = await cache[collectionName].promise;
      cache[collectionName].data = result;
      cache[collectionName].promise = null;

      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [collectionName]);

  /* ===============================
     CRUD (EXPLICIT INVALIDATION)
  ================================ */
  const addItem = async (item) => {
    const ref = await addDoc(collection(db, collectionName), item);
    invalidate(collectionName);
    return { id: ref.id, ...item };
  };

  const updateItem = async (id, payload) => {
    await updateDoc(doc(db, collectionName, id), payload);
    invalidate(collectionName);
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, collectionName, id));
    invalidate(collectionName);
  };

  return { data, loading, addItem, updateItem, deleteItem };
};

/* ===============================
   FETCH IMPLEMENTATION
================================ */
const fetchCollection = async (name) => {
  if (name === "videos") {
    const q = query(collection(db, "videos"), orderBy("published_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  if (name === "playlists") {
    const playlistSnap = await getDocs(collection(db, "playlists"));
    const playlists = playlistSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const ids = playlists.map((p) => p.id);
    if (!ids.length) return playlists;

    const videoQuery = query(
      collection(db, "videos"),
      where("playlists", "array-contains-any", ids),
      orderBy("published_at", "desc"),
    );

    const videoSnap = await getDocs(videoQuery);
    const map = {};

    videoSnap.docs.forEach((doc) => {
      const v = { id: doc.id, ...doc.data() };
      v.playlists?.forEach((pid) => {
        if (!map[pid]) map[pid] = [];
        map[pid].push(v);
      });
    });

    return playlists.map((p) => ({
      ...p,
      videos: map[p.id] || [],
      videoCount: map[p.id]?.length || 0,
      thumbnail: map[p.id]?.[0]?.thumbnail || null,
    }));
  }

  return [];
};

/* ===============================
   CACHE CONTROL
================================ */
const invalidate = (collectionName) => {
  if (cache[collectionName]) {
    cache[collectionName].data = null;
    cache[collectionName].promise = null;
  }
};

export default useDataManager;
