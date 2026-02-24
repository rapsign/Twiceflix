import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Repeat2,
  Shuffle,
  ChevronUp,
  ListVideo,
  X,
} from "lucide-react";
import { formatPublishedDistance } from "@/utils/time";

export default function PlaylistDrawer({
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
    <div className="fixed bottom-16 left-0 right-0 z-50 flex justify-center lg:hidden">
      <Drawer>
        <DrawerTrigger className="mx-auto w-[calc(100vw-2rem)] flex items-center justify-between bg-neutral-800/95 hover:bg-neutral-700 h-15 px-4 rounded-md">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
            <ListVideo size={24} />
            <div className="grid grid-rows-2 leading-none overflow-hidden">
              <p className="text-sm truncate font-normal text-left">
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
              <span className="text-xs text-muted-foreground truncate text-left">
                {activePlaylist.title} •{" "}
                {getVideoIndex(videoId, displayedPlaylistVideos) + 1}/
                {displayedPlaylistVideos.length}
              </span>
            </div>
            <ChevronUp size={24} />
          </div>
        </DrawerTrigger>

        <DrawerContent
          side="bottom"
          className="h-[calc(100vh-(100vw*9/16)-2.8rem)]"
        >
          <div className="flex items-center justify-between px-4 py-1 H-12">
            <DrawerTitle className="text-xl font-semibold">
              {activePlaylist.title} <br />
              <span className="text-xs text-muted-foreground truncate">
                {getVideoIndex(videoId, displayedPlaylistVideos) + 1}/
                {displayedPlaylistVideos.length}
              </span>
            </DrawerTitle>
            <DrawerClose>
              <X />
            </DrawerClose>
          </div>

          <div className="flex gap-2 px-2 border-b">
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10"
              onClick={onToggleLoop}
            >
              <Repeat2
                className={`w-8 h-8 transition-colors ${loopPlaylist ? "text-green-500" : "text-white"}`}
              />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10"
              onClick={onToggleRandom}
            >
              <Shuffle className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10"
              onClick={onToggleOrder}
            >
              <ArrowUpDown className="w-8 h-8" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-24rem)]">
            {displayedPlaylistVideos.map((v) => {
              const isActive = String(v.id) === String(videoId);
              return (
                <div
                  key={v.id}
                  className={`flex cursor-pointer gap-2 p-2 ${isActive ? "bg-red-950" : "hover:bg-neutral-800"}`}
                  onClick={() => onVideoClick(v.id)}
                >
                  <img
                    src={v.thumbnail}
                    className="w-40 aspect-video rounded-lg object-cover md:w-42"
                    alt={v.title}
                    loading="lazy"
                  />
                  <div className="flex flex-col justify-center px-2">
                    <p className="line-clamp-2 text-sm font-medium">
                      {v.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPublishedDistance(v.published_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
