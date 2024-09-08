import React, { useState, useEffect, useCallback, useRef } from "react";
import DataTable from "react-data-table-component";
import { BiCog, BiTrash } from "react-icons/bi";
import PlaylistEditModal from "./PlaylistEditModal";
import PlaylistModalForm from "./PlaylistModalForm";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  Box,
  Heading,
  Text,
  Input,
  Grid,
  GridItem,
  IconButton,
  useDisclosure,
  useToast,
  Flex,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "./LoadingSpinner";
import debounce from "lodash/debounce";

const TablePlaylists = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [search, setSearch] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
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
    debounce((value) => setSearch(value), 300),
    []
  );

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  // Define columns array
  const columns = [
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "",
      sortable: true,
    },
    {
      name: "Number of Videos",
      selector: (row) => row.number_of_videos || 0,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Flex gap={2}>
          <IconButton
            icon={<BiCog size="1.5em" />}
            rounded="none"
            bg="#1f2937"
            color="white"
            onClick={() => {
              setSelectedPlaylist(row);
              onOpen();
            }}
          >
            Edit
          </IconButton>
          <IconButton
            icon={<BiTrash size="1.5em" />}
            rounded="none"
            bg="red"
            color="white"
            onClick={() => {
              setPlaylistToDelete(row);
              setIsAlertOpen(true);
            }}
          >
            Delete
          </IconButton>
        </Flex>
      ),
    },
  ];

  return (
    <Box mt={{ base: 12, md: 0 }}>
      <Heading mb={5}>
        <Text as="span" color="red">
          TWICEFLIX
        </Text>{" "}
        PLAYLISTS
      </Heading>
      <Box bg="#1f2937" p={2}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <PlaylistModalForm onPlaylistAdded={handlePlaylistAdded} />
          </GridItem>
          <GridItem colEnd={{ md: 6 }}>
            <Input
              placeholder="Search..."
              color="white"
              mb={4}
              width={{ base: "100%", md: "400px" }}
              maxWidth="600px"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </GridItem>
        </Grid>
      </Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box overflowX="auto">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              rows: {
                style: {
                  fontSize: "16px",
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                },
              },
              headCells: {
                style: {
                  color: "#ffffff",
                  fontWeight: "bold",
                  backgroundColor: "#1f2937",
                },
              },
              cells: {
                style: {
                  color: "#000000",
                },
              },
            }}
          />
        </Box>
      )}
      {selectedPlaylist && (
        <PlaylistEditModal
          isOpen={isOpen}
          onClose={onClose}
          playlist={selectedPlaylist}
          onPlaylistUpdated={fetchData}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="playlist"
        ref={cancelRef}
      />
    </Box>
  );
};

export default TablePlaylists;
