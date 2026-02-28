"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import BottomNav from "../components/Navbar/BottomNav";
import Sidebar from "../components/Navbar/Sidebar";

const HIDE_NAVBAR_PATHS = ["/login", "/video-player"];
const HIDE_SIDEBAR_PATHS = ["/login", "/video-player"];
const HIDE_BOTTOMNAV_PATHS = ["/shorts"];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const PublicLayout = ({ children }) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isShortsPage = pathname.startsWith("/shorts");
  const isWatchPage = pathname.startsWith("/watch");

  useEffect(() => {
    if (isWatchPage) setSidebarCollapsed(true);
  }, [isWatchPage]);

  const hideNavbar =
    HIDE_NAVBAR_PATHS.some((p) => pathname.startsWith(p)) ||
    (isShortsPage && isMobile);

  const hideSidebar =
    HIDE_SIDEBAR_PATHS.some((p) => pathname.startsWith(p)) ||
    (isShortsPage && isMobile);

  const hideBottomNav = HIDE_BOTTOMNAV_PATHS.some((p) =>
    pathname.startsWith(p),
  );

  return (
    <div className="min-h-screen flex flex-col text-white bg-black">
      {!hideNavbar && (
        <Navbar onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
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
          {children}
        </main>
      </div>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default PublicLayout;
