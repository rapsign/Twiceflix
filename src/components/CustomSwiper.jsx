import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlaylistCard from "./Playlist/PlaylistCard";
import VideoCard from "./Videos/VideoCard";

export default function CustomSwiper({
  items,
  title,
  onItemClick,
  type = "video",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="w-full text-white relative group">
      {title && (
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-md md:text-xl lg:text-2xl font-bold">{title}</h2>

          <div className="flex gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
              ref={prevRef}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
              ref={nextRef}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={1}
        onSwiper={setSwiperInstance}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 3 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {type === "playlist" ? (
              <PlaylistCard playlist={item} onClick={onItemClick} />
            ) : (
              <VideoCard video={item} onClick={onItemClick} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
