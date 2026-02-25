import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { IconChevronLeft } from "@tabler/icons-react";

const TAGS = [
  { label: "All", keywords: [] },
  { label: "Oldest", keywords: ["__OLDEST__"] },
  { label: "Music Video", keywords: ["MV", "Music Video", "M/V"] },
  { label: "Live Performance", keywords: ["Live", "Concert", "Tour", "Stage"] },
  {
    label: "Dance Practice",
    keywords: ["Dance Practice", "Dance Ver", "Choreography"],
  },
  { label: "Nayeon", keywords: ["Nayeon", "나연"] },
  { label: "Jeongyeon", keywords: ["Jeongyeon", "정연"] },
  { label: "Momo", keywords: ["Momo", "모모"] },
  { label: "Sana", keywords: ["Sana", "사나"] },
  { label: "Jihyo", keywords: ["Jihyo", "지효"] },
  { label: "Mina", keywords: ["Mina", "미나"] },
  { label: "Dahyun", keywords: ["Dahyun", "다현"] },
  { label: "Chaeyoung", keywords: ["Chaeyoung", "채영"] },
  { label: "Tzuyu", keywords: ["Tzuyu", "쯔위"] },
  {
    label: "Behind The Scene",
    keywords: ["BTS", "Behind", "Making", "Backstage"],
  },
  {
    label: "Variety / Reality",
    keywords: ["TWICE TV", "Variety", "Reality", "Episode"],
  },
  { label: "Teaser", keywords: ["Teaser", "Highlight", "Spoiler"] },
  { label: "Challenge", keywords: ["Challenge"] },
  { label: "Japan", keywords: ["Japan", "Japanese", "JP Ver", "JP.ver"] },
];

export function matchesTag(title = "", keywords = []) {
  if (keywords.length === 0) return true;
  const lower = title.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export { TAGS };

// Hook untuk mendeteksi arah scroll
function useScrollDirection(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY.current;

          if (Math.abs(diff) >= threshold) {
            // Scroll ke bawah → hidden, scroll ke atas → tampil
            setVisible(diff < 0 || currentScrollY < threshold);
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return visible;
}

export default function VideoFilterBar({ activeTag, onTagChange }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const isVisible = useScrollDirection(10);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div
      className={`sticky z-10 bg-black backdrop-blur-sm py-2 sm:py-3 flex items-center gap-1 sm:gap-2 px-1 sm:px-2
    transition-all duration-300 ease-in-out
    ${!isVisible ? "top-0 -translate-y-full sm:translate-y-0 sm:top-14" : "top-14 translate-y-0"}`}
    >
      {/* Tombol Prev */}
      <Button
        variant="icon"
        size="lg"
        onClick={handlePrev}
        disabled={isBeginning}
        className={`hidden sm:flex shrink-0 z-20 p-4 sm:p-6 rounded-full hover:bg-neutral-700
    ${isBeginning ? "invisible" : ""}`}
      >
        <IconChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
      </Button>

      {/* Swiper */}
      <div className="flex-1 overflow-hidden">
        <Swiper
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onReachBeginning={() => setIsBeginning(true)}
          onReachEnd={() => setIsEnd(true)}
          onFromEdge={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          slidesPerView="auto"
          spaceBetween={6}
        >
          {TAGS.map((tag, index) => (
            <SwiperSlide
              key={`${tag.label}-${index}`}
              style={{ width: "auto" }}
            >
              <Button
                onClick={() => onTagChange(tag.label)}
                className={`px-4 py-1  rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTag === tag.label
                    ? "bg-white text-black hover:bg-white/80"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tag.label}
              </Button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tombol Next */}
      <Button
        variant="icon"
        size="lg"
        onClick={handleNext}
        disabled={isEnd}
        className={`hidden sm:flex shrink-0 z-20 p-4 sm:p-6 rounded-full hover:bg-neutral-700
    ${isEnd ? "invisible" : ""}`}
      >
        <ChevronRight className="w-5 h-5 sm:w-10 sm:h-10" />
      </Button>
    </div>
  );
}
