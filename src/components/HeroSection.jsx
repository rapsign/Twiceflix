import React, { useState, useEffect } from "react";
import { Box, Text, Button, Image, useDisclosure } from "@chakra-ui/react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import LoadingSpinner from "./LoadingSpinner";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import VideoModal from "./VideoModal";

const HeroSection = () => {
  const [latestVideo, setLatestVideo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "videos"),
      orderBy("published_at", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const videoData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];

        if (videoData) {
          setLatestVideo(videoData);
        }
      },
      (error) => {
        console.error("Error fetching latest video:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!latestVideo) {
    return <LoadingSpinner />;
  }

  const handlePlayClick = () => {
    navigate(`/video-player`, {
      state: { youtubeUrl: latestVideo.youtube_url },
    });
  };

  const handleMoreInfoClick = () => {
    onOpen();
  };

  return (
    <Box
      position="relative"
      color="white"
      height="100vh"
      width="100%"
      overflow="hidden"
      bg="black"
    >
      <Box
        position="relative"
        width="100%"
        height="100%"
        overflow="hidden"
        bg="black"
      >
        <Image
          src={latestVideo.thumbnail}
          alt="Hero Background"
          objectFit="cover"
          width="100%"
          height="100%"
          opacity="0.6"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="linear-gradient(180deg, rgba(0,0,0,0) 9%, rgba(0,0,0,0.3841911764705882) 53%, rgba(0,0,0,1) 83%)"
          zIndex="1"
        />
      </Box>
      <Box
        position="absolute"
        bottom="50%"
        left="5%"
        maxWidth="500px"
        zIndex="2"
        p={4}
        borderRadius="md"
      >
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "4xl" }}
          fontWeight="bold"
          mb={2}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
        >
          {latestVideo.title}
        </Text>
        <Text
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          textAlign="justify"
          mt={4}
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.7)"
        >
          {latestVideo.description}
        </Text>
        <Button
          bgColor="white"
          color="black"
          size={{ base: "sm", md: "md", lg: "lg" }}
          rounded="none"
          leftIcon={<FaPlay />}
          variant="solid"
          mt={6}
          onClick={handlePlayClick}
        >
          Play
        </Button>
        <Button
          leftIcon={<FaInfoCircle />}
          rounded="none"
          colorScheme="whiteAlpha"
          ml={2}
          mt={6}
          size={{ base: "sm", md: "md", lg: "lg" }}
          onClick={handleMoreInfoClick}
        >
          More Info
        </Button>
      </Box>
      <VideoModal isOpen={isOpen} onClose={onClose} video={latestVideo} />
    </Box>
  );
};

export default HeroSection;
