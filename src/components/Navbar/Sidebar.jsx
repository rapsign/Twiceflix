"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconHomeFilled,
  IconBrandYoutube,
  IconBrandYoutubeFilled,
  IconPlaylist,
  IconListDetails,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconLetterS,
} from "@tabler/icons-react";

const navLinks = [
  { name: "Home", path: "/", icon: IconHome, iconFilled: IconHomeFilled },
  {
    name: "Videos",
    path: "/videos",
    icon: IconBrandYoutube,
    iconFilled: IconBrandYoutubeFilled,
  },
  {
    name: "Shorts",
    path: "/shorts",
    icon: IconLetterS,
    iconFilled: IconLetterS,
  },
  {
    name: "Playlists",
    path: "/playlists",
    icon: IconPlaylist,
    iconFilled: IconListDetails,
  },
  {
    name: "About",
    path: "/about",
    icon: IconInfoCircle,
    iconFilled: IconInfoCircleFilled,
  },
];

export default function Sidebar({ isCollapsed = true }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div
      className={`flex flex-col h-screen bg-black shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-0 opacity-0" : "w-56 px-2 pt-3.5 opacity-100"
      }`}
    >
      <nav className="flex flex-col gap-1 flex-1 mt-12">
        {navLinks.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.iconFilled : item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                active
                  ? "bg-neutral-800 text-white"
                  : "text-white/50 hover:bg-neutral-900 hover:text-white/90",
              )}
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 pt-4 mt-2 pb-2 text-center whitespace-nowrap">
        <p className="text-xs text-neutral-400">Developed With ❤️ by</p>
        <a
          href="https://rinaldi-a-prayuda.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium hover:underline text-xs"
        >
          RapSign
        </a>
      </div>
    </div>
  );
}
