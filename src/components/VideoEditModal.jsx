import React, { useState, useEffect, useCallback } from "react";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Select from "react-select";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import moment from "moment";

const VideoEditModal = ({ isOpen, onClose, video, onSave }) => {
  const [formData, setFormData] = useState({
    youtube_url: "",
    title: "",
    description: "",
    published_at: "",
    thumbnail: "",
    playlists: [],
  });
  const [playlistOptions, setPlaylistOptions] = useState([]);
  const [videoCache, setVideoCache] = useState({});
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const toast = useToast();

  useEffect(() => {
    if (video) {
      setFormData({
        youtube_url: video.youtube_url || "",
        title: video.title || "",
        description: video.description || "",
        published_at:
          moment(video.published_at.toDate()).format("YYYY-MM-DD") || "",
        thumbnail: video.thumbnail || "",
        playlists: video.playlists || [],
      });
    }
  }, [video]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playlists"));
        const playlists = querySnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().name,
        }));
        setPlaylistOptions(playlists);
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

  const fetchVideoData = useCallback(
    async (videoId) => {
      if (videoCache[videoId]) {
        const cachedVideo = videoCache[videoId];
        setFormData((prev) => ({
          ...prev,
          title: cachedVideo.title,
          published_at: moment(cachedVideo.published_at).format("YYYY-MM-DD"),
          thumbnail: cachedVideo.thumbnail,
        }));
        return;
      }

      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
        );
        const snippet = data.items[0]?.snippet;
        if (snippet) {
          const videoInfo = {
            title: snippet.title,
            thumbnail:
              snippet.thumbnails.maxres?.url || snippet.thumbnails.standard.url,
            published_at: snippet.publishedAt,
          };
          setVideoCache((prev) => ({ ...prev, [videoId]: videoInfo }));
          setFormData((prev) => ({
            ...prev,
            title: snippet.title,
            published_at: moment(snippet.publishedAt).format("YYYY-MM-DD"),
            thumbnail: videoInfo.thumbnail,
          }));
        }
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "youtube_url") {
      const videoId = getYouTubeVideoId(value);
      if (videoId) {
        await fetchVideoData(videoId);
      } else {
        setFormData((prev) => ({
          ...prev,
          title: "",
          published_at: "",
          thumbnail: "",
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      const videosCollectionRef = collection(db, "videos");
      const videoUrlQuery = query(
        videosCollectionRef,
        where("youtube_url", "==", formData.youtube_url),
        where("__name__", "!=", video.id)
      );
      const videoTitleQuery = query(
        videosCollectionRef,
        where("title", "==", formData.title),
        where("__name__", "!=", video.id)
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

      const publishedAtTimestamp = Timestamp.fromDate(
        new Date(formData.published_at)
      );
      await updateDoc(doc(db, "videos", video.id), {
        ...formData,
        published_at: publishedAtTimestamp,
      });
      onSave();
      toast({
        title: "Success",
        description: "Video successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "Error",
        description: "Failed to update video.",
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Edit Video</ModalHeader>
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
          {formData.youtube_url && (
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
                  value={playlistOptions.filter((option) =>
                    formData.playlists.includes(option.value)
                  )}
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
              {formData.thumbnail && (
                <Box mt={4}>
                  <Image
                    src={formData.thumbnail}
                    alt={formData.title}
                    w="100%"
                  />
                </Box>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" ml={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VideoEditModal;
