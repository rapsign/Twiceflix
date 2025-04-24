import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "videos"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching videos:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { videos, isLoading };
};

export default useVideos;
