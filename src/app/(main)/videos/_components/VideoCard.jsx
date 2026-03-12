"use client";

import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { parseDuration } from "@/utils/videoHelpers";
import { Badge } from "../../../../components/ui/badge";

export default function VideoCard({ video, playlistId }) {
  const router = useRouter();

  const publishedDate = video?.published_at?.seconds
    ? new Date(video.published_at.seconds * 1000)
    : video?.published_at
      ? new Date(video.published_at)
      : null;

  const isNew = publishedDate
    ? (new Date() - publishedDate) / (1000 * 60 * 60 * 24) <= 7
    : false;

  const handleClick = () => {
    const url = playlistId
      ? `/watch?tv=${video.id}&tl=${playlistId}`
      : `/watch?tv=${video.id}`;
    router.push(url);
  };

  const durationFormatted = parseDuration(video.duration);

  return (
    <div
      className="w-full cursor-pointer select-none rounded-xl p-0 md:p-2 transition-colors duration-200 hover:bg-neutral-700"
      onClick={handleClick}
    >
      <div className="relative aspect-video w-full rounded-none md:rounded-xl overflow-hidden bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {isNew && (
          <Badge className="absolute top-2 left-2 rounded-sm bg-black/60 text-white hover:bg-black/60">
            NEW
          </Badge>
        )}
        {durationFormatted && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 bg-black/80 text-white rounded">
            {durationFormatted}
          </span>
        )}
      </div>
      <div className="px-2 mt-2 min-h-18 md:min-h-12 flex flex-col">
        <h3
          className="text-sm font-medium leading-snug line-clamp-2"
          title={video.title}
        >
          {video.title}
        </h3>
        <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-1">
          {publishedDate && (
            <span>
              {formatDistanceStrict(publishedDate, new Date(), {
                addSuffix: true,
                locale: enUS,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
