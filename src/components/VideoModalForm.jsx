import { useState, useEffect, useCallback } from "react";
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import { format } from "date-fns";
import Select from "react-select";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const VideoModalForm = ({ onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    youtube_url: "",
    title: "",
    description: "",
    published_at: "",
    thumbnail: "",
    playlists: [],
  });
  const [videoData, setVideoData] = useState(null);
  const [playlistsData, setPlaylistsData] = useState([]);
  const [playlistOptions, setPlaylistOptions] = useState([]);
  const [videoCache, setVideoCache] = useState({});
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const toast = useToast();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playlists"));
        const playlistsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setPlaylistsData(playlistsData);
        setPlaylistOptions(
          playlistsData.map((playlist) => ({
            value: playlist.id,
            label: playlist.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching playlists:", error);
        toast({
          title: "Error",
          description: "Failed to fetch playlists.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPlaylists();
  }, [toast]);

  useEffect(() => {
    if (videoData) {
      setFormData((prev) => ({
        ...prev,
        title: videoData.title,
        published_at: format(new Date(videoData.published_at), "yyyy-MM-dd"),
        thumbnail: videoData.thumbnail,
      }));
    }
  }, [videoData]);

  const fetchVideoData = useCallback(
    async (videoId) => {
      if (videoCache[videoId]) {
        setVideoData(videoCache[videoId]);
        return;
      }
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
        );
        const video = response.data.items[0].snippet;
        const videoInfo = {
          title: video.title,
          thumbnail: video.thumbnails.maxres
            ? video.thumbnails.maxres.url
            : video.thumbnails.standard.url,
          published_at: video.publishedAt,
        };
        setVideoCache((prev) => ({ ...prev, [videoId]: videoInfo }));
        setVideoData(videoInfo);
      } catch (error) {
        console.error("Error fetching video data", error);
        toast({
          title: "Error",
          description: "Failed to fetch video data from YouTube.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [YOUTUBE_API_KEY, videoCache, toast]
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "youtube_url") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const videoId = getYouTubeVideoId(value);
      if (videoId) {
        await fetchVideoData(videoId);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const videoRef = collection(db, "videos");
      const videoUrlQuery = query(
        videoRef,
        where("youtube_url", "==", formData.youtube_url)
      );
      const videoTitleQuery = query(
        videoRef,
        where("title", "==", formData.title)
      );

      const [urlSnapshot, titleSnapshot] = await Promise.all([
        getDocs(videoUrlQuery),
        getDocs(videoTitleQuery),
      ]);

      if (!urlSnapshot.empty) {
        toast({
          title: "Error",
          description: "A video with this URL already exists.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!titleSnapshot.empty) {
        toast({
          title: "Error",
          description: "A video with this title already exists.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const publishedAtDate = new Date(formData.published_at);
      const publishedAtTimestamp = Timestamp.fromDate(publishedAtDate);

      await addDoc(videoRef, {
        ...formData,
        published_at: publishedAtTimestamp,
      });
      onSave();
      toast({
        title: "Success",
        description: "Video successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      resetFormData();
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error",
        description: "Failed to add video.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSelectPlaylists = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      playlists: selectedOptions.map((option) => option.value),
    }));
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const resetFormData = () => {
    setFormData({
      youtube_url: "",
      title: "",
      description: "",
      published_at: "",
      thumbnail: "",
      playlists: [],
    });
    setVideoData(null);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="red"
        rounded="none"
        py={5}
        size={{ base: "xs", md: "md" }}
        leftIcon={<BiPlus size="2em" />}
      >
        Add Videos
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetFormData();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Add New Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>YouTube URL</FormLabel>
              <Input
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleChange}
              />
            </FormControl>

            {videoData && (
              <>
                <FormControl mb={4}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Published At</FormLabel>
                  <Input
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Description (Max 300 characters)</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Please add custom description"
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }
                    }}
                    minHeight="200px"
                  />
                  <Box textAlign="right" fontSize="sm" color="gray.400">
                    {formData.description.length}/300
                  </Box>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Select Playlists</FormLabel>
                  <Select
                    isMulti
                    placeholder="Select playlists"
                    options={playlistOptions}
                    value={formData.playlists.map((id) => ({
                      value: id,
                      label: playlistsData.find((p) => p.id === id)?.name,
                    }))}
                    onChange={handleSelectPlaylists}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        borderColor: "gray.300",
                        borderWidth: 1,
                        borderRadius: "md",
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderColor: "gray.300",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#e7e7e7",
                        },
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#e7e7e7",
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: "black",
                        ":hover": {
                          backgroundColor: "red.500",
                          color: "white",
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        color: state.isSelected ? "black" : "black",
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                  />
                </FormControl>
                {videoData.thumbnail && (
                  <Box mt={4}>
                    <Image
                      src={videoData.thumbnail}
                      alt={videoData.title}
                      w="100%"
                    />
                  </Box>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              onClick={() => {
                resetFormData();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoModalForm;
