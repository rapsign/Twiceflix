"use client";

import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

function useScrollDirection(enabled, threshold = 10) {
  const [scrollingDown, setScrollingDown] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const diff = currentY - lastScrollY.current;
          if (Math.abs(diff) > threshold) {
            setScrollingDown(diff > 0);
            lastScrollY.current = currentY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled, threshold]);

  return scrollingDown;
}

export default function VideoPlayer({
  videoId,
  isMobile,
  onEnd,
  onScrollChange,
}) {
  const scrollingDown = useScrollDirection(isMobile, 10);

  useEffect(() => {
    onScrollChange?.(scrollingDown);
  }, [scrollingDown]);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const handleReady = (e) => {
    const p = e.target;
    p.mute();
    p.playVideo();
    setTimeout(() => {
      try {
        p.unMute();
      } catch (_) {}
    }, 500);
  };

  const player = (
    <YouTube
      key={videoId}
      videoId={videoId}
      opts={opts}
      onReady={handleReady}
      onEnd={onEnd}
      className="h-full w-full"
      iframeClassName="h-full w-full"
    />
  );

  if (isMobile) {
    return (
      <div
        className={`sticky z-50 bg-black aspect-video transition-all duration-300 ${
          scrollingDown ? "top-0 md:top-12" : "top-12"
        }`}
      >
        {player}
      </div>
    );
  }

  return (
    <div className="relative aspect-video xl:rounded-xl overflow-hidden">
      {player}
    </div>
  );
}
