"use client";

import { useEffect, useRef, useState } from "react";

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

export default function VideoPlayer({ iframeRef, isMobile }) {
  const scrollingDown = useScrollDirection(isMobile, 10);

  if (isMobile) {
    return (
      <div
        className={`sticky z-50 bg-black aspect-video transition-all duration-300 ${
          scrollingDown ? "top-0 md:top-12" : "top-12"
        }`}
      >
        <div ref={iframeRef} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <div ref={iframeRef} className="rounded-xl h-full w-full" />
    </div>
  );
}
