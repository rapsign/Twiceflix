"use client";

import { useState, useEffect } from "react";
import { TextLogo } from "../Logo";
import SearchBox from "./SearchBox";
import { useLocation, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const links = ["Home", "Videos", "Shorts", "Playlists", "About"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (link) => {
    const path = link === "Home" ? "/" : `/${link.toLowerCase()}`;
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Mobile background — selalu hitam */}
      <div
        className="lg:hidden"
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          pointerEvents: "none",
        }}
      />

      {/* Desktop background — slide dari atas ke bawah */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: isScrolled ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* Mobile */}
      <div className="relative flex items-center justify-between lg:hidden h-12 pl-2">
        <TextLogo Width="100px" />
        <SearchBox />
      </div>

      {/* Desktop */}
      <div className="relative hidden lg:flex items-center justify-between h-14 px-4">
        <div className="flex-1">
          <TextLogo Width="100px" />
        </div>

        {/* Dynamic Island — navigation menu */}
        <div className="flex-1 flex justify-center">
          <div
            style={{
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "9999px",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
              padding: "5px 8px",
            }}
          >
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                {links.map((link) => {
                  const active = isActive(link);
                  return (
                    <NavigationMenuItem key={link}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                          style={{
                            position: "relative",
                            display: "block",
                            padding: "5px 14px",
                            borderRadius: "9999px",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: active ? "#fff" : "rgba(255,255,255,0.5)",
                            background: active
                              ? "rgba(255,255,255,0.1)"
                              : "transparent",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!active)
                              e.currentTarget.style.color =
                                "rgba(255,255,255,0.9)";
                          }}
                          onMouseLeave={(e) => {
                            if (!active)
                              e.currentTarget.style.color =
                                "rgba(255,255,255,0.5)";
                          }}
                        >
                          {link}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <SearchBox />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
