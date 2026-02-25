"use client";

import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ShortsCard({ video, playlistId }) {
  const navigate = useNavigate();

  const publishedDate = video?.published_at?.seconds
    ? new Date(video.published_at.seconds * 1000)
    : video?.published_at
      ? new Date(video.published_at)
      : null;

  const handleClick = () => {
    navigate("/shorts", { state: { id: video.id } });
  };

  return (
    <div
      className="w-full cursor-pointer select-none rounded-xl p-0 md:p-2 transition-colors duration-200 hover:bg-neutral-700"
      onClick={handleClick}
    >
      {/* Thumbnail — rasio 9:16 untuk Shorts */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-black"
        style={{ aspectRatio: "9/16" }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 text-white">
            {video.title}
          </h3>
          {publishedDate && (
            <p className="text-xs text-neutral-300 mt-0.5">
              {formatDistanceStrict(publishedDate, new Date(), {
                addSuffix: true,
                locale: enUS,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
