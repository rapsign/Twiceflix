"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Plus,
  Link,
  Tag,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { TextLogo } from "../ui/Logo";
import SearchBox from "./SearchBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

const CATEGORIES = ["Video", "Short", "Playlist"];

function extractYouTubeId(input, category) {
  const trimmed = input.trim();
  try {
    const u = new URL(trimmed);
    if (category === "Playlist" && u.searchParams.get("list"))
      return u.searchParams.get("list");
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.pathname.startsWith("/shorts/"))
      return u.pathname.split("/shorts/")[1];
    if (u.searchParams.get("list")) return u.searchParams.get("list");
  } catch {}
  return trimmed;
}

function AddDialog({ open, onClose }) {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Video");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = (v) => {
    if (!v) {
      setUrl("");
      setCategory("Video");
      setSubmitted(false);
    }
    onClose(v);
  };

  const videoId = url ? extractYouTubeId(url, category) : null;
  const isPlaylist = category === "Playlist";

  const thumbnailId = (() => {
    if (!url) return null;
    try {
      const u = new URL(url.trim());
      if (isPlaylist && u.searchParams.get("v")) return u.searchParams.get("v");
    } catch {}
    return isPlaylist ? null : videoId;
  })();

  const thumbnail = thumbnailId
    ? `https://i.ytimg.com/vi/${thumbnailId}/hqdefault.jpg`
    : null;

  // Auto-detect category dari URL
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    try {
      const u = new URL(val.trim());
      if (u.searchParams.get("list")) setCategory("Playlist");
      else if (u.pathname.startsWith("/shorts/")) setCategory("Short");
      else if (u.searchParams.get("v") || u.hostname === "youtu.be")
        setCategory("Video");
    } catch {}
  };

  const handleSubmit = () => {
    if (!url.trim()) return;
    // TODO: POST ke API dengan { id: videoId, category }
    setSubmitted(true);
    setTimeout(() => handleClose(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add to TWICEFLIX</DialogTitle>
          <DialogDescription className="text-sm text-neutral-400 leading-relaxed">
            Help us grow the TWICEFLIX collection! Submit a TWICE video, short,
            or playlist that's missing from our library. We'll fetch the details
            automatically from YouTube.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-neutral-400 text-center">
              Submitted! We'll review and add it to the library soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-neutral-400 font-medium">
                  Category
                </label>
                <span className="text-xs text-neutral-600">
                  Auto-detected from URL
                </span>
              </div>
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setCategoryOpen((p) => !p)}
                  className="w-full flex items-center justify-between bg-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-neutral-500" />
                    {category}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {categoryOpen && (
                  <div className="absolute top-12 left-0 right-0 z-50 bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden shadow-xl">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          category === c
                            ? "text-white bg-neutral-700 font-medium"
                            : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">
                {isPlaylist
                  ? "Playlist URL or Playlist ID"
                  : "YouTube URL or Video ID"}
              </label>
              <div className="flex items-center gap-2 bg-neutral-800 rounded-xl px-3 py-2.5">
                <Link className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(e)}
                  placeholder={
                    isPlaylist
                      ? "https://youtube.com/playlist?list=... or PLxxxx"
                      : "https://youtube.com/watch?v=... or video ID"
                  }
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
              {videoId && (
                <p className="text-xs text-neutral-600 font-mono px-1">
                  ID: {videoId}
                </p>
              )}
            </div>

            {/* Thumbnail preview — hanya untuk Video & Short */}
            {thumbnail && (
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Preview
                </label>
                <div className="rounded-xl overflow-hidden aspect-video bg-neutral-800 relative">
                  <img
                    src={thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center gap-2 text-neutral-500 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    Preview not available
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-full bg-white hover:bg-white/80 text-black"
                disabled={!url.trim()}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const Navbar = ({ onToggleSidebar }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const isVisible = useScrollDirection(10);

  return (
    <>
      <AddDialog open={addOpen} onClose={setAddOpen} />

      <nav
        className={`fixed top-0 w-full z-50 bg-black
          transition-transform duration-300 ease-in-out
          ${!isVisible ? "-translate-y-full md:translate-y-0" : "translate-y-0"}`}
      >
        <div className="relative flex items-center justify-between md:h-15 h-14 lg:h-12">
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

          {/* Desktop: Search tengah */}
          <div className="hidden md:block md:ml-auto pr-2 md:pr-3 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:pr-0">
            <SearchBox onMobileOpenChange={setMobileSearchOpen} />
          </div>

          {/* Kanan: mobile search + add button */}
          <div className="flex items-center gap-1 pr-2 lg:pr-3">
            {/* Mobile SearchBox — TIDAK ikut di-hide, selalu bisa diklik */}
            <div className="md:hidden">
              <SearchBox onMobileOpenChange={setMobileSearchOpen} />
            </div>

            {/* Add button — sembunyikan saat mobile search terbuka */}
            {/* <button
              onClick={() => setAddOpen(true)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-600 transition-colors text-sm transition-all duration-200 ${
                mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Video</span>
            </button> */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
