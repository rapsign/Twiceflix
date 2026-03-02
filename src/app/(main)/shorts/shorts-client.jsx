"use client";

// src/app/(main)/shorts/ShortsClient.jsx
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import {
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Volume1,
  ArrowLeft,
  Play,
  Pause,
  Share2,
  // Flag,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import YouTube from "react-youtube";
import { cn } from "@/lib/utils";
import { formatPublishedDistance } from "@/utils/time";
import useDataManager from "@/hooks/useDataManager";
import NProgress from "nprogress";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import { ShareDialog } from "@/components/ui/share-dialog";
// import { ReportDialog } from "@/components/report-dialog";

const linkifyOptions = {
  formatHref: { hashtag: (href) => `/search?q=${href.substring(1)}` },
  target: { url: "_blank", hashtag: "_self" },
  attributes: (href, type) => ({
    className:
      type === "hashtag"
        ? "text-[#3EA6FF] font-semibold hover:text-[#5AB3FF]"
        : "text-[#3EA6FF] underline hover:text-[#5AB3FF]",
    ...(type === "hashtag" ? {} : { rel: "noopener noreferrer" }),
    onClick: (e) => e.stopPropagation(),
  }),
};

const MOBILE_BREAKPOINT = 768;
const ANIM_DURATION = 300;

const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

const VolumeControl = ({ muted, volume, onMuteToggle, onVolumeChange }) => {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef(null);
  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div
      className="flex items-center h-9 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-200 overflow-hidden"
      style={{ width: hovered ? "108px" : "36px" }}
      onMouseEnter={() => {
        clearTimeout(timeoutRef.current);
        setHovered(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setHovered(false), 300);
      }}
    >
      <button
        onClick={onMuteToggle}
        className="w-9 h-9 shrink-0 flex items-center justify-center"
      >
        <VolumeIcon className="w-5 h-5 text-white" />
      </button>
      <div
        className="flex items-center pr-3 transition-all duration-200"
        style={{ width: hovered ? "72px" : "0px", opacity: hovered ? 1 : 0 }}
      >
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={onVolumeChange}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-1 cursor-pointer"
          style={{ accentColor: "white" }}
        />
      </div>
    </div>
  );
};

const SkeletonPulse = ({ className }) => (
  <div
    className={cn("rounded bg-neutral-800", className)}
    style={{
      background:
        "linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

const SkeletonShortPlayer = () => (
  <div className="relative w-full h-full bg-neutral-900 overflow-hidden flex flex-col justify-end">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, #141414 25%, #1e1e1e 50%, #141414 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />
    <div className="relative z-20 p-4 space-y-2">
      <SkeletonPulse className="h-3 w-24 rounded-full" />
      <SkeletonPulse className="h-4 w-3/4 rounded-full" />
      <SkeletonPulse className="h-4 w-1/2 rounded-full" />
    </div>
  </div>
);

const MobileSkeletonLoader = () => (
  <div className="relative h-dvh bg-black overflow-hidden">
    <style>{shimmerStyle}</style>
    <div className="absolute top-4 left-4 z-30">
      <SkeletonPulse className="w-9 h-9 rounded-full" />
    </div>
    <div className="absolute top-4 right-4 z-30">
      <SkeletonPulse className="w-9 h-9 rounded-full" />
    </div>
    <SkeletonShortPlayer />
  </div>
);

const DesktopSkeletonLoader = () => (
  <div className="flex h-dvh bg-black text-white overflow-hidden pt-12">
    <style>{shimmerStyle}</style>
    <div className="flex flex-1 justify-center items-center">
      <div className="relative h-full py-2">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 h-full aspect-9/16">
          <SkeletonShortPlayer />
        </div>
      </div>
    </div>
  </div>
);

class LazyShuffler {
  constructor(length) {
    this.length = length;
    this.map = {};
    this.resolved = new Set();
    this.pointer = length - 1;
  }
  _val(i) {
    return this.map[i] !== undefined ? this.map[i] : i;
  }
  get(n) {
    if (n < 0 || n >= this.length) return -1;
    if (this.resolved.has(n)) return this.map[n];
    for (let i = this.pointer; i >= n; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const vi = this._val(i),
        vj = this._val(j);
      this.map[i] = vj;
      this.map[j] = vi;
      this.resolved.add(i);
    }
    this.pointer = n - 1;
    return this.map[n];
  }
}

function useLazyShuffledShorts(shorts, initialId) {
  const shufflerRef = useRef(null);
  const prevLengthRef = useRef(0);
  const minimalShorts = useRef([]);
  const pinnedShortRef = useRef(null);

  if (shorts?.length && shorts.length !== prevLengthRef.current) {
    const arr = shorts.map((s) => ({
      id: s.id,
      title: s.title,
      thumbnail: s.thumbnail,
      published_at: s.published_at,
    }));
    if (initialId) {
      const idx = arr.findIndex((s) => s.id === initialId);
      if (idx >= 0) {
        pinnedShortRef.current = arr[idx];
        arr.splice(idx, 1);
      }
    } else {
      pinnedShortRef.current = null;
    }
    minimalShorts.current = arr;
    shufflerRef.current = new LazyShuffler(arr.length);
    prevLengthRef.current = shorts.length;
  }

  const getShort = useCallback(
    (index) => {
      if (!shufflerRef.current) return null;
      if (index === 0 && pinnedShortRef.current) return pinnedShortRef.current;
      const adj = pinnedShortRef.current ? index - 1 : index;
      if (
        adj < 0 ||
        adj >= minimalShorts.current.length ||
        !minimalShorts.current.length
      )
        return null;
      return minimalShorts.current[shufflerRef.current.get(adj)] ?? null;
    },
    [shorts?.length],
  );

  return { getShort, total: shorts?.length ?? 0 };
}

function useVirtualSlots(total, onNavigate) {
  const indexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visualOffset, setVisualOffset] = useState("0%");
  const [isNoAnim, setIsNoAnim] = useState(false);
  const isAnimating = useRef(false);

  const go = useCallback(
    (direction) => {
      if (isAnimating.current) return;
      const nextIndex = indexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= total) return;
      isAnimating.current = true;
      setIsNoAnim(false);
      setVisualOffset(direction > 0 ? "-100%" : "100%");
      setTimeout(() => {
        indexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        onNavigate?.();
        setIsNoAnim(true);
        setVisualOffset("0%");
        setTimeout(() => {
          setIsNoAnim(false);
          isAnimating.current = false;
        }, 50);
      }, ANIM_DURATION);
    },
    [total, onNavigate],
  );

  return {
    currentIndex,
    goNext: useCallback(() => go(1), [go]),
    goPrev: useCallback(() => go(-1), [go]),
    visualOffset,
    isNoAnim,
    isFirst: currentIndex === 0,
    isLast: currentIndex === total - 1,
  };
}

function useSlotPool(getShort, total, onNavigate, isMobile) {
  const slots = useVirtualSlots(total, onNavigate);
  const { currentIndex } = slots;

  const [slotData, setSlotData] = useState(() =>
    isMobile
      ? [{ short: getShort(0), role: "active" }]
      : [
          { short: null, role: "prev" },
          { short: getShort(0), role: "active" },
          { short: getShort(1), role: "next" },
        ],
  );

  useEffect(() => {
    if (isMobile) {
      setSlotData([{ short: getShort(currentIndex), role: "active" }]);
    } else {
      setSlotData([
        {
          short: getShort(currentIndex - 1),
          role: currentIndex > 0 ? "prev" : "hidden",
        },
        { short: getShort(currentIndex), role: "active" },
        {
          short: getShort(currentIndex + 1),
          role: currentIndex < total - 1 ? "next" : "hidden",
        },
      ]);
    }
  }, [currentIndex, getShort, total, isMobile]);

  return { slotData, ...slots };
}

const ShortPlayer = ({
  short,
  isActive,
  isMobile,
  onPlayerReady,
  onVolumeState,
  paused,
  onTogglePause,
}) => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  // const [reportOpen, setReportOpen] = useState(false);
  const playerRef = useRef(null);
  const isReadyRef = useRef(false);
  const thumbnail = short?.id
    ? `https://i.ytimg.com/vi/${short.id}/maxresdefault.jpg`
    : null;

  useEffect(() => {
    if (!short?.id) return;
    setIsPlaying(false);
    setShowVideo(false);
    isReadyRef.current = false;
  }, [short?.id]);

  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    if (isActive) {
      playerRef.current.playVideo();
      try {
        playerRef.current.unMute();
        setMuted(false);
      } catch (_) {
        setMuted(true);
      }
    } else {
      playerRef.current.mute();
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      try {
        playerRef.current?.destroy?.();
      } catch (_) {}
      playerRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  const handleMuteToggle = (e) => {
    e?.stopPropagation();
    if (muted) {
      playerRef.current?.unMute();
      setMuted(false);
    } else {
      playerRef.current?.mute();
      setMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    playerRef.current?.setVolume(val);
    if (val === 0) {
      playerRef.current?.mute();
      setMuted(true);
    } else {
      playerRef.current?.unMute();
      setMuted(false);
    }
  };

  useEffect(() => {
    if (onVolumeState)
      onVolumeState({ muted, volume, handleMuteToggle, handleVolumeChange });
  }, [muted, volume]);

  const handleReady = (e) => {
    playerRef.current = e.target;
    isReadyRef.current = true;
    onPlayerReady?.(e.target);
    e.target.mute();
    e.target.playVideo();
    if (isActive) {
      try {
        e.target.unMute();
        setMuted(false);
      } catch (_) {
        setMuted(true);
      }
    }
  };

  const handleStateChange = (e) => {
    const state = e.data;
    if ((state === -1 || state === 5) && isActive) {
      try {
        e.target.playVideo();
      } catch (_) {}
    }
    if (state === 1) {
      setIsPlaying(true);
      setTimeout(() => setShowVideo(true), 800);
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
      {/* <ReportDialog open={reportOpen} onClose={setReportOpen} id={short.id} type="short" /> */}

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
            onPlay={() => setIsPlaying(true)}
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
              transition: showVideo && isActive ? "opacity 0.3s ease" : "none",
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
                className="text-white font-semibold text-sm line-clamp-2 leading-snug"
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
                {/* Report button — dinonaktifkan sementara */}
                {/* <button onClick={(e) => { e.stopPropagation(); setReportOpen(true); }} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                  <Flag className="w-4 h-4 text-white" />
                </button> */}
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
            <VolumeControl
              muted={muted}
              volume={volume}
              onMuteToggle={handleMuteToggle}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

const PersistentSlotContainer = ({
  slotData,
  visualOffset,
  isNoAnim,
  activePlayerRef,
  onVolumeState,
  paused,
  onTogglePause,
}) => {
  const getTranslateY = (role) => {
    switch (role) {
      case "prev":
        return `calc(${visualOffset} - 100%)`;
      case "active":
        return visualOffset;
      case "next":
        return `calc(${visualOffset} + 100%)`;
      default:
        return "-200%";
    }
  };
  return (
    <>
      {slotData.map((slot, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translateY(${getTranslateY(slot.role)})`,
            transition: isNoAnim
              ? "none"
              : `transform ${ANIM_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
            willChange: slot.role === "active" ? "transform" : "auto",
            pointerEvents: slot.role === "active" ? "auto" : "none",
            visibility: slot.role === "hidden" ? "hidden" : "visible",
          }}
        >
          <ShortPlayer
            short={slot.short}
            isActive={slot.role === "active"}
            isMobile={false}
            onPlayerReady={
              slot.role === "active"
                ? (p) => {
                    activePlayerRef.current = p;
                  }
                : undefined
            }
            onVolumeState={slot.role === "active" ? onVolumeState : undefined}
            paused={paused}
            onTogglePause={slot.role === "active" ? onTogglePause : undefined}
          />
        </div>
      ))}
    </>
  );
};

const MobileSlotContainer = ({
  slotData,
  visualOffset,
  isNoAnim,
  activePlayerRef,
}) => {
  const slot = slotData[0];
  if (!slot) return null;
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translateY(${visualOffset})`,
        transition: isNoAnim
          ? "none"
          : `transform ${ANIM_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        willChange: "transform",
      }}
    >
      <ShortPlayer
        short={slot.short}
        isActive={true}
        isMobile={true}
        onPlayerReady={(p) => {
          activePlayerRef.current = p;
        }}
      />
    </div>
  );
};

const MobileShorts = ({ getShort, total }) => {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const activePlayerRef = useRef(null);
  const handleNavigate = useCallback(() => setPaused(false), []);
  const { slotData, goNext, goPrev, visualOffset, isNoAnim, isFirst, isLast } =
    useSlotPool(getShort, total, handleNavigate, true);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };
  const handleTouchMove = (e) => {
    if (isDragging.current)
      touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    const delta = touchDeltaY.current;
    const threshold = window.innerHeight * 0.2;
    if (delta < -threshold && !isLast) goNext();
    else if (delta > threshold && !isFirst) goPrev();
    touchDeltaY.current = 0;
  };

  const togglePause = (e) => {
    e.stopPropagation();
    if (!activePlayerRef.current) return;
    if (paused) {
      activePlayerRef.current.playVideo();
      setPaused(false);
    } else {
      activePlayerRef.current.pauseVideo();
      setPaused(true);
    }
  };

  const handleMuteToggle = () => {
    if (!activePlayerRef.current) return;
    if (muted) {
      activePlayerRef.current.unMute();
      setMuted(false);
    } else {
      activePlayerRef.current.mute();
      setMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    activePlayerRef.current?.setVolume(val);
    if (val === 0) {
      activePlayerRef.current?.mute();
      setMuted(true);
    } else {
      activePlayerRef.current?.unMute();
      setMuted(false);
    }
  };

  return (
    <div
      className="relative h-dvh bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <VolumeControl
            muted={muted}
            volume={volume}
            onMuteToggle={handleMuteToggle}
            onVolumeChange={handleVolumeChange}
          />
        </div>
        <button
          onClick={togglePause}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition pointer-events-auto"
        >
          {paused ? (
            <Play className="w-5 h-5 text-white" />
          ) : (
            <Pause className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
      <MobileSlotContainer
        slotData={slotData}
        visualOffset={visualOffset}
        isNoAnim={isNoAnim}
        activePlayerRef={activePlayerRef}
      />
    </div>
  );
};

const DesktopShorts = ({ getShort, total }) => {
  const [paused, setPaused] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  // const [reportOpen, setReportOpen] = useState(false);
  const [activeShort, setActiveShort] = useState(null);
  const activePlayerRef = useRef(null);
  const handleNavigate = useCallback(() => setPaused(false), []);
  const { slotData, goNext, goPrev, visualOffset, isNoAnim, isFirst, isLast } =
    useSlotPool(getShort, total, handleNavigate, false);

  useEffect(() => {
    const active = slotData.find((s) => s.role === "active");
    if (active?.short) setActiveShort(active.short);
  }, [slotData]);

  useEffect(() => {
    let lastScroll = 0;
    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScroll < ANIM_DURATION + 100) return;
      lastScroll = now;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  const togglePause = () => {
    if (!activePlayerRef.current) return;
    if (paused) {
      activePlayerRef.current.playVideo();
      setPaused(false);
    } else {
      activePlayerRef.current.pauseVideo();
      setPaused(true);
    }
  };

  return (
    <>
      {activeShort && (
        <>
          <ShareDialog
            open={shareOpen}
            onClose={setShareOpen}
            id={activeShort.id}
            title={activeShort.title}
            type="short"
          />
          {/* <ReportDialog open={reportOpen} onClose={setReportOpen} id={activeShort.id} type="short" /> */}
        </>
      )}

      <div className="flex h-dvh bg-black text-white overflow-hidden pt-12">
        <div className="flex flex-1 justify-center items-center">
          <div className="relative h-full py-2">
            <div className="relative rounded-2xl overflow-hidden bg-black h-full aspect-9/16">
              <PersistentSlotContainer
                slotData={slotData}
                visualOffset={visualOffset}
                isNoAnim={isNoAnim}
                activePlayerRef={activePlayerRef}
                paused={paused}
                onTogglePause={togglePause}
              />
            </div>
            <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 transition"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 transition"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function ShortContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: shorts, loading } = useDataManager("youtube_short");
  const { getShort, total } = useLazyShuffledShorts(shorts, id);

  useEffect(() => {
    setMounted(true);
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading) NProgress.done();
    else NProgress.start();
  }, [loading]);

  if (!mounted) return null;
  if (loading)
    return isMobile ? <MobileSkeletonLoader /> : <DesktopSkeletonLoader />;

  return isMobile ? (
    <MobileShorts getShort={getShort} total={total} />
  ) : (
    <DesktopShorts getShort={getShort} total={total} />
  );
}

export default function ShortsClient() {
  return (
    <Suspense fallback={<MobileSkeletonLoader />}>
      <ShortContent />
    </Suspense>
  );
}
