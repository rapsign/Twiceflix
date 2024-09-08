import { useState, useEffect, useRef } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import Select, { components } from "react-select";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Image,
  Text,
  List,
  ListItem,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { CloseButton } from "@chakra-ui/react";

const PlaylistEditModal = ({
  isOpen,
  onClose,
  playlist,
  onPlaylistUpdated,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState(playlist.name);
  const [playlistDescription, setPlaylistDescription] = useState(
    playlist.description || ""
  );
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null); // Store the video to delete
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setPlaylistTitle(playlist.name);
      setPlaylistDescription(playlist.description || "");

      const fetchPlaylistVideos = async () => {
        try {
          const q = query(
            collection(db, "videos"),
            where("playlists", "array-contains", playlist.id)
          );
          const querySnapshot = await getDocs(q);
          const videosData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVideos(videosData);
        } catch (error) {
          console.error("Error fetching playlist videos:", error);
          toast({
            title: "Error fetching playlist videos",
            description:
              "There was an error fetching videos for this playlist.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };

      const fetchAllVideos = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "videos"));
          const allVideosData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllVideos(allVideosData);
        } catch (error) {
          console.error("Error fetching all videos:", error);
          toast({
            title: "Error fetching all videos",
            description: "There was an error fetching all videos.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchPlaylistVideos();
      fetchAllVideos();
    }
  }, [isOpen, playlist.id]);

  const CustomOption = (props) => (
    <components.Option {...props}>
      <Flex alignItems="center">
        <Image
          src={props.data.thumbnail}
          alt={props.data.title}
          boxSize="50px"
          mr={3}
          borderRadius="md"
        />
        <Text color="black">{props.data.label}</Text>
      </Flex>
    </components.Option>
  );

  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <Flex alignItems="center">
        <Image
          src={props.data.thumbnail}
          alt={props.data.title}
          boxSize="30px"
          mr={3}
          borderRadius="md"
        />
        <Text color="black">{props.data.label}</Text>
      </Flex>
    </components.SingleValue>
  );

  const handleSave = async () => {
    try {
      const playlistRef = doc(db, "playlists", playlist.id);
      await updateDoc(playlistRef, {
        name: playlistTitle,
        description: playlistDescription,
      });

      if (selectedVideo) {
        const videoRef = doc(db, "videos", selectedVideo.value);
        await updateDoc(videoRef, {
          playlists: arrayUnion(playlist.id),
        });
        setVideos((prevVideos) => [...prevVideos, selectedVideo.data]);
        setSelectedVideo(null); // Reset selected video after adding
      }

      toast({
        title: "Playlist updated",
        description: "Playlist details updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onPlaylistUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast({
        title: "Error updating playlist",
        description: "There was an error updating the playlist.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setPlaylistTitle(playlist.name);
    setPlaylistDescription(playlist.description || "");
    setVideos([]);
    setSelectedVideo(null);
    onClose();
  };

  const handleRemoveVideo = (videoId) => {
    setVideoToDelete(videoId);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    try {
      const videoRef = doc(db, "videos", videoToDelete);
      const playlistRef = doc(db, "playlists", playlist.id);
      await updateDoc(videoRef, {
        playlists: arrayRemove(playlist.id),
      });
      await updateDoc(playlistRef, {
        videos: arrayRemove(videoToDelete),
      });

      // Remove the video from the local state
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoToDelete)
      );
      setAllVideos((prevAllVideos) =>
        prevAllVideos.map((video) =>
          video.id === videoToDelete
            ? {
                ...video,
                playlists: video.playlists.filter((id) => id !== playlist.id),
              }
            : video
        )
      );

      toast({
        title: "Video removed",
        description: "Video removed from the playlist successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing video from playlist:", error);
      toast({
        title: "Error removing video",
        description: "There was an error removing the video from the playlist.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
      setVideoToDelete(null);
    }
  };

  const videosNotInPlaylist = allVideos
    .filter((video) => !video.playlists.includes(playlist.id))
    .map((video) => ({
      value: video.id,
      label: video.title,
      thumbnail: video.thumbnail,
      data: video,
    }));

  return (
    <Modal isOpen={isOpen} size="xl" onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Edit Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Playlist Title</FormLabel>
            <Input
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={playlistDescription}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setPlaylistDescription(e.target.value);
                }
              }}
              minHeight="200px"
            />
            <Box textAlign="right" fontSize="sm" color="gray.400">
              {playlistDescription.length}/300
            </Box>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Add Video to Playlist</FormLabel>
            <Select
              options={videosNotInPlaylist}
              value={selectedVideo}
              onChange={setSelectedVideo}
              placeholder="Select a video..."
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  color: "black",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "black",
                }),
                input: (base) => ({
                  ...base,
                  color: "black",
                }),
                menu: (base) => ({
                  ...base,
                  color: "black",
                }),
              }}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
              }}
            />
          </FormControl>
          <FormLabel>Videos in Playlist</FormLabel>
          <Box
            mt={4}
            maxHeight="300px"
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "&": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
            <List spacing={5}>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <ListItem
                    key={video.id}
                    color="white"
                    bg="gray.700"
                    p={4}
                    borderRadius="md"
                  >
                    <Flex align="center" spacing={4}>
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        aspectRatio="16/9"
                        objectFit="cover"
                        borderRadius="md"
                        w="150px"
                        mr={4}
                      />
                      <Box flex="1">
                        <Text fontWeight="bold" fontSize="xs" mb={1}>
                          {video.title}
                        </Text>
                      </Box>
                      <Box>
                        <IconButton
                          icon={<CloseButton />}
                          size="sm"
                          rounded="full"
                          variant="outline"
                          color="white"
                          onClick={() => handleRemoveVideo(video.id)}
                        />
                      </Box>
                    </Flex>
                  </ListItem>
                ))
              ) : (
                <Box textAlign="center">
                  <Text>No videos in this playlist.</Text>
                </Box>
              )}
            </List>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose} mr={3}>
            Close
          </Button>
          <Button colorScheme="red" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="video"
      />
    </Modal>
  );
};

export default PlaylistEditModal;
