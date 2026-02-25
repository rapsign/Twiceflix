"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  ArrowLeft,
  Play,
  Pause,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { cn } from "@/lib/utils";
import { formatPublishedDistance } from "@/utils/time";
import useDataManager from "../../hooks/useDataManager";
import NProgress from "nprogress";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";

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

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
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

// ✅ Skeleton desktop tanpa sidebar lokal — sidebar sudah dari PublicLayout
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

/* ─── LazyShuffler ────────────────────────────────────────────────────────── */
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

/* ─── useLazyShuffledShorts ──────────────────────────────────────────────── */
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
      const targetIdx = arr.findIndex((s) => s.id === initialId);
      if (targetIdx >= 0) {
        pinnedShortRef.current = arr[targetIdx];
        arr.splice(targetIdx, 1);
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
      const adjustedIndex = pinnedShortRef.current ? index - 1 : index;
      if (adjustedIndex < 0 || adjustedIndex >= minimalShorts.current.length)
        return null;
      if (!minimalShorts.current.length) return null;
      return (
        minimalShorts.current[shufflerRef.current.get(adjustedIndex)] ?? null
      );
    },
    [shorts?.length],
  );

  return { getShort, total: shorts?.length ?? 0 };
}

/* ─── useVirtualSlots ─────────────────────────────────────────────────────── */
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

/* ─── useSlotPool ─────────────────────────────────────────────────────────── */
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

/* ─── ShortPlayer ─────────────────────────────────────────────────────────── */
const ShortPlayer = ({ short, isActive, isMobile, onPlayerReady }) => {
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [resolvedThumb, setResolvedThumb] = useState(null);
  const playerRef = useRef(null);
  const isReadyRef = useRef(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!short?.id) return;
    setIsPlaying(false);
    setImgLoaded(false);
    setResolvedThumb(null);
    isReadyRef.current = false;

    const primarySrc =
      short.thumbnail || `https://i.ytimg.com/vi/${short.id}/maxresdefault.jpg`;
    const fallbackSrc = `https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`;

    const img = new Image();
    imgRef.current = img;
    img.onload = () => {
      if (imgRef.current === img) {
        setResolvedThumb(primarySrc);
        setImgLoaded(true);
      }
    };
    img.onerror = () => {
      const fb = new Image();
      imgRef.current = fb;
      fb.onload = () => {
        if (imgRef.current === fb) {
          setResolvedThumb(fallbackSrc);
          setImgLoaded(true);
        }
      };
      fb.onerror = () => {
        if (imgRef.current === fb) {
          setResolvedThumb(fallbackSrc);
          setImgLoaded(true);
        }
      };
      fb.src = fallbackSrc;
    };
    img.src = primarySrc;
    return () => {
      imgRef.current = null;
    };
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
      playerRef.current.pauseVideo();
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

  const handleReady = (e) => {
    playerRef.current = e.target;
    isReadyRef.current = true;
    onPlayerReady?.(e.target);
    if (isActive) {
      e.target.mute();
      e.target.playVideo();
      setTimeout(() => {
        try {
          e.target.unMute();
          setMuted(false);
        } catch (_) {
          setMuted(true);
        }
      }, 500);
    } else if (!isMobile) {
      e.target.mute();
      e.target.playVideo();
      setTimeout(() => {
        try {
          e.target.pauseVideo();
        } catch (_) {}
      }, 200);
    }
  };

  const handleStateChange = (e) => {
    const state = e.data;
    if ((state === -1 || state === 5) && isActive) {
      setTimeout(() => {
        try {
          e.target.playVideo();
        } catch (_) {}
      }, 200);
    }
    if (state === 1) setIsPlaying(true);
    if (state === 2 && isActive) setIsPlaying(false);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (muted) {
      playerRef.current?.unMute();
      setMuted(false);
    } else {
      playerRef.current?.mute();
      setMuted(true);
    }
  };

  if (!short) return null;

  return (
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

      {resolvedThumb && (
        <img
          src={resolvedThumb}
          alt={short.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 2,
            opacity: isPlaying && isActive ? 0 : 1,
            transition: isPlaying && isActive ? "opacity 0.5s ease" : "none",
          }}
        />
      )}

      {!isPlaying && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 3 }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #111 100%)",
              opacity: imgLoaded ? 0 : 1,
            }}
          />
          {!imgLoaded && (
            <>
              <style>{shimmerStyle}</style>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"
        style={{ zIndex: 10 }}
      />
      <div
        className="absolute bottom-0 left-0 right-16 p-4 space-y-1"
        style={{ zIndex: 11 }}
      >
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
        <button
          onClick={handleMuteToggle}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
          style={{ zIndex: 11 }}
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  );
};

/* ─── PersistentSlotContainer ─────────────────────────────────────────────── */
const PersistentSlotContainer = ({
  slotData,
  visualOffset,
  isNoAnim,
  activePlayerRef,
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
          />
        </div>
      ))}
    </>
  );
};

/* ─── MobileSlotContainer ─────────────────────────────────────────────────── */
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

/* ─── MobileShorts ────────────────────────────────────────────────────────── */
const MobileShorts = ({ getShort, total }) => {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
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

  return (
    <div
      className="relative h-dvh bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={togglePause}
        className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
      >
        {paused ? (
          <Play className="w-5 h-5 text-white" />
        ) : (
          <Pause className="w-5 h-5 text-white" />
        )}
      </button>
      <MobileSlotContainer
        slotData={slotData}
        visualOffset={visualOffset}
        isNoAnim={isNoAnim}
        activePlayerRef={activePlayerRef}
      />
    </div>
  );
};

/* ─── DesktopShorts ───────────────────────────────────────────────────────── */
const DesktopShorts = ({ getShort, total }) => {
  const [paused, setPaused] = useState(false);
  const activePlayerRef = useRef(null);
  const handleNavigate = useCallback(() => setPaused(false), []);

  const { slotData, goNext, goPrev, visualOffset, isNoAnim, isFirst, isLast } =
    useSlotPool(getShort, total, handleNavigate, false);

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
    // ✅ Tidak ada Sidebar lokal — sudah dihandle PublicLayout
    <div className="flex h-dvh bg-black text-white overflow-hidden pt-12 ">
      <div className="flex flex-1 justify-center items-center">
        <div className="relative h-full py-2">
          <div className="relative rounded-2xl overflow-hidden bg-black h-full aspect-9/16">
            <PersistentSlotContainer
              slotData={slotData}
              visualOffset={visualOffset}
              isNoAnim={isNoAnim}
              activePlayerRef={activePlayerRef}
            />
          </div>
          <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-3">
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
          <div className="absolute bottom-18 right-4 z-30">
            <button
              onClick={togglePause}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
            >
              {paused ? (
                <Play className="w-5 h-5 text-white" />
              ) : (
                <Pause className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function Short() {
  const location = useLocation();
  const id = location.state?.id ?? null;

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );
  const { data: shorts, loading } = useDataManager("youtube_short");
  const { getShort, total } = useLazyShuffledShorts(shorts, id);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading) NProgress.done();
    else NProgress.start();
  }, [loading]);

  return (
    <>
      <Helmet>
        <title>Shorts | TWICEFLIX</title>
        <meta name="description" content="Watch TWICE Shorts videos" />
      </Helmet>
      {loading ? (
        isMobile ? (
          <MobileSkeletonLoader />
        ) : (
          <DesktopSkeletonLoader />
        )
      ) : isMobile ? (
        <MobileShorts getShort={getShort} total={total} />
      ) : (
        <DesktopShorts getShort={getShort} total={total} />
      )}
    </>
  );
}
