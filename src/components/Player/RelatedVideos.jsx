import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatPublishedDistance } from "@/utils/time";
import { Loader2 } from "lucide-react";
import { parseDuration } from "@/utils/videoHelpers";
import { IconTriangleFilled } from "@tabler/icons-react";

const INCREMENT = 20;

export default function RelatedVideos({ relatedVideos, playlistId = null }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INCREMENT);
  const [isLoading, setIsLoading] = useState(false);

  // Reset saat relatedVideos berubah (video baru dibuka)
  useEffect(() => {
    setVisibleCount(INCREMENT);
  }, [relatedVideos]);

  const handleScroll = useCallback(() => {
    if (isLoading || visibleCount >= relatedVideos.length) return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollBottom >= documentHeight - 300) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + INCREMENT, relatedVideos.length),
        );
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, visibleCount, relatedVideos.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="grid grid-cols-1 gap-3 px-0 md:grid-cols-3 md:px-4 lg:grid-cols-1 lg:px-0 pb-20 lg:pb-2">
      {relatedVideos.slice(0, visibleCount).map((v) => (
        <div
          key={v.id}
          className="flex cursor-pointer flex-col gap-2 lg:flex-row group"
          onClick={() => navigate(`/watch/${v.id}`, { state: { playlistId } })}
        >
          <div className="relative w-full lg:w-42 shrink-0">
            <div className="aspect-video bg-gray-900 overflow-hidden rounded-none md:rounded-lg relative">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <IconTriangleFilled className="rotate-90 text-white" />
              </div>
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-semibold z-10">
                {parseDuration(v.duration)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-2 md:px-0 flex-1 min-w-0">
            <p className="line-clamp-2 break-words text-sm font-medium">
              {v.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPublishedDistance(v.published_at)}
            </p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="col-span-full flex items-center justify-center py-4">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        </div>
      )}
    </div>
  );
}
