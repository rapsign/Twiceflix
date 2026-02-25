"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import NProgress from "nprogress";

import useDataManager from "../../hooks/useDataManager";
import useYouTubeEndListener from "../../hooks/useYouTubeEndListener";
import { usePlaylistHelpers } from "../../hooks/usePlaylistHelpers";

import WatchSkeleton from "@/components/Player/WatchSkeleton";
import VideoPlayer from "@/components/Player/VideoPlayer";
import VideoInfo from "@/components/Player/VideoInfo";
import PlaylistPanel from "@/components/Player/PlaylistPanel";
import PlaylistDrawer from "@/components/Player/PlaylistDrawer";
import RelatedVideos from "@/components/Player/RelatedVideos";

export default function Watch() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const playlistId = location.state?.playlistId ?? null;

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [watchedIds, setWatchedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [loopPlaylist, setLoopPlaylist] = useState(false);
  const [randomPlaylist, setRandomPlaylist] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [displayedPlaylistVideos, setDisplayedPlaylistVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const { fetchByIdFull } = useDataManager("youtube_video");
  const { fetchPlaylist } = useDataManager("youtube_playlist");
  const { getNextLabel, getNextVideoTitle, getVideoIndex } =
    usePlaylistHelpers();

  useEffect(() => {
    if (videoId) {
      setWatchedIds((prev) => new Set(prev).add(videoId));
    }
  }, [videoId]);

  // Fetch video
  useEffect(() => {
    if (!videoId) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    setVideo(null);
    setRelatedVideos([]);

    fetchByIdFull(videoId)
      .then((data) => {
        if (!data || data.status === "error" || !data.id) {
          setVideo(null);
          setLoading(false);
          return;
        }
        setVideo(data);
        setRelatedVideos(data.related ?? []);
        setLoading(false);
      })
      .catch(() => {
        setVideo(null);
        setLoading(false);
      });
  }, [videoId]);

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

  // Responsive check
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // NProgress
  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 400);
    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [videoId]);

  useEffect(() => {
    if (!loading) NProgress.done();
  }, [loading]);

  const youtubeId = video?.id ?? null;

  const filteredRelated = relatedVideos.filter(
    (v) => !watchedIds.has(String(v.id)),
  );

  const handleVideoEnd = useCallback(() => {
    if (!activePlaylist || !displayedPlaylistVideos.length) {
      if (filteredRelated.length > 0)
        navigate(`/watch/${filteredRelated[0].id}`);
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
    } else if (!loopPlaylist && filteredRelated.length > 0) {
      navigate(`/watch/${filteredRelated[0].id}`);
    }
  }, [
    activePlaylist,
    displayedPlaylistVideos,
    videoId,
    randomPlaylist,
    loopPlaylist,
    filteredRelated,
    navigate,
  ]);

  const iframeRef = useYouTubeEndListener(youtubeId, handleVideoEnd);

  const toggleLoopPlaylist = () => setLoopPlaylist((prev) => !prev);

  const toggleRandomPlaylist = () => {
    if (!activePlaylist) return;
    setRandomPlaylist((prev) => {
      const newRandom = !prev;
      const newOrder = newRandom
        ? [...(activePlaylist.videos ?? [])].sort(() => Math.random() - 0.5)
        : [...(activePlaylist.videos ?? [])];
      setDisplayedPlaylistVideos(newOrder);
      if (newOrder.length > 0)
        navigate(`/watch/${newOrder[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      return newRandom;
    });
  };

  const togglePlaylistOrder = () => {
    setDisplayedPlaylistVideos((prev) => {
      const reversed = [...prev].reverse();
      if (reversed.length > 0 && activePlaylist)
        navigate(`/watch/${reversed[0].id}`, {
          state: { playlistId: activePlaylist.id },
        });
      return reversed;
    });
  };

  const handlePlaylistVideoClick = (id) => {
    navigate(`/watch/${id}`, { state: { playlistId: activePlaylist.id } });
  };

  if (loading) return <WatchSkeleton />;
  if (!video) {
    navigate("/not-found", { replace: true });
    return null;
  }

  const metaDescription = video.description
    ? video.description.substring(0, 157) + "..."
    : "Watch this TWICE video on TWICEFLIX";

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
      <Helmet>
        <title>{video.title} - TWICEFLIX</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`TWICE, ${video.title}, K-pop, music video, performance`}
        />
        <meta property="og:title" content={`${video.title} - TWICEFLIX`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={video.thumbnail} />
        <meta property="og:type" content="video.other" />
        <meta
          property="og:url"
          content={`https://twiceflix.com/watch/${videoId}`}
        />
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={`${video.title} - TWICEFLIX`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={video.thumbnail} />
        {activePlaylist && (
          <meta
            name="description"
            content={`${metaDescription} From playlist: ${activePlaylist.title}`}
          />
        )}
      </Helmet>

      <div className="bg-black px-0 pt-14">
        {isMobile && (
          <VideoPlayer
            iframeRef={iframeRef}
            isMobile={isMobile}
            title={video.title}
          />
        )}

        <div className="grid grid-cols-1 gap-4 px-0 lg:grid-cols-12 lg:px-2">
          <div className="lg:col-span-9 self-start space-y-4 ">
            {!isMobile && (
              <VideoPlayer
                iframeRef={iframeRef}
                isMobile={isMobile}
                title={video.title}
              />
            )}
            <VideoInfo video={video} />
          </div>

          <div className="lg:col-span-3">
            {activePlaylist && (
              <>
                <PlaylistPanel {...playlistProps} />
                <PlaylistDrawer {...playlistProps} />
              </>
            )}
            <RelatedVideos relatedVideos={filteredRelated} />
          </div>
        </div>
      </div>
    </>
  );
}
