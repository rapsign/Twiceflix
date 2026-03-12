"use client";

import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Play, Pause, Share2 } from "lucide-react";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import { formatPublishedDistance } from "@/utils/time";
import { ShareDialog } from '@/components/ShareDialog';
import VolumeControl from "./VolumeControl";
import { linkifyOptions } from "./constants";

const ShortPlayer = ({
  short,
  isActive,
  isMobile,
  onPlayerReady,
  paused,
  onTogglePause,
  muted,
  volume,
  onMuteToggle,
  onVolumeChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const playerRef = useRef(null);
  const isReadyRef = useRef(false);
  const isMountedRef = useRef(true);
  const showVideoTimerRef = useRef(null);
  const thumbnail = short?.id
    ? `https://i.ytimg.com/vi/${short.id}/maxresdefault.jpg`
    : null;

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(showVideoTimerRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch (_) {}
      playerRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  // Reset saat ganti video
  useEffect(() => {
    if (!short?.id) return;
    setIsPlaying(false);
    setShowVideo(false);
    isReadyRef.current = false;
    clearTimeout(showVideoTimerRef.current);
  }, [short?.id]);

  // Play/mute berdasarkan isActive
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current || !isMountedRef.current) return;
    try {
      if (isActive) {
        playerRef.current.playVideo();
        if (muted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
        }
      } else {
        playerRef.current.mute();
      }
    } catch (_) {}
  }, [isActive]);

  // Apply perubahan muted/volume dari parent
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current || !isActive || !isMountedRef.current) return;
    try {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch (_) {}
  }, [muted, volume, isActive]);

  const handleReady = (e) => {
    if (!isMountedRef.current) return;
    playerRef.current = e.target;
    isReadyRef.current = true;
    onPlayerReady?.(e.target);
    try {
      e.target.mute();
      e.target.playVideo();
    } catch (_) {}
    if (isActive) {
      setTimeout(() => {
        if (!isMountedRef.current || !playerRef.current) return;
        try {
          if (muted) {
            playerRef.current.mute();
          } else {
            playerRef.current.unMute();
            playerRef.current.setVolume(volume);
          }
        } catch (_) {}
      }, 300);
    }
  };

  const handleStateChange = (e) => {
    if (!isMountedRef.current || !playerRef.current) return;
    const state = e.data;
    if ((state === -1 || state === 5) && isActive) {
      try {
        e.target.playVideo();
      } catch (_) {}
    }
    if (state === 1) {
      setIsPlaying(true);
      clearTimeout(showVideoTimerRef.current);
      showVideoTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setShowVideo(true);
      }, 0);
    }
    if (state === 2 && isActive) setIsPlaying(false);
  };

  if (!short) return null;

  return (
    <>
      <ShareDialog
        open={shareOpen}
        onClose={setShareOpen}
        id={short.id}
        title={short.title}
        type="short"
      />

      <div
        className="relative w-full h-full overflow-hidden"
        style={{ background: "#111" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <YouTube
            key={short.id}
            videoId={short.id}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: isActive ? 1 : 0,
                mute: 1,
                loop: 1,
                playlist: short.id,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                showinfo: 0,
                iv_load_policy: 3,
              },
            }}
            onReady={handleReady}
            onPlay={() => {
              if (!isMountedRef.current) return;
              setIsPlaying(true);
            }}
            onStateChange={handleStateChange}
            className="w-full h-full pointer-events-none"
            iframeClassName="w-full h-full pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {thumbnail && (
          <img
            src={thumbnail}
            alt={short.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              zIndex: 2,
              opacity: showVideo && isActive ? 0 : 1,
              transition: showVideo && isActive ? "opacity 0.05s ease" : "none",
              pointerEvents: "none",
            }}
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"
          style={{ zIndex: 10 }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ zIndex: 11 }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-white/60 text-xs pointer-events-none">
                {formatPublishedDistance(short.published_at)}
              </p>
              <Linkify
                as="p"
                options={linkifyOptions}
                className="text-white font-semibold text-sm line-clamp-3 leading-snug"
              >
                {short.title}
              </Linkify>
            </div>

            {isActive && (
              <div className="flex flex-col items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {isActive && !isMobile && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1"
            style={{ zIndex: 30 }}
          >
            {onTogglePause && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePause();
                }}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
              >
                {paused ? (
                  <Play className="w-5 h-5 text-white" />
                ) : (
                  <Pause className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            {onMuteToggle && onVolumeChange && (
              <VolumeControl
                muted={muted}
                volume={volume}
                onMuteToggle={onMuteToggle}
                onVolumeChange={onVolumeChange}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ShortPlayer;
