// src/app/(main)/videos/page.jsx
import VideosClient from "./videos-client";

export const metadata = {
  title: "Videos | TWICEFLIX",
  description:
    "Watch all TWICE music videos, live performances, variety shows, and more. Browse hundreds of TWICE videos in one place.",
};

export default function VideosPage() {
  return <VideosClient />;
}
