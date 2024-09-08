import React, { useState, useEffect, useRef, useCallback } from "react";
import DataTable from "react-data-table-component";
import { BiCog, BiTrash } from "react-icons/bi";
import VideoModalForm from "./VideoModalForm";
import VideoEditModal from "./VideoEditModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  Box,
  Heading,
  Text,
  Input,
  Grid,
  GridItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "./LoadingSpinner";
import debounce from "lodash/debounce";

const TableVideos = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const cancelRef = useRef();
  const toast = useToast();

  // Fetch data with pagination and ordering
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "videos"),
        orderBy("published_at", "desc"),
        limit(100) // Adjust the limit as needed
      );
      const querySnapshot = await getDocs(q);
      const videosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(videosData);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Efficient deletion with batch
  const handleDelete = useCallback(async () => {
    if (videoToDelete) {
      try {
        await deleteDoc(doc(db, "videos", videoToDelete.id));
        setData((prevData) =>
          prevData.filter((item) => item.id !== videoToDelete.id)
        );
        toast({
          title: "Success",
          description: "Video successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast({
          title: "Error",
          description: "Failed to delete the video.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsAlertOpen(false);
    }
  }, [videoToDelete, toast]);

  const handleSave = () => {
    fetchData();
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  // Columns definition
  const columns = [
    {
      name: "Thumbnail",
      selector: (row) => row.thumbnail,
      cell: (row) => (
        <img
          src={row.thumbnail}
          alt="Thumbnail"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "250px",
            objectFit: "cover",
          }}
        />
      ),
      maxWidth: "250px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      maxWidth: "300px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      cell: (row) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "300px",
          }}
        >
          {row.description}
        </div>
      ),
      maxWidth: "300px",
    },
    {
      name: "Published At",
      cell: (row) => {
        const formattedDate = moment(row.published_at.toDate()).format(
          "DD MMM YYYY"
        );
        return formattedDate;
      },
      sortable: true,
      maxWidth: "300px",
    },
    {
      name: "YouTube URL",
      selector: (row) => row.youtube_url,
      cell: (row) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.youtube_url}
        </div>
      ),
      maxWidth: "300px",
    },
    {
      name: "Action",
      cell: (row) => (
        <Box
          display="flex"
          gap={2}
          flexDirection={{ base: "column", sm: "row" }}
        >
          <IconButton
            icon={<BiCog size="1.2em" />}
            rounded="none"
            bg="#1f2937"
            color="white"
            onClick={() => handleEdit(row)}
            size="sm"
          >
            Edit
          </IconButton>
          <IconButton
            icon={<BiTrash size="1.2em" />}
            rounded="none"
            bg="red"
            color="white"
            onClick={() => {
              setVideoToDelete(row);
              setIsAlertOpen(true);
            }}
            size="sm"
          >
            Delete
          </IconButton>
        </Box>
      ),
    },
  ];

  // Debounce search input
  const debouncedSearch = useCallback(
    debounce((value) => setSearch(value), 300),
    []
  );

  const filteredData = data.filter((row) =>
    columns.some((column) => {
      const value = column.selector
        ? column.selector(row)
        : row[column.accessor];
      return (
        value && value.toString().toLowerCase().includes(search.toLowerCase())
      );
    })
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box mt={{ base: 12, md: 0 }} rounded="none">
      <Heading mb={5}>
        <Text as="span" color="red">
          TWICEFLIX
        </Text>{" "}
        VIDEOS
      </Heading>
      <Box bg="#1f2937" p={4} borderRadius="md" boxShadow="md">
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
          <GridItem>
            <VideoModalForm
              video={selectedVideo}
              isEditing={isEditing}
              onSave={handleSave}
            />
          </GridItem>
          <GridItem colEnd={{ md: 6 }}>
            <Input
              placeholder="Search..."
              color="white"
              mb={4}
              width={{ base: "100%", md: "400px" }}
              value={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </GridItem>
        </Grid>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
          customStyles={{
            rows: {
              style: {
                fontSize: "14px",
                color: "#000000",
                backgroundColor: "#ffffff",
                padding: "5px 8px",
              },
            },
            headCells: {
              style: {
                color: "#ffffff",
                fontWeight: "bold",
                backgroundColor: "#1f2937",
                padding: "8px 8px",
              },
            },
            cells: {
              style: {
                color: "#000000",
                padding: "5px 8px",
              },
            },
          }}
        />
        <VideoEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          video={selectedVideo}
          onSave={handleSave}
        />
        <DeleteConfirmationDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={handleDelete}
          itemName="video"
          ref={cancelRef}
        />
      </Box>
    </Box>
  );
};

export default TableVideos;
