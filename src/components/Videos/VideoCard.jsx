"use client";

import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  const publishedDate = video?.published_at?.seconds
    ? new Date(video.published_at.seconds * 1000)
    : null;

  const handleClick = () => {
    navigate(`/watch/${video.id}`);
  };

  return (
    <div
      className="w-full cursor-pointer select-none rounded-xl p-0 md:p-2 transition-colors duration-200 hover:bg-neutral-700"
      onClick={handleClick}
    >
      <div className="relative aspect-video w-full   rounded-none md:rounded-xl overflow-hidden bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {video.duration && (
          <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-black/80 text-white rounded">
            {video.duration}
          </span>
        )}
      </div>

      <div className="px-2 mt-2 min-h-20 md:min-h-12 flex flex-col">
        <h3
          className="text-sm font-medium leading-snug line-clamp-2"
          title={video.title}
        >
          {video.title}
        </h3>

        {publishedDate && (
          <p className="text-xs text-neutral-400 mt-0.5">
            {formatDistanceStrict(publishedDate, new Date(), {
              addSuffix: true,
              locale: enUS,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
