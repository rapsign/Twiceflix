import {
  Box,
  Heading,
  Text,
  Input,
  Grid,
  GridItem,
  useDisclosure,
  useToast,
  Flex,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";

import PlaylistEditModal from "./PlaylistEditModal";
import PlaylistModalForm from "./PlaylistModalForm";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import LoadingSpinner from "../../LoadingSpinner";
import PlaylistAction from "./PlaylistAction";
import { usePlaylistData } from "../../../hooks/usePlaylistData";
import PlaylistSearchBar from "./PlaylistSearchBar";
import debounce from "lodash/debounce";
import { useIsMobile } from "../../../hooks/useIsMobile";

const TablePlaylists = () => {
  const {
    data,
    filteredData,
    loading,
    search,
    setSearch,
    selectedPlaylist,
    setSelectedPlaylist,
    isAlertOpen,
    setIsAlertOpen,
    playlistToDelete,
    setPlaylistToDelete,
    cancelRef,
    handleDelete,
    handlePlaylistAdded,
    fetchData,
  } = usePlaylistData();

  const isMobile = useIsMobile();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const customStyles = {
    tableWrapper: {
      style: {
        borderTopRadius: "1rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
        borderBottom: "5px solid #fff",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#fff",
        color: "#0f0f0f",
        fontSize: "14px",
        fontWeight: "semibold",
      },
    },
    cells: {
      style: {
        backgroundColor: "#fff",
        padding: "10px",
        color: "#0f0f0f",
        fontSize: "14px",
        fontWeight: "semibold",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #3f3f3f",
        marginTop: "-10px",
        backgroundColor: "#fff",
        color: "#0f0f0f",
        borderRadius: "0 0 1rem 1rem",
      },
    },
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      cell: (row) => (
        <div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "2px",
              color: "#0f0f0f",
            }}
          >
            {row.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#3f3f3f",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.description}
          </div>
        </div>
      ),
      width: isMobile ? "350px" : "50%",
    },

    {
      name: "Number of Videos",
      selector: (row) => row.number_of_videos || 0,
      sortable: true,
      width: isMobile ? "170px" : "25%",
    },
    {
      name: "Action",
      cell: (row) => (
        <PlaylistAction
          row={row}
          onEdit={() => {
            setSelectedPlaylist(row);
            onOpen();
          }}
          onDelete={() => {
            setPlaylistToDelete(row);
            setIsAlertOpen(true);
          }}
        />
      ),
      width: isMobile ? "150px" : "25%",
    },
  ];
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
          PLAYLIST
        </Heading>
        <PlaylistModalForm onPlaylistAdded={handlePlaylistAdded} />
      </Flex>
      <Box bg="#0f0f0f" p={-2} borderRadius="md" boxShadow="md">
        <PlaylistSearchBar onChange={debouncedSearch} />
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          responsive
          customStyles={customStyles}
        />

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
    </Box>
  );
};

export default TablePlaylists;
