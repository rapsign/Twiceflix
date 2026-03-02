"use client";

// src/app/(main)/watch/WatchClient.jsx
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

import useDataManager from "@/hooks/useDataManager";
import { usePlaylistHelpers } from "@/hooks/usePlaylistHelpers";

import WatchSkeleton from "@/components/Player/WatchSkeleton";
import VideoPlayer from "@/components/Player/VideoPlayer";
import VideoInfo from "@/components/Player/VideoInfo";
import PlaylistPanel from "@/components/Player/PlaylistPanel";
import PlaylistDrawer from "@/components/Player/PlaylistDrawer";
import RelatedVideos from "@/components/Player/RelatedVideos";
import { ShareDialog } from "@/components/ui/share-dialog";
// import { ReportDialog } from "@/components/report-dialog";

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
  // const [reportOpen, setReportOpen] = useState(false);

  const { fetchByIdFull: fetchVideo, data: allVideos } =
    useDataManager("youtube_video");
  const { fetchByIdFull: fetchShort } = useDataManager("youtube_short");
  const { fetchPlaylist } = useDataManager("youtube_playlist");
  const { getNextLabel, getNextVideoTitle, getVideoIndex } =
    usePlaylistHelpers();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!videoId) return;
    setWatchedIds((prev) => {
      const next = new Set(prev);
      next.add(String(videoId));
      return next;
    });
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;
    window.scrollTo({ top: 0 });
    setLoading(true);
    setIsNotFound(false);
    setVideo(null);

    fetchVideo(videoId)
      .then((data) => {
        if (data && data.id && data.status !== "error") {
          setVideo(data);
          setRelatedVideos(data.related ?? []);
          setLoading(false);
          return;
        }
        return fetchShort(videoId).then((shortData) => {
          if (shortData && shortData.id && shortData.status !== "error") {
            setVideo({ ...shortData, is_short: true });
            setLoading(false);
          } else {
            setIsNotFound(true);
            setLoading(false);
          }
        });
      })
      .catch(() => {
        fetchShort(videoId)
          .then((shortData) => {
            if (shortData && shortData.id && shortData.status !== "error") {
              setVideo({ ...shortData, is_short: true });
              setLoading(false);
            } else {
              setIsNotFound(true);
              setLoading(false);
            }
          })
          .catch(() => {
            setIsNotFound(true);
            setLoading(false);
          });
      });
  }, [videoId]);

  // Saat video adalah short, set related dari youtube_video secara random
  useEffect(() => {
    if (!video?.is_short) return;
    if (!allVideos?.length) return;
    const shuffled = [...allVideos]
      .filter((v) => !v.is_short)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
    setRelatedVideos(shuffled);
  }, [video?.is_short, video?.id, allVideos]);

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

  useEffect(() => {
    if (!videoId) return;
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 400);
    return () => {
      clearTimeout(t);
      NProgress.done();
    };
  }, [videoId]);

  useEffect(() => {
    if (!loading) NProgress.done();
  }, [loading]);

  const filteredRelated = relatedVideos.filter(
    (v) => !watchedIds.has(String(v.id)),
  );

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

    let nextIndex = currentIndex + 1;

    if (randomPlaylist) {
      nextIndex = Math.floor(Math.random() * displayedPlaylistVideos.length);
    } else if (loopPlaylist && nextIndex >= displayedPlaylistVideos.length) {
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
      {/* <ReportDialog
        open={reportOpen}
        onClose={setReportOpen}
        id={video.id}
        type="watch"
      /> */}

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
