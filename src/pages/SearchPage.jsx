import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Grid,
  Image,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoModal from "../components/VideoModal";
import PlaylistModal from "../components/PlaylistModal";

const SearchPage = () => {
  const location = useLocation();
  const [queryTerm, setQueryTerm] = useState("");
  const {
    isOpen: isVideoModalOpen,
    onOpen: onVideoModalOpen,
    onClose: onVideoModalClose,
  } = useDisclosure();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q") || "";

    setQueryTerm(searchQuery.trim().toLowerCase());

    if (searchQuery) {
      fetchPlaylistsAndVideos(searchQuery.trim().toLowerCase());
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedVideo) {
      onVideoModalOpen();
    } else {
      onVideoModalClose();
    }
  }, [selectedVideo, onVideoModalOpen, onVideoModalClose]);

  useEffect(() => {
    if (selectedPlaylist) {
      setIsPlaylistModalOpen(true);
    } else {
      setIsPlaylistModalOpen(false);
    }
  }, [selectedPlaylist]);

  const fetchPlaylistsAndVideos = async (searchQuery) => {
    setIsLoading(true);
    try {
      const playlistSnapshot = await getDocs(collection(db, "playlists"));
      const playlistData = await Promise.all(
        playlistSnapshot.docs.map(async (doc) => {
          const playlist = { id: doc.id, ...doc.data() };

          const videoQuery = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlist.id),
            orderBy("published_at", "desc"),
            limit(1)
          );
          const videoSnapshot = await getDocs(videoQuery);

          const latestVideo =
            videoSnapshot.docs.length > 0 ? videoSnapshot.docs[0].data() : null;

          return {
            ...playlist,
            thumbnail: latestVideo
              ? latestVideo.thumbnail
              : "https://via.placeholder.com/720x1280",
            type: "playlist",
          };
        })
      );

      const videoCollection = collection(db, "videos");
      const videoSnapshot = await getDocs(videoCollection);
      const videos = videoSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "video",
        ...doc.data(),
      }));

      const videoColumns = [
        { selector: (row) => row.title, accessor: "title" },
      ];
      const playlistColumns = [
        { selector: (row) => row.name, accessor: "name" },
      ];

      const filteredVideos = filterData(videos, videoColumns, searchQuery);
      const filteredPlaylists = filterData(
        playlistData,
        playlistColumns,
        searchQuery
      );

      setResults([...filteredVideos, ...filteredPlaylists]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = (data, columns, search) => {
    return data.filter((row) =>
      columns.some((column) => {
        const value = column.selector
          ? column.selector(row)
          : row[column.accessor];
        return (
          value && value.toString().toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  };

  const openModal = (item) => {
    if (item.type === "video") {
      setSelectedVideo(item);
      setSelectedPlaylist(null); // Close PlaylistModal if it was open
    } else if (item.type === "playlist") {
      setSelectedPlaylist(item);
      setSelectedVideo(null); // Close VideoModal if it was open
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedPlaylist(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box p={5}>
      <Heading
        mb={3}
        mt={{ base: "10", md: "20" }}
        fontSize={{ base: "lg", md: "2xl" }}
      >
        Search Results for: "{queryTerm}"
      </Heading>
      {results.length > 0 ? (
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
          gap={2}
        >
          {results.map((result) => (
            <Box
              key={result.id}
              overflow="hidden"
              position="relative"
              cursor="pointer"
              transition="background-color 0.3s ease"
              border="1px solid rgba(255, 255, 255, 0.1)"
              onClick={() => openModal(result)}
              aspectRatio="16/9"
              _hover={{
                "& .overlay": {
                  opacity: 1,
                  visibility: "visible",
                },
              }}
            >
              <Image
                src={result.thumbnail}
                alt={result.title}
                objectFit="cover"
                width="100%"
                height="100%"
              />
              <Box
                className="overlay"
                position="absolute"
                bottom={0}
                left={0}
                width="100%"
                p={2}
                bg="linear-gradient(to top right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6))"
                color="white"
                opacity={0}
                visibility="hidden"
                transition="opacity 0.3s ease, visibility 0.3s ease"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  isTruncated
                  fontSize="sm"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="center"
                >
                  {result.type === "playlist" ? result.name : result.title}
                </Text>
              </Box>
              {result.type === "playlist" && (
                <Badge
                  position="absolute"
                  top={0}
                  left={0}
                  backgroundColor="red"
                  color="white"
                  paddingX={{ base: 2, md: 3 }}
                  paddingY={{ base: 0, md: 1 }}
                  fontSize={{ base: "0.5em", md: "0.7em" }}
                  size="sm"
                  fontWeight="bold"
                >
                  Playlist
                </Badge>
              )}
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No results found.</Text>
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={onVideoModalClose}
          video={selectedVideo}
        />
      )}

      {selectedPlaylist && (
        <PlaylistModal
          isOpen={isPlaylistModalOpen}
          onClose={closeModal}
          playlist={selectedPlaylist}
        />
      )}
    </Box>
  );
};

export default SearchPage;
