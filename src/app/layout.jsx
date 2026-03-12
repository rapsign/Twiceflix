import "../index.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
  description:
    "Everything TWICE in one place — music videos, live performances, and behind-the-scenes content.",
  robots: "index, follow",
  manifest: "/site.webmanifest",

  verification: {
    google: "oey4hxhG8X7Lebq5pDwDOiy5kFrRYsUan0Mdhmnc7jM",
  },

  appleWebApp: {
    title: "TWICEFLIX",
    capable: true,
    statusBarStyle: "default",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
    siteName: "TWICEFLIX",
    images: ["https://twiceflix.vercel.app/og.webp"],
  },

  twitter: {
    title: "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content",
    card: "summary_large_image",
    images: ["https://twiceflix.vercel.app/og.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
