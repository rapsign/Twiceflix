import { useState, useEffect, useRef } from "react";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
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
import { db } from "../../../firebase/firebase";
import { CloseButton } from "@chakra-ui/react";

const PlaylistEditModal = ({
  isOpen,
  onClose,
  playlist,
  onPlaylistUpdated,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState(playlist.title);
  const [playlistDescription, setPlaylistDescription] = useState(
    playlist.description || ""
  );
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setPlaylistTitle(playlist.title);
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
          width="130px"
          mr={3}
          borderRadius="md"
        />
        <Text
          color="black"
          fontSize="xs"
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
          {props.data.label}
        </Text>
      </Flex>
    </components.Option>
  );

  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <Flex alignItems="center">
        <Image
          src={props.data.thumbnail}
          alt={props.data.title}
          width="36px"
          mr={3}
          borderRadius="md"
          flexShrink={0}
        />
        <Text color="black" fontSize="xs">
          {props.data.label}
        </Text>
      </Flex>
    </components.SingleValue>
  );

  const handleSave = async () => {
    try {
      const playlistRef = doc(db, "playlists", playlist.id);
      await updateDoc(playlistRef, {
        title: playlistTitle,
        description: playlistDescription,
      });

      if (selectedVideo) {
        const videoRef = doc(db, "videos", selectedVideo.value);
        await updateDoc(videoRef, {
          playlists: arrayUnion(playlist.id),
        });
        setVideos((prevVideos) => [...prevVideos, selectedVideo.data]);
        setSelectedVideo(null);
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
    setPlaylistTitle(playlist.title);
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
      <ModalContent bg="#3f3f3f">
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
            <Box textAlign="right" fontSize="sm" color="#3f3f3f">
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
            mt={2}
            maxHeight="300px"
            overflowY="auto"
            borderRadius="xl"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#4c4c4c",
                borderRadius: "10px",
              },
            }}
          >
            <List spacing={2}>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <ListItem
                    key={video.id}
                    color="white"
                    bg="#4f4d4d"
                    width="99%"
                    p={2}
                    borderRadius="xl"
                  >
                    <Flex align="center">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        aspectRatio="16/9"
                        objectFit="cover"
                        borderRadius="xl"
                        mr={4}
                        w={{ base: "100px", md: "130px" }}
                      />
                      <Box flex="1">
                        <Text
                          fontWeight="bold"
                          fontSize="xs"
                          mb={1}
                          w={{ base: "98%", md: "96%" }}
                        >
                          {video.title}
                        </Text>
                      </Box>
                      <Box>
                        <IconButton
                          icon={<CloseButton boxSize="1" />}
                          height="30px"
                          width="30px"
                          minW="unset"
                          rounded="full"
                          p="2"
                          variant="outline"
                          onClick={() => handleRemoveVideo(video.id)}
                          aria-label="Remove Video"
                          color="white"
                          borderColor="#ccc"
                          _hover={{ background: "#ccc" }}
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
