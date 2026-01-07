"use client";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Helmet } from "react-helmet";

const PublicLayout = ({ title, description, keywords, author }) => {
  const location = useLocation();

  // hide navbar di halaman tertentu
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/video-player";

  return (
    <>
      {/* Meta Data */}
      <Helmet>
        <title>{title || "TWICEFLIX"}</title>
        <meta
          name="description"
          content={
            description ||
            "TWICEFLIX is your ultimate source for everything TWICE! Watch their latest music videos, performances, and behind-the-scenes content."
          }
        />
        <meta
          name="keywords"
          content={
            keywords ||
            "TWICE, TWICEFLIX, K-pop, music, performances, videos, TWICE members"
          }
        />
        <meta name="author" content={author || "RapSign"} />
      </Helmet>

      <div className="min-h-screen bg-neutral-900 text-white">
        {!hideNavbar && <Navbar />}
        <main className="-pt-16">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PublicLayout;
