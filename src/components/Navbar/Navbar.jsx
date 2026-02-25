"use client";

import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { TextLogo } from "../Logo";
import SearchBox from "./SearchBox";

function useScrollDirection(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY.current;

          if (Math.abs(diff) >= threshold) {
            setVisible(diff < 0 || currentScrollY < threshold);
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return visible;
}

const Navbar = ({ onToggleSidebar }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const isVisible = useScrollDirection(10);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-black
        transition-transform duration-300 ease-in-out
        ${!isVisible ? "-translate-y-full md:translate-y-0" : "translate-y-0"}`}
    >
      <div className="relative flex items-center justify-between h-14">
        {/* Kiri: hamburger + logo */}
        <div
          className={`flex items-center gap-1 pl-2 lg:pl-3 transition-all duration-200 ${
            mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <TextLogo Width="100px" />
        </div>

        {/* Search */}
        <div className="md:ml-auto pr-2 md:pr-3 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:pr-0">
          <SearchBox onMobileOpenChange={setMobileSearchOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
