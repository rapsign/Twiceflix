import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPublishedDistance } from "@/utils/time";
import { ScrollProgress } from "../ui/scroll-progress";
import { Loader2, Play, Triangle } from "lucide-react";
import { parseDuration } from "@/utils/videoHelpers";
import { IconTriangleFilled } from "@tabler/icons-react";

export default function RelatedVideos({ relatedVideos }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const INCREMENT = 20;

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (!isLoading && scrollBottom >= documentHeight) {
        setIsLoading(true);

        setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + INCREMENT, relatedVideos.length),
          );
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [relatedVideos, isLoading]);

  return (
    <div className="grid grid-cols-1 gap-3 px-0 md:grid-cols-3 md:px-4 lg:grid-cols-1 lg:px-0 pb-1">
      {relatedVideos.slice(0, visibleCount).map((v) => (
        <div
          key={v.id}
          className="flex cursor-pointer flex-col gap-2 lg:flex-row group"
          onClick={() => navigate(`/watch/${v.id}`)}
        >
          {/* Container dengan ukuran fixed */}
          <div className="relative w-full lg:w-42 shrink-0">
            {/* Inner wrapper untuk maintain aspect ratio */}
            <div className="aspect-video bg-gray-900 overflow-hidden rounded-none md:rounded-lg relative">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover overlay with play icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <IconTriangleFilled className="rotate-90  text-white" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-semibold z-10">
                {parseDuration(v.duration)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-2 md:px-0">
            <p className="line-clamp-2 text-sm font-medium ">{v.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatPublishedDistance(v.published_at)}
            </p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="col-span-full text-center items-center justify-center flex py-4 text-sm text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        </div>
      )}
    </div>
  );
}
