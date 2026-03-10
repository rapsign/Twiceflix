export const revalidate = 3600;

const BASE_URL = "https://twiceflix.vercel.app";

async function fetchAPI(path) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (!base) return [];
    const res = await fetch(`${base}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? json.items ?? []);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [videos, shorts] = await Promise.all([
    fetchAPI("/youtube_video"),
    fetchAPI("/youtube_short"),
  ]);

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

  const videoRoutes = (videos ?? []).map((video) => ({
    url: `${BASE_URL}/watch?tv=${video.id}`,
    lastModified: video.updated_at ? new Date(video.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const shortRoutes = (shorts ?? []).map((short) => ({
    url: `${BASE_URL}/shorts?id=${short.id}`,
    lastModified: short.updated_at ? new Date(short.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...videoRoutes, ...shortRoutes];
}
