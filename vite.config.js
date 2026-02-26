import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import path from "path";

const BASE_URL = "https://twiceflix.vercel.app";
const OG_IMAGE = `${BASE_URL}/og.webp`;
const OG_TITLE = "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content";
const OG_DESCRIPTION =
  "Everything TWICE in one place — music videos, live performances, and behind-the-scenes content.";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      inject: {
        tags: [
          // ── Primary ──────────────────────────────────────────────────────
          {
            tag: "meta",
            attrs: { name: "title", content: OG_TITLE },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "description", content: OG_DESCRIPTION },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "author", content: "Rinaldi A Prayuda" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "robots", content: "index, follow" },
            injectTo: "head",
          },
          // ── Open Graph ───────────────────────────────────────────────────
          {
            tag: "meta",
            attrs: { property: "og:type", content: "website" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:site_name", content: "TWICEFLIX" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:locale", content: "id_ID" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:url", content: `${BASE_URL}/` },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:title", content: OG_TITLE },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:description", content: OG_DESCRIPTION },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:image", content: OG_IMAGE },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:image:width", content: "1200" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:image:height", content: "630" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: {
              property: "og:image:alt",
              content: "TWICEFLIX — TWICE Videos & Content",
            },
            injectTo: "head",
          },
          // ── Twitter ──────────────────────────────────────────────────────
          {
            tag: "meta",
            attrs: { name: "twitter:card", content: "summary_large_image" },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "twitter:url", content: `${BASE_URL}/` },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "twitter:title", content: OG_TITLE },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "twitter:description", content: OG_DESCRIPTION },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { name: "twitter:image", content: OG_IMAGE },
            injectTo: "head",
          },
          // ── Canonical ────────────────────────────────────────────────────
          {
            tag: "link",
            attrs: { rel: "canonical", href: `${BASE_URL}/` },
            injectTo: "head",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://twiceflix-api.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
