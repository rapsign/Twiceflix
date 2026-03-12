// hooks/use-data-manager.js

import { useState, useEffect, useCallback } from "react";
import {
  fetchVideos,
  fetchVideoById,
  fetchShorts,
  fetchShortById,
  fetchPlaylists,
  fetchPlaylistById,
  searchAll,
} from "../api/youtube";

const useDataManager = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH ALL
  ================================ */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    let result = [];

    switch (collectionName) {
      case "youtube-video":
        result = await fetchVideos().then((res) => res?.data ?? []);
        break;
      case "youtube-short":
        result = await fetchShorts().then((res) => res?.data ?? []);
        break;
      case "youtube-playlist":
        result = await fetchPlaylists().then((res) => res?.data ?? []);
        break;
      default:
        result = [];
    }

    setData(result);
    setLoading(false);
    return result;
  }, [collectionName]);

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

  /* ===============================
     AUTO FETCH ON COLLECTION CHANGE
  ================================ */
  useEffect(() => {
    let mounted = true;

    fetchAll().then((res) => {
      if (mounted) setData(res ?? []);
    });

    return () => {
      mounted = false;
    };
  }, [fetchAll]);

  return {
    data,
    loading,
    fetchAll,
    fetchById,
    fetchByIdFull,
    fetchPlaylist,
    search,
  };
};

export default useDataManager;
