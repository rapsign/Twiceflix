"use client";

// src/app/(main)/watch/WatchClient.jsx
import { useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

import useDataManager from "@/hooks/useDataManager";
import { usePlaylistHelpers } from "@/app/(main)/watch/components/hooks/usePlaylistHelpers";

import WatchSkeleton from "@/app/(main)/watch/components/WatchSkeleton";
import VideoPlayer from "@/app/(main)/watch/components/VideoPlayer";
import VideoInfo from "@/app/(main)/watch/components/VideoInfo";
import PlaylistPanel from "@/app/(main)/watch/components/PlaylistPanel";
import PlaylistDrawer from "@/app/(main)/watch/components/PlaylistDrawer";
import RelatedVideos from "@/app/(main)/watch/components/RelatedVideos";
import { ShareDialog } from '@/components/ShareDialog';

function WatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams.get("tv");
  const playlistId = searchParams.get("tl");

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [watchedIds, setWatchedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const [loopPlaylist, setLoopPlaylist] = useState(false);
  const [randomPlaylist, setRandomPlaylist] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [displayedPlaylistVideos, setDisplayedPlaylistVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [videoScrolledUp, setVideoScrolledUp] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { fetchByIdFull: fetchVideo, data: allVideos } =
    useDataManager("youtube-video");
  const { fetchByIdFull: fetchShort } = useDataManager("youtube-short");
  const { fetchPlaylist } = useDataManager("youtube-playlist");
  const { getNextLabel, getNextVideoTitle, getVideoIndex } =
    usePlaylistHelpers();

  // Cek mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track watched
  useEffect(() => {
    if (!videoId) return;
    setWatchedIds((prev) => new Set([...prev, String(videoId)]));
  }, [videoId]);

  // Fetch video
  useEffect(() => {
    if (!videoId) return;
    window.scrollTo({ top: 0 });
    setLoading(true);
    setIsNotFound(false);

    const tryShort = () =>
      fetchShort(videoId)
        .then((shortData) => {
          if (shortData?.id && shortData?.status !== "error") {
            setVideo({ ...shortData, is_short: true });
            setRelatedVideos([]);
          } else {
            setIsNotFound(true);
          }
          setLoading(false);
        })
        .catch(() => {
          setIsNotFound(true);
          setLoading(false);
        });

    fetchVideo(videoId)
      .then((data) => {
        if (data?.id && data?.status !== "error") {
          setVideo(data);
          setRelatedVideos(data.related ?? []);
          setLoading(false);
        } else {
          return tryShort();
        }
      })
      .catch(() => tryShort());
  }, [videoId]);

  // Related untuk short — hitung sekali pakai useMemo
  const shortRelated = useMemo(() => {
    if (!video?.is_short || !allVideos?.length) return [];
    return [...allVideos]
      .filter((v) => !v.is_short)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
  }, [video?.id, allVideos]);

  // Fetch playlist
  useEffect(() => {
    if (!playlistId) {
      setActivePlaylist(null);
      setDisplayedPlaylistVideos([]);
      return;
    }
    fetchPlaylist(playlistId).then((data) => {
      if (!data) return;
      setActivePlaylist(data);
      setDisplayedPlaylistVideos(data.videos ?? []);
      setRandomPlaylist(false);
      setLoopPlaylist(false);
    });
  }, [playlistId]);

  // NProgress ikut loading lokal
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  // Gabungkan related + filter watched
  const filteredRelated = useMemo(() => {
    const source = video?.is_short ? shortRelated : relatedVideos;
    return source.filter((v) => !watchedIds.has(String(v.id)));
  }, [video?.is_short, shortRelated, relatedVideos, watchedIds]);

  const handleVideoEnd = useCallback(() => {
    if (!activePlaylist || !displayedPlaylistVideos.length) {
      if (filteredRelated.length > 0) {
        router.push(`/watch?tv=${filteredRelated[0].id}`);
      }
      return;
    }

    const currentIndex = displayedPlaylistVideos.findIndex(
      (v) => String(v.id) === String(videoId),
    );

    let nextIndex = randomPlaylist
      ? Math.floor(Math.random() * displayedPlaylistVideos.length)
      : currentIndex + 1;

    if (loopPlaylist && nextIndex >= displayedPlaylistVideos.length) {
      nextIndex = 0;
    }

    const nextVideo = displayedPlaylistVideos[nextIndex];

    if (nextVideo) {
      router.push(`/watch?tv=${nextVideo.id}&tl=${activePlaylist.id}`);
    } else if (!loopPlaylist && filteredRelated.length > 0) {
      router.push(`/watch?tv=${filteredRelated[0].id}`);
    }
  }, [
    activePlaylist,
    displayedPlaylistVideos,
    videoId,
    randomPlaylist,
    loopPlaylist,
    filteredRelated,
    router,
  ]);

  const toggleLoopPlaylist = () => setLoopPlaylist((p) => !p);

  const toggleRandomPlaylist = () => {
    if (!activePlaylist) return;
    setRandomPlaylist((prev) => {
      const newRandom = !prev;
      const newOrder = newRandom
        ? [...(activePlaylist.videos ?? [])].sort(() => Math.random() - 0.5)
        : [...(activePlaylist.videos ?? [])];
      setDisplayedPlaylistVideos(newOrder);
      if (newOrder.length > 0) {
        router.push(`/watch?tv=${newOrder[0].id}&tl=${activePlaylist.id}`);
      }
      return newRandom;
    });
  };

  const togglePlaylistOrder = () => {
    setDisplayedPlaylistVideos((prev) => {
      const reversed = [...prev].reverse();
      if (reversed.length > 0 && activePlaylist) {
        router.push(`/watch?tv=${reversed[0].id}&tl=${activePlaylist.id}`);
      }
      return reversed;
    });
  };

  const handlePlaylistVideoClick = (id) => {
    if (!activePlaylist) return;
    router.push(`/watch?tv=${id}&tl=${activePlaylist.id}`);
  };

  if (!videoId) return <WatchSkeleton />;
  if (isNotFound) {
    router.replace("/not-found");
    return <WatchSkeleton />;
  }
  if (!video) return <WatchSkeleton />;

  const playlistProps = {
    activePlaylist,
    displayedPlaylistVideos,
    videoId,
    loopPlaylist,
    onToggleLoop: toggleLoopPlaylist,
    onToggleRandom: toggleRandomPlaylist,
    onToggleOrder: togglePlaylistOrder,
    onVideoClick: handlePlaylistVideoClick,
    getNextLabel,
    getNextVideoTitle,
    getVideoIndex,
  };

  return (
    <>
      <ShareDialog
        open={shareOpen}
        onClose={setShareOpen}
        id={video.id}
        title={video.title}
        type="watch"
      />
      <div className="bg-black px-0 pt-14">
        {isMobile && (
          <VideoPlayer
            videoId={videoId}
            isMobile={isMobile}
            onEnd={handleVideoEnd}
            onScrollChange={setVideoScrolledUp}
          />
        )}
        <div className="grid grid-cols-1 gap-4 px-0 xl:grid-cols-[minmax(0,1fr)_440px] xl:px-4">
          <div className="space-y-4">
            {!isMobile && (
              <VideoPlayer
                videoId={videoId}
                isMobile={isMobile}
                onEnd={handleVideoEnd}
              />
            )}
            <VideoInfo
              video={video}
              onShare={() => setShareOpen(true)}
              onReport={undefined}
            />
          </div>
          <div className="flex flex-col h-full">
            {activePlaylist && (
              <>
                <div className="px-4 md:px-0">
                  <PlaylistPanel {...playlistProps} />
                </div>
                <PlaylistDrawer
                  {...playlistProps}
                  videoScrolledUp={videoScrolledUp}
                />
              </>
            )}
            <RelatedVideos relatedVideos={filteredRelated} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function WatchClient() {
  return (
    <Suspense fallback={<WatchSkeleton />}>
      <WatchContent />
    </Suspense>
  );
}
