"use client";

import { useMemo } from "react";
import useDataManager from "../../hooks/useDataManager";
import CustomSwiper from "../CustomSwiper";

const VideoSwiper = () => {
  const { data: videos } = useDataManager("youtube_video");

  const randomVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    const stored = sessionStorage.getItem("random_video_ids");

    if (stored) {
      const ids = JSON.parse(stored);
      return ids
        .map((id) => videos.find((v) => v.id === id))
        .filter(Boolean)
        .slice(0, 20);
    }

    const shuffled = [...videos].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 20);

    sessionStorage.setItem(
      "random_video_ids",
      JSON.stringify(selected.map((v) => v.id)),
    );

    return selected;
  }, [videos]);

  return (
    <div className="bg-transparent text-white py-2 w-full z-50">
      <CustomSwiper items={randomVideos} title="TWICE Videos" />
    </div>
  );
};

export default VideoSwiper;
