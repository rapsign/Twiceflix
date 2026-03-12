"use client";

import { useMemo } from "react";
import ShortsCard from "./ShortsCard";

const MASTER_SEED = 42;

function seededShuffle(arr, masterSeed) {
  const result = [...arr];
  let seed = masterSeed;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ShortsSkeleton = ({ count }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 py-2">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="w-full rounded-xl overflow-hidden bg-neutral-800 animate-pulse relative"
        style={{ aspectRatio: "9/16" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
          <div className="h-2 w-16 bg-neutral-700 rounded-full" />
          <div className="h-3 w-full bg-neutral-700 rounded-full" />
          <div className="h-3 w-3/4 bg-neutral-700 rounded-full" />
        </div>
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `}</style>
  </div>
);

export default function ShortsGrid({
  shorts = [],
  seed = 0,
  count = 10,
  loading = false,
  disableShuffle = false,
}) {
  const randomShorts = useMemo(() => {
    if (shorts.length === 0) return [];
    if (disableShuffle) return shorts.slice(0, count);
    const shuffled = seededShuffle(shorts, MASTER_SEED);
    const start = (seed * count) % shuffled.length;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(shuffled[(start + i) % shuffled.length]);
    }
    return result;
  }, [shorts, seed, count, disableShuffle]);

  if (loading) return <ShortsSkeleton count={count} />;
  if (shorts.length === 0) return null;
  if (randomShorts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-0 px-2 md:px-0 py-2">
      {randomShorts.map((short, index) => (
        <ShortsCard key={`${short.id}-${index}`} video={short} />
      ))}
    </div>
  );
}
