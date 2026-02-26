/**
 * Vercel Edge Function — Dynamic OG Meta Tags
 *
 * Cara kerja:
 * 1. Request masuk ke /watch/:id (dari Facebook/Twitter/LinkedIn scraper)
 * 2. Edge function fetch data video dari API
 * 3. Inject meta tags spesifik video ke HTML sebelum dikirim ke scraper
 * 4. Browser biasa tetap dapat React app normal
 *
 * Taruh file ini di: api/og.js (root project frontend)
 * Lalu tambahkan rewrite di vercel.json
 */

export const config = {
  runtime: "edge",
};

const BASE_URL = "https://twiceflix.vercel.app";
const API_BASE_URL = "https://your-api.vercel.app"; // ganti dengan URL API kamu
const API_KEY = process.env.API_KEY;

const DEFAULT_META = {
  title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
  description:
    "Everything TWICE in one place — music videos, live performances, and behind-the-scenes content.",
  image: `${BASE_URL}/og.webp`,
  url: BASE_URL,
};

async function fetchVideo(videoId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
      headers: { "x-api-key": API_KEY ?? "" },
      // Timeout 3 detik — jika API lambat, fallback ke default
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

function buildHtml(meta, originalHtml) {
  const ogTags = `
    <!-- Dynamic OG Tags (injected by Edge Function) -->
    <title>${escapeHtml(meta.title)}</title>
    <meta name="title" content="${escapeHtml(meta.title)}" />
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="video.other" />
    <meta property="og:site_name" content="TWICEFLIX" />
    <meta property="og:url" content="${escapeHtml(meta.url)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${escapeHtml(meta.image)}" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image)}" />
    <meta name="twitter:url" content="${escapeHtml(meta.url)}" />`;

  // Ganti semua static OG tags di index.html dengan yang dinamis
  return originalHtml.replace(
    /<!-- Primary Meta Tags -->[\s\S]*?(?=<link rel="icon")/,
    ogTags + "\n    ",
  );
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
  const ua = userAgent.toLowerCase();
  return bots.some((bot) => ua.includes(bot));
}

export default async function handler(req) {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") ?? "";

  // Ambil videoId dari path /watch/:id
  const match = url.pathname.match(/^\/watch\/([^/]+)/);
  const videoId = match?.[1];

  // Jika bukan halaman watch atau bukan bot → serve normal (React app)
  if (!videoId || !isBot(userAgent)) {
    return fetch(req);
  }

  // Fetch index.html asli dari Vercel
  const indexRes = await fetch(`${BASE_URL}/index.html`);
  if (!indexRes.ok) return fetch(req);
  const originalHtml = await indexRes.text();

  // Fetch data video dari API
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
    : {
        ...DEFAULT_META,
        url: `${BASE_URL}/watch/${videoId}`,
      };

  const html = buildHtml(meta, originalHtml);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Cache 1 jam di CDN untuk bot
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
