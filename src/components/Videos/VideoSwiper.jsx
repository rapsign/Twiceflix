"use client";

import { useMemo } from "react";
import useDataManager from "../../../hooks/useDataManager";
import CustomSwiper from "../CustomSwiper";

const VideoSwiper = () => {
  const { data: videos = [], loading } = useDataManager("youtube_video");

  const randomVideos = useMemo(() => {
    const regularVideos = videos.filter((v) => v.is_short === false);
    if (regularVideos.length === 0) return [];

    try {
      const stored = sessionStorage.getItem("random_video_ids");
      if (stored) {
        const ids = JSON.parse(stored);
        const found = ids
          .map((id) => regularVideos.find((v) => v.id === id))
          .filter(Boolean);
        if (found.length >= 20) return found.slice(0, 20);
      }
    } catch (error) {
      console.warn("sessionStorage read error:", error);
      sessionStorage.removeItem("random_video_ids");
    }

    const shuffled = [...regularVideos].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 20);

    try {
      sessionStorage.setItem(
        "random_video_ids",
        JSON.stringify(selected.map((v) => v.id)),
      );
    } catch (error) {
      console.warn("sessionStorage write error:", error);
    }

    return selected;
  }, [videos]);

  if (loading) {
    return (
      <div className="bg-transparent text-white py-2 w-full z-50 ">
        <div className="px-4 mb-4 flex justify-between">
          <div className="h-6 w-48 bg-neutral-800 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
            <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:px-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`space-y-2 ${i > 0 ? "hidden sm:block" : ""}`}
            >
              <div className="aspect-video bg-neutral-800 lg:rounded-lg rounded-none animate-pulse" />
              <div className="px-2 space-y-2">
                <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (randomVideos.length === 0) return null;

  return (
    <div className="bg-transparent text-white py-2 w-full z-50">
      <CustomSwiper items={randomVideos} title="TWICE Videos" />
    </div>
  );
};

export default VideoSwiper;
