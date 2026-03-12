"use client";

import { useMemo, useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import ShortsGrid from "../../shorts/_components/ShortsGrid";

const CHUNK_SIZE = 6;

function useResponsiveCount() {
  const [count, setCount] = useState(6);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(6);
      else if (w >= 768) setCount(3);
      else if (w >= 640) setCount(4);
      else setCount(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function VideoGrid({
  videos = [],
  onVideoClick,
  shorts = [],
  shortsLoading = false,
  isShorts = false,
}) {
  const shortsCount = useResponsiveCount();

  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < videos.length; i += CHUNK_SIZE) {
      result.push(videos.slice(i, i + CHUNK_SIZE));
    }
    return result;
  }, [videos]);

  if (isShorts) {
    return (
      <div className="py-4">
        <ShortsGrid
          shorts={videos}
          seed={0}
          count={videos.length}
          loading={shortsLoading}
          disableShuffle={true}
        />
      </div>
    );
  }

  return (
    <div>
      {chunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3">
            {chunk.map((video, index) => (
              <VideoCard
                key={`${video.id}-${index}`}
                video={video}
                onClick={onVideoClick}
              />
            ))}
          </div>

          {chunk.length === CHUNK_SIZE && (
            <div className="py-4">
              <ShortsGrid
                shorts={shorts}
                seed={chunkIndex}
                count={shortsCount}
                loading={shortsLoading}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
