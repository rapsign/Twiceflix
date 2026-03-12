import { useRef, useState, useCallback } from "react";
import { ANIM_DURATION } from "../_components/constants";

export function useVirtualSlots(total, onNavigate) {
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
