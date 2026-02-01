import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import NProgress from "nprogress";
import {
  ArrowUpDown,
  Pointer,
  Repeat2,
  Share2,
  Shuffle,
  ChevronUp,
  X,
  ListVideo,
} from "lucide-react";
import { IconCheck, IconCopy, IconTriangleFilled } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import useDataManager from "@/hooks/useDataManager";
import { getRelatedVideos } from "@/utils/relatedVideos";
import { formatPublishedDistance } from "@/utils/time";

const FLOAT_BREAKPOINT = 1024;
const FLOAT_OFFSET_TOP = 56;

// Hook reusable untuk YouTube "video ended"
function useYouTubeEndListener(youtubeId, onEnd) {
  const iframeContainerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!youtubeId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current || !iframeContainerRef.current) return;
      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        height: "100%",
        width: "100%",
        videoId: youtubeId,
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnd?.();
            }
          },
        },
        playerVars: {
          rel: 0,
          modestbranding: 1,
          autoplay: 1,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [youtubeId, onEnd]);

  return iframeContainerRef;
}

export default function Watch() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const playlistId = location.state?.playlistId ?? null;

  const [shareOpen, setShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [playedIds, setPlayedIds] = useState(new Set());
  const [loopPlaylist, setLoopPlaylist] = useState(false);
  const [randomPlaylist, setRandomPlaylist] = useState(false);
  const [displayedPlaylistVideos, setDisplayedPlaylistVideos] = useState([]);
  const { data: videos, loading } = useDataManager("videos");
  const { data: playlists } = useDataManager("playlists");

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
    if (!playlistId || !playlists) return null;
    return playlists.find((p) => p.id === playlistId) ?? null;
  }, [playlistId, playlists]);

  useEffect(() => {
    if (!activePlaylist) return;
    setDisplayedPlaylistVideos([...activePlaylist.videos]);
    setRandomPlaylist(false);
    setLoopPlaylist(false);
  }, [activePlaylist]);

  const iframeRef = useYouTubeEndListener(youtubeId, () => {
    if (!activePlaylist || !displayedPlaylistVideos.length) {
      if (relatedVideos.length > 0) {
        navigate(`/watch/${relatedVideos[0].id}`);
      }
      return;
    }

    const currentIndex = displayedPlaylistVideos.findIndex(
      (v) => String(v.id) === String(videoId),
    );

    let nextIndex = currentIndex + 1;

    if (randomPlaylist) {
      nextIndex = Math.floor(Math.random() * displayedPlaylistVideos.length);
    } else if (loopPlaylist && nextIndex >= displayedPlaylistVideos.length) {
      nextIndex = 0;
    }

    const nextVideo = displayedPlaylistVideos[nextIndex];

    if (nextVideo) {
      navigate(`/watch/${nextVideo.id}`, {
        state: { playlistId: activePlaylist.id },
      });
    } else if (!loopPlaylist) {
      if (relatedVideos.length > 0) {
        navigate(`/watch/${relatedVideos[0].id}`);
      }
    }
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
    if (!videoId) return;
    NProgress.start();
  }, [videoId]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= FLOAT_BREAKPOINT) return;
      if (!iframeRef.current) return;

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

  useEffect(() => {
    if (activePlaylist) {
      setDisplayedPlaylistVideos([...activePlaylist.videos]);
    }
  }, [activePlaylist]);

  const toggleLoopPlaylist = () => setLoopPlaylist((prev) => !prev);

  const toggleRandomPlaylist = () => {
    if (!activePlaylist) return;

    setRandomPlaylist((prev) => {
      const newRandom = !prev;

      const newOrder = newRandom
        ? [...activePlaylist.videos].sort(() => Math.random() - 0.5)
        : [...activePlaylist.videos];

      setDisplayedPlaylistVideos(newOrder);

      if (newOrder.length > 0) {
        navigate(`/watch/${newOrder[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      }

      return newRandom;
    });
  };

  const togglePlaylistOrder = () => {
    if (!activePlaylist) return;

    setDisplayedPlaylistVideos((prev) => {
      const reversed = [...prev].reverse();

      if (reversed.length > 0) {
        navigate(`/watch/${reversed[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      }

      return reversed;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  function getNextVideoTitle(videos, currentVideoId) {
    const idx = videos.findIndex(
      (v) => String(v.id) === String(currentVideoId),
    );
    if (idx === -1 || idx + 1 >= videos.length) return "–";
    return videos[idx + 1].title;
  }

  function getVideoIndex(currentVideoId, videos) {
    if (!Array.isArray(videos)) return -1;

    return videos.findIndex((v) => String(v.id) === String(currentVideoId));
  }

  if (loading) return null;
  if (!video) return <Navigate to="/" replace />;

  const url = window.location.href;

  return (
    <div className="mb-2 bg-black px-0 md:pt-12 lg:px-2 lg:pt-18">
      <div className="grid grid-cols-1 gap-4 px-0 lg:grid-cols-12 lg:px-2">
        {/* MAIN */}
        <div className="lg:col-span-9 lg:sticky lg:top-0 self-start space-y-4">
          <div className="relative aspect-video">
            <div className="h-full w-full ">
              <div
                ref={iframeRef}
                className="h-full w-full  rounded-none lg:rounded-xl"
              />
            </div>
            {isFloating && (
              <div className="fixed left-0 right-0 top-13 z-50 w-full h-[calc(100vw*9/16)]">
                <div ref={iframeRef} className="h-full w-full" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-2 md:px-4 lg:px-0">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neutral-800 hover:bg-neutral-700">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Share this video</DialogTitle>
                  <DialogDescription>
                    Copy the link below to share
                  </DialogDescription>
                </DialogHeader>

                <InputGroup className="mt-2">
                  <InputGroupInput value={url} readOnly />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() => copyToClipboard(url)}
                    >
                      {isCopied ? <IconCheck /> : <IconCopy />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </DialogContent>
            </Dialog>
          </div>

          <div className="px-2 md:px-4 lg:px-0">
            <Card className="p-0">
              <CardContent className="space-y-1 px-4 py-4">
                <p className="text-xs md:text-sm font-medium ">
                  {formatPublishedDistance(video.published_at)}
                </p>

                <p className="text-sm md:text-base ">{video.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-3 ">
          {activePlaylist && (
            <>
              <Accordion
                type="single"
                collapsible
                defaultValue="playlist"
                className="hidden rounded-xl border  border-neutral-800 lg:block mb-3 "
              >
                <AccordionItem value="playlist">
                  <AccordionTrigger
                    className="bg-neutral-900  px-4 text-sm font-semibold data-[state=open]:rounded-none data-[state=open]:rounded-t-xl "
                    style={{ textDecoration: "none" }}
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
                      {/* Left: Playlist Icon */}

                      {/* Middle: Next Video & Playlist Info */}
                      <div className="grid grid-rows-2 leading-none overflow-hidden">
                        <p className="text-sm truncate font-normal">
                          <span className="font-medium">Next:</span>{" "}
                          {getNextVideoTitle(displayedPlaylistVideos, videoId)}
                        </p>
                        <span className="text-xs text-muted-foreground font-normal truncate text-left">
                          {activePlaylist.title} •{" "}
                          {getVideoIndex(videoId, activePlaylist) + 1}/
                          {activePlaylist.videos.length}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="p-0">
                    <div className="flex gap-2 p-2 bg-neutral-900">
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
                    <div className="max-h-[calc((62vw-1rem)*9/16)] overflow-y-auto">
                      {displayedPlaylistVideos.map((v, idx) => {
                        const isActive = String(v.id) === String(videoId);
                        const isLast = idx === activePlaylist.videos.length - 1;

                        return (
                          <div
                            key={v.id}
                            className={`flex cursor-pointer gap-2 p-2
        ${isLast ? "rounded-b-xl" : ""}
        ${isActive ? "bg-red-950" : "hover:bg-neutral-800"}
      `}
                            onClick={() =>
                              navigate(`/watch/${v.id}`, {
                                state: { playlistId: activePlaylist.id },
                              })
                            }
                          >
                            {/* TRIANGLE */}
                            <div className="w-4 flex justify-center items-center">
                              {isActive && (
                                <IconTriangleFilled
                                  size={10}
                                  className="text-red-100 rotate-90"
                                />
                              )}
                            </div>

                            {/* THUMBNAIL */}
                            <img
                              src={v.thumbnail}
                              className="w-32 aspect-video rounded-lg object-cover"
                            />

                            {/* TEXT */}
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
                      {/* Left: Playlist Icon */}
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
                        {/* Left: Playlist Icon */}
                        <ListVideo size={36} />

                        {/* Middle: Next Video & Playlist Info */}
                        <div className="grid grid-rows-2 leading-none overflow-hidden">
                          <span className="text-xs font-medium truncate">
                            Next:{" "}
                            {getNextVideoTitle(
                              displayedPlaylistVideos,
                              videoId,
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground truncate text-left">
                            {activePlaylist.title} •{" "}
                            {getVideoIndex(videoId, activePlaylist) + 1}/
                            {activePlaylist.videos.length}
                          </span>
                        </div>

                        {/* Right: Chevron Up */}
                        <ChevronUp size={20} />
                      </div>
                    </Button>
                  </DrawerTrigger>

                  <DrawerContent
                    side="bottom"
                    className="h-[calc(100vh-(100vw*9/16)-3.15rem)] "
                  >
                    <div className="flex items-center justify-between px-4 py-1">
                      <DrawerTitle className="text-xl font-semibold">
                        {activePlaylist.title}{" "}
                        <span className="text-xs text-muted-foreground truncate ">
                          {getVideoIndex(videoId, activePlaylist) + 1} /{" "}
                          {activePlaylist.videos.length}
                        </span>
                      </DrawerTitle>
                      <DrawerClose>
                        <X />
                      </DrawerClose>
                    </div>

                    <div className="grid grid-rows-2 px-4"></div>

                    <div className="flex gap-2 px-2 border-b ">
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10"
                        onClick={toggleLoopPlaylist}
                      >
                        <Repeat2
                          className={`w-8 h-8 transition-colors ${
                            loopPlaylist ? "text-green-500" : "text-white"
                          }`}
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

                    <ScrollArea className="h-[calc(100vh-26rem)]">
                      {displayedPlaylistVideos.map((v) => {
                        const isActive = String(v.id) === String(videoId);
                        return (
                          <div
                            key={v.id}
                            className={`flex cursor-pointer gap-2 p-2 ${
                              isActive ? "bg-red-950" : "hover:bg-neutral-800"
                            }`}
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
          <div className="grid grid-cols-1 gap-3 px-0 md:grid-cols-3 md:px-4 lg:grid-cols-1 lg:px-0 pb-1">
            {relatedVideos.map((v) => (
              <div
                key={v.id}
                className="flex cursor-pointer flex-col gap-2 lg:flex-row"
                onClick={() => navigate(`/watch/${v.id}`)}
              >
                <img
                  src={v.thumbnail}
                  className="w-full aspect-video rounded-none object-cover md:rounded-lg lg:w-42"
                />
                <div className="flex flex-col gap-1 px-2 md:px-0">
                  <p className="line-clamp-2 text-sm font-medium">{v.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPublishedDistance(v.published_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
