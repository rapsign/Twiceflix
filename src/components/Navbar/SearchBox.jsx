"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBox({ onMobileOpenChange }) {
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const isUserTyping = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileOpen(false);
        onMobileOpenChange?.(false);
      }
    };

    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [onMobileOpenChange]);

  const handleChange = (e) => {
    isUserTyping.current = true;
    setQuery(e.target.value);
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      router.push("/videos");
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleMobileOpen = () => {
    setMobileOpen(true);
    onMobileOpenChange?.(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
    setQuery("");
    onMobileOpenChange?.(false);
  };

  useEffect(() => {
    if (!isUserTyping.current) return;

    const handler = setTimeout(() => {
      isUserTyping.current = false;
      handleSubmit();
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  if (!mounted) return null;

  if (isMobile && !mobileOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMobileOpen}
        className="h-9 px-5 rounded-r-full text-white shrink-0"
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        isMobile ? "fixed inset-x-0 top-0 h-14 bg-black px-2 z-50" : ""
      }`}
    >
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMobileClose}
          className="shrink-0 text-white hover:text-white/90 hover:bg-neutral-800
          rounded-full h-12 w-12
          [&>svg]:!h-7 [&>svg]:!w-7"
        >
          <ChevronLeft />
        </Button>
      )}

      <div className="flex flex-1 items-center">
        <div className="flex flex-1 items-center rounded-l-full border border-neutral-600 bg-neutral-900 px-4 h-9 focus-within:border-blue-500 transition-colors">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape" && isMobile) handleMobileClose();
            }}
            className="flex-1 border-0 bg-transparent md:w-56 lg:w-96 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-neutral-500 text-sm p-0 h-auto"
          />

          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="w-6 h-6 shrink-0 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="h-9 px-5 rounded-r-full rounded-l-none border border-l-0 border-neutral-600 bg-neutral-800 hover:bg-neutral-700 text-white shrink-0"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
