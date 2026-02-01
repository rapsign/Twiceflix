"use client";

import { useLocation, Link } from "react-router-dom";
import { TextLogo } from "../Logo";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const links = ["Home", "Videos", "Playlist", "About"];

const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (item) => {
    const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    return location.pathname === path;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-black w-64 p-6 sm:w-80 text-white"
      >
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Navigation Menu</VisuallyHidden>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <VisuallyHidden>
            This menu allows you to navigate to different sections of the site.
          </VisuallyHidden>
        </SheetDescription>
        <nav className="flex flex-col gap-4 mt-4 justify-center items-center h-full">
          <TextLogo Width="120px" />
          {links.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors",
                isActive(item)
                  ? "text-red-500"
                  : "text-white hover:text-red-500",
              )}
            >
              {item}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
