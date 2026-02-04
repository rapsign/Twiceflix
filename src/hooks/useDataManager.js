import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ===============================
   GLOBAL CACHE
================================ */
const cache = {};

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

      if (!cache[collectionName])
        cache[collectionName] = { data: null, promise: null };

      if (cache[collectionName].data) {
        if (mounted) {
          setData(cache[collectionName].data);
          setLoading(false);
        }
        return;
      }

      if (cache[collectionName].promise) {
        const result = await cache[collectionName].promise;
        if (mounted) {
          setData(result);
          setLoading(false);
        }
        return;
      }

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
  if (name === "youtube_video" || name === "youtube_shorts") {
    const q = query(collection(db, name), orderBy("published_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  if (name === "youtube_playlist") {
    const playlistSnap = await getDocs(collection(db, "youtube_playlist"));
    return playlistSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
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
