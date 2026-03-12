"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPublishedDistance } from "@/utils/time";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import { Share2, MoreVertical, Flag } from "lucide-react";
import { ShareDialog } from "../../../../components/ui/share-dialog";
import { ReportDialog } from "../../../../components/ui/report-dialog";

const COLLAPSED_HEIGHT = 40;

const linkifyOptions = {
  className: "text-[#3EA6FF] hover:text-[#5AB3FF]",
  rel: "noopener noreferrer",
  formatHref: {
    hashtag: (href) => `/search?q=${href.substring(1)}`,
  },
  target: {
    url: "_blank",
    hashtag: "_self",
  },
  attributes: {
    url: { className: "underline" },
    hashtag: { className: "font-semibold" },
  },
};

export default function VideoInfo({ video }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
    setExpanded(false);
  }, [video.description]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <ShareDialog
        open={shareOpen}
        onClose={setShareOpen}
        id={video.id}
        title={video.title}
        type="watch"
      />
      <ReportDialog
        open={reportOpen}
        onClose={setReportOpen}
        id={video.id}
        type="watch"
      />

      <div className="px-4 pt-3 xl:pt-0 xl:px-2 md:px-4 flex items-start justify-between gap-2">
        <Linkify options={linkifyOptions}>
          <h1 className="text-base md:text-lg lg:text-xl font-semibold flex-1">
            {video.title}
          </h1>
        </Linkify>

        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="w-4 h-4" />
          </Button>

          {/* <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-50 w-40 rounded-xl bg-neutral-800 shadow-xl border border-neutral-700 overflow-hidden">
                <button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-neutral-700 transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    setReportOpen(true);
                  }}
                >
                  <Flag className="w-4 h-4 text-neutral-400" />
                  Report
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>

      <div className="px-2 md:px-4 xl:px-0">
        <Card
          className="p-0 border-neutral-900"
          onClick={() => isOverflowing && setExpanded((p) => !p)}
        >
          <CardContent className="space-y-1 px-4 py-4">
            <p className="text-[11px] md:text-sm font-medium text-muted-foreground">
              {formatPublishedDistance(video.published_at)}
            </p>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: expanded
                  ? contentRef.current?.scrollHeight
                  : COLLAPSED_HEIGHT,
              }}
            >
              <Linkify options={linkifyOptions}>
                <div
                  ref={contentRef}
                  className="text-sm md:text-base leading-relaxed whitespace-pre-line"
                >
                  {video.description}
                </div>
              </Linkify>
            </div>

            {isOverflowing && (
              <button
                className="text-sm font-semibold hover:underline focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((p) => !p);
                }}
              >
                {expanded ? "Show less" : "...more"}
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
