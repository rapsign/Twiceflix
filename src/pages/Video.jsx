"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import VideoGrid from "../components/Videos/VideoGrid";
import VideoFilterBar, {
  TAGS,
  matchesTag,
} from "../components/Videos/VideoFilterBar";
import useDataManager from "../../hooks/useDataManager";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const VIDEOS_PER_PAGE = 30;
const STORAGE_KEY = "twiceflix_shorted_shorts_order";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Videos() {
  const { data: videoData = [], loading: loadingVideos } =
    useDataManager("youtube_video");
  const { data: shortData = [], loading: loadingShorts } =
    useDataManager("youtube_short");

  const loading = loadingVideos || loadingShorts;

  const [activeTag, setActiveTag] = useState("All");
  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const videos = useMemo(() => {
    return videoData.filter((v) => v.is_short === false);
  }, [videoData]);

  // === SHORTS ORDER FROM LOCAL STORAGE ===
  const shuffledShorts = useMemo(() => {
    if (typeof window === "undefined") return shortData;
    if (!shortData.length) return shortData;

    const savedOrder = localStorage.getItem(STORAGE_KEY);

    if (savedOrder) {
      try {
        const parsedIds = JSON.parse(savedOrder);

        const ordered = parsedIds
          .map((id) => shortData.find((s) => s.id === id))
          .filter(Boolean);

        const newItems = shortData.filter((s) => !parsedIds.includes(s.id));

        return [...ordered, ...newItems];
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const shuffled = shuffleArray(shortData);
    const idsOnly = shuffled.map((s) => s.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idsOnly));
    return shuffled;
  }, [shortData]);

  const filteredVideos = useMemo(() => {
    if (activeTag === "Oldest") {
      return [...videos].sort(
        (a, b) =>
          new Date(a.published_at || a.publishedAt) -
          new Date(b.published_at || b.publishedAt),
      );
    }

    const tag = TAGS.find((t) => t.label === activeTag);
    if (!tag || tag.keywords.length === 0) return videos;

    return videos.filter((v) => matchesTag(v.title, tag.keywords));
  }, [videos, activeTag]);

  const filteredShorts = useMemo(() => {
    let result = shuffledShorts;

    if (activeTag !== "All" && activeTag !== "Oldest") {
      const tag = TAGS.find((t) => t.label === activeTag);
      if (tag && tag.keywords.length > 0) {
        const filtered = shuffledShorts.filter((v) =>
          matchesTag(v.title, tag.keywords),
        );
        result = filtered.length > 0 ? filtered : shuffledShorts;
      }
    }

    if (activeTag === "Oldest") {
      return [...result].sort(
        (a, b) =>
          new Date(a.published_at || a.publishedAt) -
          new Date(b.published_at || b.publishedAt),
      );
    }

    return result;
  }, [shuffledShorts, activeTag]);

  const visibleVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleCount);
  }, [filteredVideos, visibleCount]);

  const hasMore = visibleCount < filteredVideos.length;

  const handleTagChange = (label) => {
    setActiveTag(label);
    setVisibleCount(VIDEOS_PER_PAGE);
    window.scrollTo({ top: 0 });
  };

  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore || loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceToBottom < 500) {
      setIsLoadingMore(true);
      setVisibleCount((prev) =>
        Math.min(prev + VIDEOS_PER_PAGE, filteredVideos.length),
      );
      setTimeout(() => setIsLoadingMore(false), 300);
    }
  }, [isLoadingMore, hasMore, loading, filteredVideos.length]);

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

  const metaData = useMemo(
    () => ({
      title: `Videos - TWICEFLIX`,
      description: `Watch the latest TWICE music videos, performances, and more. Explore our collection of ${videos.length} videos.`,
    }),
    [videos.length],
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Videos - TWICEFLIX</title>
          <meta name="description" content="Loading TWICE videos..." />
        </Helmet>

        <div className="bg-black min-h-screen md:pt-6 lg:pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 lg:px-2 pt-8">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-neutral-800 animate-pulse rounded-none md:rounded-lg" />
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

        <div className="pt-14 bg-black min-h-screen flex items-center justify-center">
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

      <div className="bg-black min-h-screen lg:pt-14">
        <VideoFilterBar activeTag={activeTag} onTagChange={handleTagChange} />

        <VideoGrid
          videos={visibleVideos}
          shorts={filteredShorts}
          shortsLoading={loadingShorts}
        />

        {filteredVideos.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-lg">
              No videos found for "{activeTag}"
            </p>
          </div>
        )}

        {isLoadingMore && hasMore && (
          <div className="w-full py-8 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          </div>
        )}
      </div>
    </>
  );
}
