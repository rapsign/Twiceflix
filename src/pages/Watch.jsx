"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import NProgress from "nprogress";
import {
  ArrowUpDown,
  Repeat2,
  Shuffle,
  ChevronUp,
  X,
  ListVideo,
} from "lucide-react";
import { IconTriangleFilled } from "@tabler/icons-react";
import { getRelatedVideos } from "@/utils/relatedVideos";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import useDataManager from "@/hooks/useDataManager";
import useYouTubeEndListener from "@/hooks/useYouTubeEndListener";
import RelatedVideos from "@/components/Player/RelatedVideos";
import { formatPublishedDistance } from "@/utils/time";
import { textDecoration } from "@chakra-ui/react";
import { parseDuration } from "@/utils/videoHelpers";

const FLOAT_BREAKPOINT = 1024;
const FLOAT_OFFSET_TOP = 56;

export default function Watch() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const playlistId = location.state?.playlistId ?? null;

  const [isFloating, setIsFloating] = useState(false);
  const [playedIds, setPlayedIds] = useState(new Set());
  const [loopPlaylist, setLoopPlaylist] = useState(false);
  const [randomPlaylist, setRandomPlaylist] = useState(false);
  const [displayedPlaylistVideos, setDisplayedPlaylistVideos] = useState([]);

  const { data: videos = [], loading } = useDataManager("youtube_video");
  const { data: playlists = [] } = useDataManager("youtube_playlist");

  const video = useMemo(
    () => videos.find((v) => String(v.id) === String(videoId)),
    [videos, videoId],
  );

  const youtubeId = useMemo(() => {
    if (!video?.youtube_url) return null;
    const match = video.youtube_url.match(
      /^.*(youtu\.be\/|v\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/,
    );
    return match?.[2] ?? null;
  }, [video]);

  const activePlaylist = useMemo(() => {
    if (!playlistId) return null;
    const p = playlists.find((p) => p.id === playlistId);
    if (!p) return null;
    return {
      ...p,
      videos: p.videos || videos.filter((v) => v.playlists?.includes(p.id)),
    };
  }, [playlistId, playlists, videos]);

  useEffect(() => {
    if (activePlaylist) {
      setDisplayedPlaylistVideos([...activePlaylist.videos]);
      setRandomPlaylist(false);
      setLoopPlaylist(false);
    }
  }, [activePlaylist]);

  const iframeRef = useYouTubeEndListener(youtubeId, () => {
    if (!activePlaylist || !displayedPlaylistVideos.length) {
      if (relatedVideos.length > 0) navigate(`/watch/${relatedVideos[0].id}`);
      return;
    }

    const currentIndex = displayedPlaylistVideos.findIndex(
      (v) => String(v.id) === String(videoId),
    );
    let nextIndex = currentIndex + 1;

    if (randomPlaylist)
      nextIndex = Math.floor(Math.random() * displayedPlaylistVideos.length);
    else if (loopPlaylist && nextIndex >= displayedPlaylistVideos.length)
      nextIndex = 0;

    const nextVideo = displayedPlaylistVideos[nextIndex];
    if (nextVideo)
      navigate(`/watch/${nextVideo.id}`, {
        state: { playlistId: activePlaylist.id },
      });
    else if (!loopPlaylist && relatedVideos.length > 0)
      navigate(`/watch/${relatedVideos[0].id}`);
  });

  useEffect(() => {
    if (!video) return;
    setPlayedIds((prev) => new Set(prev).add(String(video.id)));
  }, [video]);

  const relatedVideos = useMemo(() => {
    if (!video) return [];
    const related = getRelatedVideos({
      currentVideo: video,
      videos,
      similarityThreshold: 0.3,
    });
    const activePlaylistIds =
      activePlaylist?.videos.map((v) => String(v.id)) || [];
    return related.filter(
      (v) =>
        !playedIds.has(String(v.id)) &&
        !activePlaylistIds.includes(String(v.id)),
    );
  }, [video, videos, playedIds, activePlaylist]);

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 400);
    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [videoId]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= FLOAT_BREAKPOINT || !iframeRef.current) return;
      const top = iframeRef.current.getBoundingClientRect().top;
      setIsFloating(top <= FLOAT_OFFSET_TOP);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [iframeRef]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= FLOAT_BREAKPOINT) setIsFloating(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleLoopPlaylist = () => setLoopPlaylist((prev) => !prev);

  const toggleRandomPlaylist = () => {
    if (!activePlaylist) return;
    setRandomPlaylist((prev) => {
      const newRandom = !prev;
      const newOrder = newRandom
        ? [...activePlaylist.videos].sort(() => Math.random() - 0.5)
        : [...activePlaylist.videos];
      setDisplayedPlaylistVideos(newOrder);
      if (newOrder.length > 0)
        navigate(`/watch/${newOrder[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      return newRandom;
    });
  };

  const togglePlaylistOrder = () => {
    if (!activePlaylist) return;
    setDisplayedPlaylistVideos((prev) => {
      const reversed = [...prev].reverse();
      if (reversed.length > 0)
        navigate(`/watch/${reversed[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      return reversed;
    });
  };

  const getNextLabel = (videos, currentVideoId, isLooping, playlistTitle) => {
    const idx = videos.findIndex(
      (v) => String(v.id) === String(currentVideoId),
    );
    const isLastVideo = idx !== -1 && idx + 1 >= videos.length;

    return isLastVideo && !isLooping ? playlistTitle : "Next";
  };

  const getNextVideoTitle = (
    videos,
    currentVideoId,
    isLooping,
    playlistTitle,
  ) => {
    const idx = videos.findIndex(
      (v) => String(v.id) === String(currentVideoId),
    );

    if (idx === -1) return "–";

    if (idx + 1 >= videos.length) {
      if (isLooping && videos.length > 0) {
        return videos[0].title;
      }
      return `End of ${playlistTitle}`;
    }

    return videos[idx + 1].title;
  };
  const getVideoIndex = (currentVideoId, videos) => {
    if (!Array.isArray(videos)) return -1;
    return videos.findIndex((v) => String(v.id) === String(currentVideoId));
  };

  useEffect(() => {
    if (!loading) NProgress.done();
  }, [loading]);

  if (loading) return null;
  if (!video) return <Navigate to="/" replace />;

  return (
    <div className="mb-2 bg-black px-0 md:pt-12 lg:px-2 lg:pt-18">
      <div className="grid grid-cols-1 gap-4 px-0 lg:grid-cols-12 lg:px-2">
        <div className="lg:col-span-9 self-start space-y-4">
          <div className="relative aspect-video">
            <div
              ref={iframeRef}
              className={`rounded-none lg:rounded-xl transition-all duration-300  ${
                isFloating
                  ? "fixed left-0 right-0 top-13 z-50 w-full max-h-[25vh] shadow-lg lg:static lg:max-h-full px-0 "
                  : "h-full w-full "
              }`}
            />
          </div>

          {/* Spacer untuk prevent layout jump */}
          {isFloating && <div className=" lg:hidden" />}

          <div className="px-4 -mt-3 lg:mt-0 lg:px-2">
            <h1 className="text-base md:text-lg lg:text-xl font-semibold">
              {video.title}
            </h1>
          </div>

          <div className="px-2 md:px-4 lg:px-0">
            <Card className="p-0">
              <CardContent className="space-y-1 px-4 py-3 md:py-4">
                <p className="text-[11px] md:text-sm font-medium text-muted-foreground">
                  {formatPublishedDistance(video.published_at)}
                </p>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {video.description}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activePlaylist && (
            <>
              <Accordion
                type="single"
                collapsible
                defaultValue="playlist"
                className="hidden rounded-xl border border-neutral-800 lg:block mb-3"
              >
                <AccordionItem value="playlist">
                  <AccordionTrigger
                    className="bg-neutral-900 px-4 text-sm font-semibold data-[state=open]:rounded-none data-[state=open]:rounded-t-xl cursor-pointer "
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
                        onClick={toggleLoopPlaylist}
                      >
                        <Repeat2
                          className={`w-8 h-8 transition-colors ${loopPlaylist ? "text-green-500" : "text-white"}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10 cursor-pointer"
                        onClick={toggleRandomPlaylist}
                      >
                        <Shuffle className="w-8 h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10 cursor-pointer"
                        onClick={togglePlaylistOrder}
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
                            onClick={() =>
                              navigate(`/watch/${v.id}`, {
                                state: { playlistId: activePlaylist.id },
                              })
                            }
                          >
                            <div className="w-4 flex justify-center items-center">
                              {isActive && (
                                <IconTriangleFilled
                                  size={10}
                                  className="text-red-100 rotate-90"
                                />
                              )}
                            </div>

                            {/* Thumbnail with duration */}
                            <div className="relative w-32 shrink-0">
                              <img
                                src={v.thumbnail}
                                className="w-full aspect-video rounded-lg object-cover"
                                alt={v.title}
                              />
                              {/* Duration badge */}
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

              <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center lg:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="mx-auto flex w-[calc(100vw-2rem)] items-center justify-between bg-neutral-800 px-4 hover:bg-neutral-700 h-15">
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
                        <ListVideo size={36} />
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
                          <span className="text-xs text-muted-foreground truncate text-left">
                            {activePlaylist.title} •{" "}
                            {getVideoIndex(videoId, displayedPlaylistVideos) +
                              1}
                            /{displayedPlaylistVideos.length}
                          </span>
                        </div>
                        <ChevronUp size={20} />
                      </div>
                    </Button>
                  </DrawerTrigger>

                  <DrawerContent
                    side="bottom"
                    className="h-[calc(100vh-(100vw*9/16)-2.6rem)]"
                  >
                    <div className="flex items-center justify-between px-4 py-1">
                      <DrawerTitle className="text-xl font-semibold">
                        {activePlaylist.title}{" "}
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
                        onClick={toggleLoopPlaylist}
                      >
                        <Repeat2
                          className={`w-8 h-8 transition-colors ${loopPlaylist ? "text-green-500" : "text-white"}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10"
                        onClick={toggleRandomPlaylist}
                      >
                        <Shuffle className="w-8 h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10"
                        onClick={togglePlaylistOrder}
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
                            onClick={() =>
                              navigate(`/watch/${v.id}`, {
                                state: { playlistId: activePlaylist.id },
                              })
                            }
                          >
                            <img
                              src={v.thumbnail}
                              className="w-40 aspect-video rounded-lg object-cover md:w-42"
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
            </>
          )}
          <RelatedVideos relatedVideos={relatedVideos} />
        </div>
      </div>
    </div>
  );
}
