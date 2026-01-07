import React from "react";
import { cn } from "@/lib/utils"; // utility untuk className dinamis

export default function VideoGrid({ videos, onVideoClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {videos.map((video) => (
        <div
          key={video.id}
          className="relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => onVideoClick(video)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover "
          />

          {/* Overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 w-full p-2 flex items-center justify-center text-white",
              "bg-gradient-to-tr from-black/95 to-black/60",
              "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300"
            )}
          >
            <span className="text-xs text-center truncate" title={video.title}>
              {video.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
