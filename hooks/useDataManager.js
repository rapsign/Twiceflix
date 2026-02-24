// hooks/useDataManager.js
import { useState, useEffect } from "react";
import {
  fetchVideos,
  fetchVideoById,
  fetchShorts,
  fetchShortById,
  fetchPlaylists,
  fetchPlaylistById,
  searchAll,
} from "../src/api/youtube";

const useDataManager = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH ALL
  ================================ */
  const fetchAll = async () => {
    setLoading(true);
    let result = [];

    switch (collectionName) {
      case "youtube_video":
        result = await fetchVideos().then((res) => res.data ?? []);
        break;
      case "youtube_short":
        result = await fetchShorts().then((res) => res.data ?? []);
        break;
      case "youtube_playlist":
        result = await fetchPlaylists().then((res) => res.data ?? []);
        break;
    }

    setData(result);
    setLoading(false);
    return result;
  };

  /* ===============================
     FETCH BY ID (data dasar, tanpa related)
  ================================ */
  const fetchById = async (id) => {
    if (!id) return null;

    switch (collectionName) {
      case "youtube_video":
        return fetchVideoById(id).then((res) => res.data ?? null);
      case "youtube_short":
        return fetchShortById(id).then((res) => res.data ?? null);
      case "youtube_playlist":
        return fetchPlaylistById(id).then((res) => res.data ?? null);
      default:
        return null;
    }
  };

  /* ===============================
     FETCH BY ID FULL
     Return raw response — field root seperti
     `related`, `videos`, `shorts` ikut tersedia
  ================================ */
  const fetchByIdFull = async (id) => {
    if (!id) return null;

    let rawRes = null;

    switch (collectionName) {
      case "youtube_video":
        rawRes = await fetchVideoById(id);
        break;
      case "youtube_short":
        rawRes = await fetchShortById(id);
        break;
      case "youtube_playlist":
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
  };

  /* ===============================
     FETCH PLAYLIST BY ID
     (termasuk videos & shorts di dalamnya)
  ================================ */
  const fetchPlaylist = async (id) => {
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
  };

  /* ===============================
     SEARCH
  ================================ */
  const search = async (query, type = "", limit = 50) => {
    if (!query) return [];
    const res = await searchAll(query, type, limit);
    return res?.data ?? [];
  };

  useEffect(() => {
    let mounted = true;
    fetchAll().then((res) => {
      if (mounted) setData(res ?? []);
    });
    return () => {
      mounted = false;
    };
  }, [collectionName]);

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
