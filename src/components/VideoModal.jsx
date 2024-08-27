// src/components/VideoModal.jsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
  Link,
  Heading,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";

const PlaylistModal = ({ isOpen, onClose, video }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "lg", md: "xl" }}>
      <ModalOverlay />
      <ModalContent
        bg="#333333"
        position="relative"
        borderRadius="none"
        maxWidth={{ base: "auto", md: "800px" }}
        margin="auto"
      >
        <ModalCloseButton zIndex={100} size="xl" />
        <Box position="relative" width="100%" height="400px" overflow="hidden">
          <Image
            src={video.imageUrl}
            alt={video.title}
            objectFit="cover"
            width="100%"
            height="100%"
            rounded="none"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="50%"
            background="linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
          />
          <Box position="absolute" top="70%" px={5} color="white">
            <Heading size="lg">{video.title}</Heading>
            <Button
              bgColor="white"
              color="black"
              width="100px"
              rounded="none"
              leftIcon={<FaPlay />}
              variant="solid"
              mt={2}
            >
              Play
            </Button>
          </Box>
        </Box>
        <Grid
          templateColumns={{ base: "1", md: "repeat(3, 1fr)" }}
          gap={5}
          p={5}
        >
          <GridItem colSpan={2}>
            <Box>
              <Text color="white" textAlign="justify" size="sm">
                {video.desc}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box>
              <Flex align="center" mb={2}>
                <Text color="gray.500">Playlist : </Text>
                <Link ml={2}>Crime Scene</Link>
              </Flex>
              <Flex align="center">
                <Text color="gray.500">Category : </Text>
                <Link ml={2}>Time To Twice</Link>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      </ModalContent>
    </Modal>
  );
};

export default PlaylistModal;
