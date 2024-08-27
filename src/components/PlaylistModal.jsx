import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
  List,
  ListItem,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";

const PlaylistModal = ({ isOpen, onClose, video }) => {
  const episodes = [
    {
      id: 1,
      title: "Episode 1",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      id: 2,
      title: "Episode 2",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      id: 3,
      title: "Episode 3",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      id: 4,
      title: "Episode 4",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      id: 5,
      title: "Episode 5",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      id: 6,
      title: "Episode 6",
      thumbnailUrl: "https://via.placeholder.com/150x85",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "lg", md: "full" }}>
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
        <Box
          p={5}
          background="linear-gradient(to bottom, rgba(51, 51, 51, 0) 0%, rgba(51, 51, 51, 0.8) 100%)"
        >
          <Text color="white" textAlign="justify" size="sm">
            {video.desc}
          </Text>
          <Heading size="md" my={5}>
            Episode
          </Heading>
          <Box maxHeight="500px" overflowY="auto" className="custom-scroll">
            <List spacing={4}>
              {episodes.map((episode) => (
                <ListItem key={episode.id} color="white" mb={8}>
                  <Flex align="center">
                    <Image
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      aspectRatio="16/9"
                      objectFit="cover"
                      borderRadius="md"
                      mr={4}
                    />
                    <Box>
                      <Text fontWeight="bold" mb={1}>
                        {`Episode ${episode.id}`}
                      </Text>
                      <Text w="500px" textAlign="justify">
                        {episode.desc}
                      </Text>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </ModalContent>
      <style jsx>{`
        .custom-scroll {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .custom-scroll::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
    </Modal>
  );
};

export default PlaylistModal;
