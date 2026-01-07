"use client";

import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { TextLogo } from "../Logo";
import SearchBox from "./SearchBox";
import MobileDrawer from "./MobileDrawer";

import { useLocation, Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const links = ["Home", "Videos", "Playlist", "About"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fungsi untuk cek apakah link aktif
  const isActive = (link) => {
    const path = link === "Home" ? "/" : `/${link.toLowerCase()}`;
    return location.pathname === path;
  };

  return (
    <nav
      className={`
    fixed top-0 w-full z-50 transition-colors duration-300
    ${isScrolled ? "bg-black/80" : "md:bg-transparent bg-black/80"}
  `}
    >
      {/* Mobile Navbar */}
      <div className="flex items-center justify-between p-2 lg:hidden">
        <div className="w-1/3">
          <TextLogo Width="120px" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <SearchBox />
          <button
            className="text-white text-lg p-2 rounded hover:bg-white/20 transition"
            onClick={() => setIsOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex-1">
          <TextLogo Width="120px" />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {links.map((link) => (
                <NavigationMenuItem key={link}>
                  <NavigationMenuLink
                    asChild
                    className={`font-medium transition-colors ${
                      isActive(link)
                        ? "text-red-500"
                        : "text-white hover:text-red-500"
                    }`}
                  >
                    <Link to={link === "Home" ? "/" : `/${link.toLowerCase()}`}>
                      {link}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Box */}
        <div className="flex-1 flex justify-end">
          <SearchBox />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

export default Navbar;
