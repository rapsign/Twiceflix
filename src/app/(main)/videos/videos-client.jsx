"use client";

// src/app/(main)/videos/VideosClient.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { throttle } from "lodash";
import VideoGrid from "@/app/(main)/videos/_components/VideoGrid";
import VideoFilterBar, {
  TAGS,
  matchesTag,
} from "@/app/(main)/videos/_components/VideoFilterBar";
import useDataManager from "@/hooks/useDataManager";
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

export default function VideosClient() {
  const { data: videoData = [], loading: loadingVideos } =
    useDataManager("youtube-video");
  const { data: shortData = [], loading: loadingShorts } =
    useDataManager("youtube-short");

  const loading = loadingVideos || loadingShorts;

  const [activeTag, setActiveTag] = useState("All");
  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shuffledShorts, setShuffledShorts] = useState([]);

  /* ===============================
     FILTER VIDEO (non-shorts)
  ================================ */
  const videos = useMemo(
    () => videoData.filter((v) => v.is_short === false),
    [videoData],
  );

  /* ===============================
     SHUFFLE SHORTS — pakai useEffect
     supaya localStorage aman dari SSR
  ================================ */
  useEffect(() => {
    if (!shortData.length) return;

    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsedIds = JSON.parse(savedOrder);
        const ordered = parsedIds
          .map((id) => shortData.find((s) => s.id === id))
          .filter(Boolean);
        const newItems = shortData.filter((s) => !parsedIds.includes(s.id));
        setShuffledShorts([...ordered, ...newItems]);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const shuffled = shuffleArray(shortData);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(shuffled.map((s) => s.id)),
    );
    setShuffledShorts(shuffled);
  }, [shortData]);

  /* ===============================
     FILTERED VIDEOS
     Shorts punya jalur sendiri — tidak campur di sini
  ================================ */
  const filteredVideos = useMemo(() => {
    if (activeTag === "Shorts") return shortData;
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
  }, [videos, shortData, activeTag]);

  /* ===============================
     FILTERED SHORTS
  ================================ */
  const filteredShorts = useMemo(() => {
    if (activeTag === "Oldest") {
      return [...shuffledShorts].sort(
        (a, b) =>
          new Date(a.published_at || a.publishedAt) -
          new Date(b.published_at || b.publishedAt),
      );
    }

    if (activeTag === "All" || activeTag === "Shorts") return shuffledShorts;

    const tag = TAGS.find((t) => t.label === activeTag);
    if (!tag || tag.keywords.length === 0) return shuffledShorts;

    const filtered = shuffledShorts.filter((v) =>
      matchesTag(v.title, tag.keywords),
    );
    return filtered.length > 0 ? filtered : shuffledShorts;
  }, [shuffledShorts, activeTag]);

  /* ===============================
     INFINITE SCROLL
  ================================ */
  const visibleVideos = useMemo(
    () => filteredVideos.slice(0, visibleCount),
    [filteredVideos, visibleCount],
  );
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
    if (scrollHeight - (scrollTop + clientHeight) < 500) {
      setIsLoadingMore(true);
      setVisibleCount((prev) =>
        Math.min(prev + VIDEOS_PER_PAGE, filteredVideos.length),
      );
      setTimeout(() => setIsLoadingMore(false), 300);
    }
  }, [isLoadingMore, hasMore, loading, filteredVideos.length]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 300, { trailing: true });
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      throttledScroll.cancel();
    };
  }, [handleScroll]);

  /* ===============================
     RENDER
  ================================ */
  if (loading) {
    return (
      <div className="bg-black min-h-screen md:pt-6 lg:pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-4 md:px-2 pt-8">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video bg-neutral-800 animate-pulse rounded-none md:rounded-lg" />
              <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="pt-14 bg-black min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">No videos available</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen lg:pt-14">
      <VideoFilterBar activeTag={activeTag} onTagChange={handleTagChange} />
      <VideoGrid
        videos={visibleVideos}
        shorts={filteredShorts}
        shortsLoading={loadingShorts}
        isShorts={activeTag === "Shorts"}
      />

      {filteredVideos.length === 0 && activeTag !== "Shorts" && (
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
  );
}
