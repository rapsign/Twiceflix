import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export default function VideoFilterBar({ activeTag, onTagChange }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div className="sticky top-12 z-10 bg-black backdrop-blur-sm py-3 relative flex items-center gap-2 px-2">
      {/* Tombol Prev */}
      <Button
        variant="icon"
        size="lg"
        onClick={handlePrev}
        disabled={isBeginning}
        className="shrink-0 z-20 disabled:opacity-30 p-6 rounded-full hover:bg-neutral-700"
      >
        <IconChevronLeft />
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
          spaceBetween={8}
        >
          {TAGS.map((tag, index) => (
            <SwiperSlide
              key={`${tag.label}-${index}`}
              style={{ width: "auto" }}
            >
              <Button
                onClick={() => onTagChange(tag.label)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
        className="shrink-0 z-20 disabled:opacity-30 p-6 rounded-full hover:bg-neutral-700"
      >
        <ChevronRight className="w-7 h-7" />
      </Button>
    </div>
  );
}
