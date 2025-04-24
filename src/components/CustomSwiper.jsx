// components/CustomSwiper.js
import { Box, Text, Image, Badge } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CustomSwiper = ({ items, title, onItemClick, badgeLabel }) => {
  return (
    <Box bg="transparent" color="white" width="100%" zIndex={100}>
      {title && (
        <Text fontSize={{ base: "md", md: "2xl" }} fontWeight="bold" mb={2}>
          {title}
        </Text>
      )}

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={10}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1440: { slidesPerView: 5 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Box
              overflow="hidden"
              borderRadius="lg"
              _hover={{ bg: "gray.800" }}
              position="relative"
              aspectRatio="16/9"
              onClick={() => onItemClick(item)}
              cursor="pointer"
            >
              {badgeLabel && (
                <Badge
                  position="absolute"
                  borderEndRadius="lg"
                  top={2}
                  left={0}
                  backgroundColor="red"
                  color="white"
                  px={{ base: 2, md: 3 }}
                  py={{ base: 1, md: 1 }}
                  fontSize={{ base: "10px", md: "sm" }}
                  fontWeight="bold"
                  zIndex={2}
                >
                  {badgeLabel}
                </Badge>
              )}

              <Image
                src={item.thumbnail}
                alt={item.title}
                objectFit="cover"
                width="100%"
                height="100%"
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                width="100%"
                bg="linear-gradient(to top right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6))"
                p={2}
                color="white"
                opacity={0}
                visibility="hidden"
                transition="opacity 0.3s ease, visibility 0.3s ease"
                _groupHover={{ opacity: 1, visibility: "visible" }}
              >
                <Text isTruncated fontSize="sm" textAlign="center">
                  {item.title}
                </Text>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default CustomSwiper;
