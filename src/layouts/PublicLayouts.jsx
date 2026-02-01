"use client";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const PublicLayout = ({ title, description, keywords, author }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/video-player";

  return (
    <>
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
        <meta name="author" content={author || "Rinaldi Prayuda"} />
      </Helmet>

      <div className="min-h-screen flex flex-col text-white">
        {!hideNavbar && <Navbar />}

        <main className="flex-1 pt-13 md:pt-0">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PublicLayout;
