"use client";

import { useState, useRef, useEffect } from "react";
import VideoGrid from "../components/Videos/VideoGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import useDataManager from "../hooks/useDataManager";

export default function Videos() {
  const { data: videos, loading, error } = useDataManager("youtube_video");
  const [visibleCount, setVisibleCount] = useState(30);
  const loadMoreRef = useRef(null);
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || !videos || visibleCount >= videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 30, videos.length));
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, videos]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="pt-0 md:pt-18 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">Failed to load videos</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="pt-0 md:pt-18 bg-black min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">No videos available</p>
      </div>
    );
  }

  const visibleVideos = videos.slice(0, visibleCount);

  return (
    <div className="pt-0 md:pt-18 bg-black min-h-screen">
      <VideoGrid videos={visibleVideos} />

      {/* Loading trigger */}
      {visibleCount < videos.length && (
        <div ref={loadMoreRef} className="w-full py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* End message */}
      {visibleCount >= videos.length && videos.length > 20 && (
        <div className="w-full py-8 text-center text-gray-500">
          All {videos.length} videos loaded
        </div>
      )}
    </div>
  );
}
