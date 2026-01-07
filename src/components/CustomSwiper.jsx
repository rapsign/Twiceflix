"use client";

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
import { Badge } from "@/components/ui/badge";

export default function CustomSwiper({
  items,
  title,
  onItemClick,
  badgeLabel,
}) {
  return (
    <div className="w-full text-white relative z-10">
      {title && <h2 className="text-md md:text-2xl font-bold mb-2">{title}</h2>}

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
            <div
              className="relative cursor-pointer overflow-hidden rounded-lg group aspect-video"
              onClick={() => onItemClick(item)}
            >
              {badgeLabel && (
                <Badge className="absolute top-2 left-2 z-20 rounded-full bg-red-600 px-2 py-1 text-xs md:text-sm font-semibold">
                  {badgeLabel}
                </Badge>
              )}

              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 to-black/60 p-2 text-center text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
                {item.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
