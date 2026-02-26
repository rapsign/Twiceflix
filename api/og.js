export const config = {
  runtime: "edge",
};

const BASE_URL = "https://twiceflix.vercel.app";
const API_BASE_URL = "https://twiceflix-api.vercel.app";
const API_KEY = process.env.API_KEY;

const DEFAULT_META = {
  title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
  description:
    "Everything TWICE in one place — music videos, live performances, and behind-the-scenes content.",
  image: `${BASE_URL}/og.webp`,
};

async function fetchVideo(videoId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
      headers: { "x-api-key": API_KEY ?? "" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isBot(userAgent) {
  if (!userAgent) return false;
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "telegrambot",
    "slackbot",
    "discordbot",
    "googlebot",
    "bingbot",
    "applebot",
    "ia_archiver",
  ];
  return bots.some((bot) => userAgent.toLowerCase().includes(bot));
}

export default async function handler(req) {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") ?? "";
  const match = url.pathname.match(/^\/watch\/([^/]+)/);
  const videoId = match?.[1];

  // Bukan bot → fetch index.html ASLI dari public Vercel (bukan dari req URL)
  if (!videoId || !isBot(userAgent)) {
    const indexRes = await fetch(`${BASE_URL}/index.html`, {
      headers: { "x-vercel-skip-toolbar": "1" },
    });
    return new Response(await indexRes.text(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Bot → fetch video data lalu inject OG tags
  const video = await fetchVideo(videoId);

  const meta = video
    ? {
        title: `${video.title} — TWICEFLIX`,
        description: video.description
          ? video.description.substring(0, 157) + "..."
          : `Watch ${video.title} on TWICEFLIX`,
        image: video.thumbnail ?? DEFAULT_META.image,
        url: `${BASE_URL}/watch/${videoId}`,
      }
    : { ...DEFAULT_META, url: `${BASE_URL}/watch/${videoId}` };

  // Fetch index.html asli lalu inject OG tags
  const indexRes = await fetch(`${BASE_URL}/index.html`, {
    headers: { "x-vercel-skip-toolbar": "1" },
  });
  const html = (await indexRes.text()).replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="video.other" />
    <meta property="og:site_name" content="TWICEFLIX" />
    <meta property="og:url" content="${escapeHtml(meta.url)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${escapeHtml(meta.image)}" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
