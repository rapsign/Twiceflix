"use client";

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar/Navbar";
import BottomNav from "@/components/Navbar/BottomNav";
import Sidebar from "@/components/Navbar/Sidebar";

const HIDE_NAVBAR_PATHS = ["/login", "/video-player"];
const HIDE_SIDEBAR_PATHS = ["/login", "/video-player"];
const HIDE_BOTTOMNAV_PATHS = ["/shorts"];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const PublicLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isShortsPage = location.pathname.startsWith("/shorts");
  const isWatchPage = location.pathname.startsWith("/watch");

  useEffect(() => {
    if (isWatchPage) setSidebarCollapsed(true);
  }, [isWatchPage]);

  const hideNavbar =
    HIDE_NAVBAR_PATHS.some((p) => location.pathname.startsWith(p)) ||
    (isShortsPage && isMobile);

  const hideSidebar =
    HIDE_SIDEBAR_PATHS.some((p) => location.pathname.startsWith(p)) ||
    (isShortsPage && isMobile);

  const hideBottomNav = HIDE_BOTTOMNAV_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );

  return (
    <>
      <Helmet>
        <title>
          TWICEFLIX — Your Ultimate Source for TWICE Videos & Content
        </title>
        <meta
          name="description"
          content="Everything TWICE in one place — music videos, live performances, and behind-the-scenes content."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:site_name" content="TWICEFLIX" />
        <meta
          property="og:image"
          content="https://twiceflix.vercel.app/og.webp"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://twiceflix.vercel.app/og.webp"
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Helmet>

      <div className="min-h-screen flex flex-col text-white bg-black">
        {!hideNavbar && (
          <Navbar
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          />
        )}

        <div className="flex flex-1">
          {!hideSidebar && (
            <aside className="hidden md:flex sticky top-0 h-screen shrink-0">
              <Sidebar isCollapsed={sidebarCollapsed} />
            </aside>
          )}

          <main
            className={`flex-1 flex flex-col min-w-0 ${
              isShortsPage || isWatchPage
                ? ""
                : !hideNavbar
                  ? "pt-14 lg:pt-0 pb-16 lg:pb-0"
                  : ""
            }`}
          >
            <Outlet />
          </main>
        </div>

        {!hideBottomNav && <BottomNav />}
      </div>
    </>
  );
};

export default PublicLayout;
