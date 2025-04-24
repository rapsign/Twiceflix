import { useState, useCallback, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useVideosByTable = (toast) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "videos"),
        orderBy("published_at", "desc"),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      const videosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(videosData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data from Firestore.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteVideo = async (id) => {
    await deleteDoc(doc(db, "videos", id));
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, fetchData, deleteVideo };
};
