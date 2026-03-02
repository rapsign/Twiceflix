// src/app/(main)/playlists/page.jsx
// Server component wrapper — metadata bisa di-export di sini
import PlaylistsClient from "./playlists-client";

export const metadata = {
  title: "Playlists | TWICEFLIX",
  description:
    "Browse all TWICE playlists — music videos, live performances, variety shows, and more curated collections.",
};

export default function PlaylistsPage() {
  return <PlaylistsClient />;
}
