import "../index.css";
import { Toaster } from "sonner";

const SITE_URL = "https://twiceflix.vercel.app";
const SITE_NAME = "TWICEFLIX";
const TITLE = "TWICEFLIX — Your Ultimate Source for TWICE Videos & Content";
const DESCRIPTION =
  "TWICEFLIX is a fan-made catalog that organizes official TWICE music videos, live performances, variety shows, and behind-the-scenes clips from the official YouTube channels. Videos are embedded from YouTube; all rights belong to JYP Entertainment and the respective owners.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "TWICE",
    "TWICEFLIX",
    "TWICE videos",
    "TWICE music videos",
    "TWICE live performances",
    "TWICE fan site",
    "K-pop",
    "ONCE",
  ],
  robots: "index, follow",
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },

  verification: {
    google: "oey4hxhG8X7Lebq5pDwDOiy5kFrRYsUan0Mdhmnc7jM",
  },

  other: {
    rating: "general",
  },

  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "default",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    siteName: SITE_NAME,
    description: DESCRIPTION,
    locale: "en_US",
    images: [`${SITE_URL}/og.webp`],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og.webp`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: "en",
  isFamilyFriendly: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
