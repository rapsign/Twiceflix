import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Repeat2, Shuffle } from "lucide-react";
import { IconTriangleFilled } from "@tabler/icons-react";
import { formatPublishedDistance } from "@/utils/time";
import { parseDuration } from "@/utils/videoHelpers";

export default function PlaylistPanel({
  activePlaylist,
  displayedPlaylistVideos,
  videoId,
  loopPlaylist,
  onToggleLoop,
  onToggleRandom,
  onToggleOrder,
  onVideoClick,
  getNextLabel,
  getNextVideoTitle,
  getVideoIndex,
}) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="playlist"
      className="hidden rounded-xl border border-neutral-800 lg:block mb-3"
    >
      <AccordionItem value="playlist">
        <AccordionTrigger
          className="bg-neutral-900 px-4 text-sm font-semibold data-[state=open]:rounded-none data-[state=open]:rounded-t-xl cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
            <div className="grid grid-rows-2 leading-none overflow-hidden">
              <p className="text-sm truncate font-normal">
                <span className="font-medium">
                  {getNextLabel(
                    displayedPlaylistVideos,
                    videoId,
                    loopPlaylist,
                    activePlaylist.title,
                  )}
                  :
                </span>{" "}
                {getNextVideoTitle(
                  displayedPlaylistVideos,
                  videoId,
                  loopPlaylist,
                  activePlaylist.title,
                )}
              </p>
              <span className="text-xs text-muted-foreground font-normal truncate text-left">
                {activePlaylist.title} •{" "}
                {getVideoIndex(videoId, displayedPlaylistVideos) + 1}/
                {displayedPlaylistVideos.length}
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="p-0">
          <div className="flex gap-2 p-2 bg-neutral-900">
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={onToggleLoop}
            >
              <Repeat2
                className={`w-8 h-8 transition-colors ${loopPlaylist ? "text-green-500" : "text-white"}`}
              />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={onToggleRandom}
            >
              <Shuffle className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={onToggleOrder}
            >
              <ArrowUpDown className="w-8 h-8" />
            </Button>
          </div>

          <div className="max-h-[calc((62vw-1rem)*9/16)] overflow-y-auto">
            {displayedPlaylistVideos.map((v) => {
              const isActive = String(v.id) === String(videoId);
              return (
                <div
                  key={v.id}
                  className={`flex cursor-pointer gap-2 p-2 ${isActive ? "bg-red-950" : "hover:bg-neutral-800"}`}
                  onClick={() => onVideoClick(v.id)}
                >
                  <div className="w-4 flex justify-center items-center">
                    {isActive && (
                      <IconTriangleFilled
                        size={10}
                        className="text-red-100 rotate-90"
                      />
                    )}
                  </div>
                  <div className="relative w-32 shrink-0">
                    <img
                      src={v.thumbnail}
                      className="w-full aspect-video rounded-lg object-cover"
                      alt={v.title}
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-semibold">
                      {parseDuration(v.duration)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="line-clamp-2 text-xs font-medium">
                      {v.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPublishedDistance(v.published_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
