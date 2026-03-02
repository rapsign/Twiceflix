// src/app/(main)/watch/page.jsx
import WatchClient from "./watch-client";

export const metadata = {
  title: "Watch | TWICEFLIX",
  description:
    "Watch TWICE music videos, live performances, and more on TWICEFLIX.",
};

export default function WatchPage() {
  return <WatchClient />;
}
