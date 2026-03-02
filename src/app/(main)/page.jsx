// src/app/(main)/page.jsx
import HomeClient from "./home-client";

export const metadata = {
  title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
  description:
    "Everything TWICE in one place — music videos, live performances, shorts, and behind-the-scenes content.",
};

export default function Home() {
  return <HomeClient />;
}
