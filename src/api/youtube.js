import { API_BASE, defaultHeaders } from "./config";

async function fetchCache(url) {
  const res = await fetch(url, { headers: defaultHeaders });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/* ===============================
   VIDEO
================================ */
export const fetchVideos = () => fetchCache(`${API_BASE}/youtube-video`);

export const fetchVideoById = (id) =>
  fetchCache(`${API_BASE}/youtube-video/${id}`);

/* ===============================
   SHORT
================================ */
export const fetchShorts = () => fetchCache(`${API_BASE}/youtube-short`);

export const fetchShortById = (id) =>
  fetchCache(`${API_BASE}/youtube-short/${id}`);

/* ===============================
   PLAYLIST
================================ */
export const fetchPlaylists = () => fetchCache(`${API_BASE}/youtube-playlist`);

export const fetchPlaylistById = (id) =>
  fetchCache(`${API_BASE}/youtube-playlist/${id}`);

/* ===============================
   SEARCH
================================ */
export const searchAll = (query, type = "", limit = 50) => {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (type) params.set("type", type);
  return fetchCache(`${API_BASE}/search?${params.toString()}`);
};
