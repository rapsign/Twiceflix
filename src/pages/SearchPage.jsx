"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import VideoCard from "@/components/Videos/VideoCard";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import useDataManager from "../../hooks/useDataManager";

const ITEMS_PER_PAGE = 30;

export default function SearchPage() {
  const location = useLocation();
  const [queryTerm, setQueryTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const loaderRef = useRef(null);

  const { search } = useDataManager("youtube_video");

  // Extract query dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    setQueryTerm(q.trim());
    setDisplayCount(ITEMS_PER_PAGE);
  }, [location.search]);

  // Fetch hasil search saat queryTerm berubah
  useEffect(() => {
    if (!queryTerm) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setResults([]);
    setDisplayCount(ITEMS_PER_PAGE);

    search(queryTerm)
      .then((data) => {
        if (!cancelled) {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [queryTerm]);

  const displayedResults = useMemo(
    () => results.slice(0, displayCount),
    [results, displayCount],
  );

  const hasMore = displayCount < results.length;

  // Infinite scroll — pakai callback ref supaya selalu observe elemen terbaru
  const observerRef = useRef(null);

  const loaderCallbackRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(node);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {queryTerm
            ? `Search: ${queryTerm} - TWICEFLIX`
            : "Search - TWICEFLIX"}
        </title>
        <meta
          name="description"
          content={`Search results for "${queryTerm}" on TWICEFLIX`}
        />
      </Helmet>

      <div className="p-0 md:p-4 min-h-screen">
        <h1 className="text-base md:text-xl font-semibold text-white mb-3 md:pt-16 px-2">
          {queryTerm ? (
            <>
              Search Results for:{" "}
              <span className="text-[#3EA6FF]">"{queryTerm}"</span>
              {!loading && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({results.length}{" "}
                  {results.length === 1 ? "result" : "results"})
                </span>
              )}
            </>
          ) : (
            "Search Results"
          )}
        </h1>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <LoadingSpinner />
            <p className="text-neutral-400 text-sm">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && displayedResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-2">
              {displayedResults.map((item) =>
                item.type === "playlist" ? (
                  <PlaylistCard key={`playlist-${item.id}`} playlist={item} />
                ) : (
                  <VideoCard key={`video-${item.id}`} video={item} />
                ),
              )}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div
                ref={loaderCallbackRef}
                className="flex justify-center items-center py-8"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              </div>
            )}

            {!hasMore && results.length > ITEMS_PER_PAGE && (
              <p className="text-center text-muted-foreground py-8">
                All results loaded ({results.length} total)
              </p>
            )}
          </>
        )}

        {/* No results */}
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

        {/* Empty state */}
        {!loading && !queryTerm && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg">
              Enter a search term to find videos and playlists
            </p>
          </div>
        )}
      </div>
    </>
  );
}
