"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import VideoGrid from "../components/Videos/VideoGrid";
import useDataManager from "../../hooks/useDataManager";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const VIDEOS_PER_PAGE = 30;

export default function Videos() {
  const { data: allData = [], loading } = useDataManager("youtube_video");

  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false); // FIX

  const videos = useMemo(() => {
    return allData.filter((v) => v.is_short === false);
  }, [allData]);

  const visibleVideos = useMemo(() => {
    return videos.slice(0, visibleCount);
  }, [videos, visibleCount]);

  const hasMore = visibleCount < videos.length;

  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore || loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    setShowScrollTop(scrollTop > 500);

    if (distanceToBottom < 500) {
      setIsLoadingMore(true);
      setVisibleCount((prev) =>
        Math.min(prev + VIDEOS_PER_PAGE, videos.length),
      );
      setTimeout(() => setIsLoadingMore(false), 300);
    }
  }, [isLoadingMore, hasMore, loading, videos.length]);

  useEffect(() => {
    let timeoutId = null;
    let lastExecuted = 0;
    const THROTTLE_DELAY = 300;

    const throttledScroll = () => {
      const now = Date.now();
      if (timeoutId) clearTimeout(timeoutId);

      if (now - lastExecuted < THROTTLE_DELAY) {
        timeoutId = setTimeout(() => {
          lastExecuted = Date.now();
          handleScroll();
        }, THROTTLE_DELAY);
      } else {
        lastExecuted = now;
        handleScroll();
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  const metaData = useMemo(() => {
    return {
      title: `Videos - TWICEFLIX`,
      description: `Watch the latest TWICE music videos, performances, and more. Explore our collection of ${videos.length} videos.`,
    };
  }, [videos.length]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Videos - TWICEFLIX</title>
          <meta name="description" content="Loading TWICE videos..." />
        </Helmet>
        <div className="pt-0 md:pt-18 bg-black min-h-screen pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-neutral-800  animate-pulse rounded-none md:rounded-lg" />
                <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (videos.length === 0) {
    return (
      <>
        <Helmet>
          <title>No Videos - TWICEFLIX</title>
          <meta name="description" content="No videos available" />
        </Helmet>
        <div className="pt-0 md:pt-18 bg-black min-h-screen flex items-center justify-center">
          <p className="text-gray-400 text-xl">No videos available</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
      </Helmet>

      <div className="pt-0 md:pt-18 bg-black min-h-screen pb-2">
        <VideoGrid videos={visibleVideos} />

        {isLoadingMore && hasMore && (
          <div className="w-full py-8 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          </div>
        )}
      </div>
    </>
  );
}
