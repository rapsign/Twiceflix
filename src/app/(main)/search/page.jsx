// src/app/(main)/search/page.jsx
import SearchClient from "./search-client";

export const metadata = {
  title: "Search | TWICEFLIX",
  description:
    "Search for TWICE music videos, shorts, live performances, and playlists on TWICEFLIX.",
};

export default function SearchPage() {
  return <SearchClient />;
}
