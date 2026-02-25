"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { TextLogo } from "../Logo";
import SearchBox from "./SearchBox";

const Navbar = ({ onToggleSidebar }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black">
      <div className="relative flex items-center justify-between h-14">
        {/* Kiri: hamburger + logo */}
        <div
          className={`flex items-center gap-1 pl-2 lg:pl-3 transition-all duration-200 ${
            mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Hamburger — hanya desktop */}
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <TextLogo Width="100px" />
        </div>

        {/* Search */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 pr-2 md:pr-0">
          <SearchBox onMobileOpenChange={setMobileSearchOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
