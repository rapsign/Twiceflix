"use client";

// src/app/(main)/search/SearchClient.jsx
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import VideoCard from "@/app/(main)/videos/_components/VideoCard";
import PlaylistCard from "@/app/(main)/playlists/_components/PlaylistCard";
import ShortsCard from "@/app/(main)/shorts/_components/ShortsCard";
import useDataManager from "@/hooks/useDataManager";

const BATCH_MOBILE = 4;
const BATCH_DESKTOP = 6;

function useBatchSize() {
  const [batchSize, setBatchSize] = useState(BATCH_DESKTOP);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = (e) =>
      setBatchSize(e.matches ? BATCH_MOBILE : BATCH_DESKTOP);
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return batchSize;
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [queryTerm, setQueryTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const batchSize = useBatchSize();
  const { search } = useDataManager("youtube-video");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQueryTerm(q.trim().replace(/\s+/g, " "));
  }, [searchParams]);

  useEffect(() => {
    if (!queryTerm) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setResults([]);

    search(queryTerm)
      .then((data) => {
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryTerm]);

  const videoChunks = useMemo(
    () =>
      chunkArray(
        results.filter((i) => !i.is_short),
        batchSize,
      ),
    [results, batchSize],
  );
  const shortChunks = useMemo(
    () =>
      chunkArray(
        results.filter((i) => i.is_short),
        batchSize,
      ),
    [results, batchSize],
  );
  const maxChunks = Math.max(videoChunks.length, shortChunks.length);

  return (
    <div className="p-0 md:p-2 min-h-screen">
      <h1 className="text-base md:text-xl font-semibold text-white px-2 my-2 lg:pt-12 ">
        {queryTerm ? (
          <>
            Search Results for:{" "}
            <span className="text-[#3EA6FF]">"{queryTerm}"</span>
            {!loading && (
              <span className="text-sm text-muted-foreground ml-2">
                ({results.length} {results.length === 1 ? "result" : "results"})
              </span>
            )}
          </>
        ) : (
          "Search Results"
        )}
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-neutral-400 text-sm">Searching...</p>
        </div>
      )}

      {!loading &&
        Array.from({ length: maxChunks }).map((_, idx) => (
          <div key={idx}>
            {videoChunks[idx] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                {videoChunks[idx].map((item) =>
                  item.type === "playlist" ? (
                    <PlaylistCard key={`playlist-${item.id}`} playlist={item} />
                  ) : (
                    <VideoCard key={`video-${item.id}`} video={item} />
                  ),
                )}
              </div>
            )}

            {shortChunks[idx] && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2  px-2 lg:px-0">
                {shortChunks[idx].map((item) => (
                  <ShortsCard key={`short-${item.id}`} video={item} />
                ))}
              </div>
            )}
          </div>
        ))}

      {!loading && queryTerm && results.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-white text-lg mb-2">
            No results found for "{queryTerm}"
          </p>
          <p className="text-muted-foreground text-sm">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {!loading && !queryTerm && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            Enter a search term to find videos and playlists
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
