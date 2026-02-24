"use client";

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/Navbar/BottomNav";
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

        <main className="flex-1 pt-12 py-0  lg:pt-0 lg:pb-0 ">
          <Outlet />
        </main>

        <Footer className="hidden lg:block" />
        <BottomNav />
      </div>
    </>
  );
};

export default PublicLayout;
