import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useToast } from "@chakra-ui/react";
import debounce from "lodash/debounce";

export const usePlaylistData = () => {
  const [data, setData] = useState([]);
  const [search, setSearchValue] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const playlistsQuerySnapshot = await getDocs(collection(db, "playlists"));
      const playlistsData = await Promise.all(
        playlistsQuerySnapshot.docs.map(async (doc) => {
          const playlistId = doc.id;
          const playlistData = doc.data();
          const videosQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlistId)
          );
          const videosQuerySnapshot = await getDocs(videosQuery);
          const numberOfVideos = videosQuerySnapshot.size;

          return {
            id: playlistId,
            ...playlistData,
            number_of_videos: numberOfVideos,
          };
        })
      );
      setData(playlistsData);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast({
        title: "Error",
        description: "Failed to fetch playlists.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      if (playlistToDelete) {
        await deleteDoc(doc(db, "playlists", playlistToDelete.id));
        toast({
          title: "Success",
          description: "Playlist successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchData();
      }
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Error",
        description: "Failed to delete playlist.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsAlertOpen(false);
    } finally {
      setLoading(false);
    }
  }, [playlistToDelete, fetchData, toast]);

  const handlePlaylistAdded = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 300),
    []
  );

  const filteredData = data.filter((row) =>
    (row.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return {
    data,
    filteredData,
    loading,
    search,
    setSearch: debouncedSearch,
    selectedPlaylist,
    setSelectedPlaylist,
    playlistToDelete,
    setPlaylistToDelete,
    isAlertOpen,
    setIsAlertOpen,
    cancelRef,
    handleDelete,
    handlePlaylistAdded,
    fetchData,
  };
};
