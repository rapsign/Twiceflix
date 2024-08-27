import { Box, Text, Button, Image, IconButton } from "@chakra-ui/react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";

const HeroSection = () => {
  return (
    <Box
      position="relative"
      color="white"
      height="100vh"
      width="100%" // Full viewport width
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
          src="https://i.ytimg.com/vi/M2fDbYeYHtE/maxresdefault.jpg"
          alt="Hero Background"
          objectFit="cover"
          width="100%"
          height="100%"
          opacity="0.6"
        />
        {/* Gradient overlay with darker bottom */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="linear-gradient(to top right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4))"
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
          fontSize="4xl"
          fontWeight="bold"
          mb={2}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
        >
          Featured Movie Title
        </Text>
        <Text fontSize="lg" mt={4} textShadow="1px 1px 2px rgba(0, 0, 0, 0.7)">
          This is a brief description of the featured movie. It's an
          action-packed thriller.
        </Text>
        <Button
          bgColor="white"
          color="black"
          width="100px"
          rounded="none"
          leftIcon={<FaPlay />}
          variant="solid"
          mt={6}
        >
          Play
        </Button>
        <Button
          leftIcon={<FaInfoCircle />}
          rounded="none"
          colorScheme="whiteAlpha"
          ml={2}
          mt={6}
        >
          More Info
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
