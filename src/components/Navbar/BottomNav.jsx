"use client";

import { useLocation, Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";

const links = [
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
    name: "Playlist",
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

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800 lg:hidden"
      style={{ background: "#000" }}
    >
      <div className="flex items-center justify-around h-14">
        {links.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.iconFilled : item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                active ? "text-white" : "text-neutral-400 hover:text-white",
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
