import { useRef, useCallback } from "react";
import { LazyShuffler } from "../_components/LazyShuffler";

export function useLazyShuffledShorts(shorts, initialId) {
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
