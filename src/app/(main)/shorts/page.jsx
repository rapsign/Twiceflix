// src/app/(main)/shorts/page.jsx
import ShortsClient from "./shorts-client";

export const metadata = {
  title: "Shorts | TWICEFLIX",
  description:
    "Watch TWICE short videos and clips. Quick moments, funny behind-the-scenes, and more from your favorite K-pop group.",
};

export default function ShortsPage() {
  return <ShortsClient />;
}
