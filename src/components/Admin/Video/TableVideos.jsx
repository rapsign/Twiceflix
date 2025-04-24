import { useState, useRef } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { useVideosByTable } from "../../../hooks/useVideosByTable";
import LoadingSpinner from "../../LoadingSpinner";
import VideoSearchBar from "./VideoSearchBar";
import VideoModalForm from "./VideoModalForm";
import VideoEditModal from "./VideoEditModal";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import VideoTable from "./VideoTable";

const TableVideos = () => {
  const toast = useToast();
  const cancelRef = useRef();
  const { data, loading, fetchData, deleteVideo } = useVideosByTable(toast);

  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (videoToDelete) {
      await deleteVideo(videoToDelete.id);
      setIsAlertOpen(false);
      toast({
        title: "Deleted",
        description: "Video deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const debouncedSearch = debounce((val) => setSearch(val), 300);

  if (loading) return <LoadingSpinner />;

  return (
    <Box m={{ base: -2, md: 2 }}>
      <Flex mb={3} justify="space-between" align="center" wrap="wrap">
        <Heading
          fontWeight="bold"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        >
          <Text as="span" color="red">
            TWICEFLIX
          </Text>{" "}
          VIDEOS
        </Heading>
        <VideoModalForm isEditing={false} onSave={fetchData} />
      </Flex>

      <Box bg="#0f0f0f" p={-2} borderRadius="xl" boxShadow="md">
        <VideoSearchBar onChange={debouncedSearch} />
        <VideoTable
          data={data}
          onEdit={handleEdit}
          onDelete={(video) => {
            setVideoToDelete(video);
            setIsAlertOpen(true);
          }}
          searchTerm={search}
        />

        <VideoEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          video={selectedVideo}
          onSave={fetchData}
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
