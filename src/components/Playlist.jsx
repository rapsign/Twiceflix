import { Box, Image, Text } from "@chakra-ui/react";
import Slider from "react-slick";

const Playlist = () => {
  const videos = [
    {
      id: 1,
      title: "Video 1",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 2,
      title: "Video 2",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 3,
      title: "Video 3",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 4,
      title: "Video 4",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 5,
      title: "Video 5",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 6,
      title: "Video 6",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 7,
      title: "Video 7",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
    {
      id: 8,
      title: "Video 8",
      imageUrl: "https://via.placeholder.com/720x1280",
    },
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <Box bg="transparent" color="white" py={4} width="100%" px={5}>
      <Text fontSize="2xl" fontWeight="bold" my={4}>
        TWICE Playlist
      </Text>
      <Slider {...settings}>
        {videos.map((video) => (
          <Box
            key={video.id}
            borderRadius="md"
            overflow="hidden"
            _hover={{ bg: "gray.800" }}
            transition="background-color 0.3s ease"
            border="1px solid rgba(255, 255, 255, 0.1)"
            position="relative"
            aspectRatio="16/9"
            transform="translateY(-10px)"
          >
            <Image
              src={video.imageUrl}
              alt={video.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Playlist;
