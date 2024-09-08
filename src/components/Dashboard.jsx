import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Flex,
  StatHelpText,
  Text,
} from "@chakra-ui/react";
import { BiSolidPlaylist, BiSolidVideos } from "react-icons/bi";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = () => {
  const [videoCount, setVideoCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videosRef = collection(db, "videos");
    const playlistsRef = collection(db, "playlists");

    const unsubscribeVideos = onSnapshot(
      videosRef,
      (snapshot) => {
        setVideoCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    );

    const unsubscribePlaylists = onSnapshot(
      playlistsRef,
      (snapshot) => {
        setPlaylistCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching playlists:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeVideos();
      unsubscribePlaylists();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box mt={{ base: 12, md: 0 }}>
      <Heading mb={5}>
        <Text as="span" color="red">
          TWICEFLIX
        </Text>{" "}
        DASHBOARD
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
        <Link to="videos">
          <Card
            bg="gray.800"
            color="white"
            _hover={{ cursor: "pointer", bg: "gray.700", color: "red" }}
          >
            <CardBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stat textAlign="center">
                <StatLabel>
                  <Flex alignItems="center" gap={2} justify="center">
                    <BiSolidVideos size="4em" />
                  </Flex>
                </StatLabel>
                <StatNumber mt={2}>{videoCount}</StatNumber>
                <StatHelpText>
                  <Heading fontSize="xl" mt={2}>
                    Videos
                  </Heading>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Link>
        <Link to="playlists">
          <Card
            bg="gray.800"
            color="white"
            _hover={{ cursor: "pointer", bg: "gray.700", color: "red" }}
          >
            <CardBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stat textAlign="center">
                <StatLabel>
                  <Flex alignItems="center" gap={2} justify="center">
                    <BiSolidPlaylist size="4em" />
                  </Flex>
                </StatLabel>
                <StatNumber mt={2}>{playlistCount}</StatNumber>
                <StatHelpText>
                  <Heading fontSize="xl" mt={2}>
                    Playlists
                  </Heading>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Link>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
