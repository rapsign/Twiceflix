import { API_BASE, defaultHeaders } from "@/api/config";

const BASE_URL = "https://twiceflix.vercel.app";

async function fetchAPI(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: defaultHeaders });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [videos, shorts] = await Promise.all([
    fetchAPI("/youtube_video"),
    fetchAPI("/youtube_short"),
  ]);

  // Static routes
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/shorts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/playlists`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // /watch?tv=VIDEO_ID
  const videoRoutes = (videos ?? []).map((video) => ({
    url: `${BASE_URL}/watch?tv=${video.id}`,
    lastModified: video.updated_at ? new Date(video.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // /shorts?id=SHORT_ID
  const shortRoutes = (shorts ?? []).map((short) => ({
    url: `${BASE_URL}/shorts?id=${short.id}`,
    lastModified: short.updated_at ? new Date(short.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...videoRoutes, ...shortRoutes];
}
