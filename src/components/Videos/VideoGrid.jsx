import { Box, Grid, Image, Text } from "@chakra-ui/react";

const VideoGrid = ({ videos, onVideoClick }) => {
  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
        xl: "repeat(5, 1fr)",
      }}
      gap={2}
    >
      {videos.map((video) => (
        <Box
          key={video.id}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          aspectRatio="16/9"
          cursor="pointer"
          onClick={() => onVideoClick(video)}
          _hover={{
            "& .overlay": {
              opacity: 1,
              visibility: "visible",
            },
          }}
        >
          <Image
            src={video.thumbnail}
            alt={video.title}
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
              fontSize="xs"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              textAlign="center"
            >
              {video.title}
            </Text>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default VideoGrid;
