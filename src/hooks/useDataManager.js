// hooks/use-data-manager.js

import { useCallback } from "react";
import useSWR from "swr";
import {
  fetchVideos,
  fetchVideoById,
  fetchShorts,
  fetchShortById,
  fetchPlaylists,
  fetchPlaylistById,
  searchAll,
} from "../api/youtube";

/* ===============================
   SWR CONFIG GLOBAL
================================ */
const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 1000 * 60 * 5, // 5 menit — tidak fetch ulang
  revalidateIfStale: false, // pakai cache sampai expired
};

/* ===============================
   FETCHERS PER COLLECTION
================================ */
const FETCHERS = {
  "youtube-video": () => fetchVideos().then((res) => res?.data ?? []),
  "youtube-short": () => fetchShorts().then((res) => res?.data ?? []),
  "youtube-playlist": () => fetchPlaylists().then((res) => res?.data ?? []),
};

/* ===============================
   MAIN HOOK
================================ */
const useDataManager = (collectionName) => {
  const fetcher = FETCHERS[collectionName] ?? null;

  const { data, isLoading, mutate } = useSWR(
    fetcher ? collectionName : null, // null = skip fetch kalau tidak dikenal
    fetcher,
    SWR_CONFIG,
  );

  /* ===============================
     FETCH BY ID (basic)
  ================================ */
  const fetchById = useCallback(
    async (id) => {
      if (!id) return null;

      switch (collectionName) {
        case "youtube-video":
          return fetchVideoById(id).then((res) => res?.data ?? null);
        case "youtube-short":
          return fetchShortById(id).then((res) => res?.data ?? null);
        case "youtube-playlist":
          return fetchPlaylistById(id).then((res) => res?.data ?? null);
        default:
          return null;
      }
    },
    [collectionName],
  );

  /* ===============================
     FETCH BY ID FULL
  ================================ */
  const fetchByIdFull = useCallback(
    async (id) => {
      if (!id) return null;

      let rawRes = null;

      switch (collectionName) {
        case "youtube-video":
          rawRes = await fetchVideoById(id);
          break;
        case "youtube-short":
          rawRes = await fetchShortById(id);
          break;
        case "youtube-playlist":
          rawRes = await fetchPlaylistById(id);
          break;
        default:
          return null;
      }

      if (!rawRes?.data) return null;

      return {
        ...rawRes.data,
        related: rawRes.related ?? [],
        related_count: rawRes.related_count ?? 0,
      };
    },
    [collectionName],
  );

  /* ===============================
     FETCH PLAYLIST BY ID
  ================================ */
  const fetchPlaylist = useCallback(async (id) => {
    if (!id) return null;

    const res = await fetchPlaylistById(id);
    if (!res?.data) return null;

    const videos = res.data.videos ?? [];
    const shorts = res.data.shorts ?? [];

    return {
      ...res.data,
      videos: [...videos, ...shorts].sort(
        (a, b) => new Date(a.published_at) - new Date(b.published_at),
      ),
    };
  }, []);

  /* ===============================
     SEARCH
  ================================ */
  const search = useCallback(async (query, type = "", limit = 50) => {
    if (!query) return [];
    const res = await searchAll(query, type, limit);
    return res?.data ?? [];
  }, []);

  return {
    data: data ?? [],
    loading: isLoading,
    fetchAll: mutate,
    fetchById,
    fetchByIdFull,
    fetchPlaylist,
    search,
  };
};

export default useDataManager;
