import React from "react";
import { Box, Image } from "@chakra-ui/react";

const HeroBackground = ({ thumbnail }) => (
  <Box
    position="relative"
    width="100%"
    height="100%"
    overflow="hidden"
    bg="black"
  >
    <Image
      src={thumbnail}
      alt="Hero Background"
      objectFit="cover"
      width="100%"
      height="100%"
      opacity="0.5"
    />
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="linear-gradient(180deg, rgba(0,0,0,0) 9%, rgba(0,0,0,0.38) 53%, rgba(0,0,0,1) 83%)"
      zIndex="1"
    />
  </Box>
);

export default HeroBackground;
