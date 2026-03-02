"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * ShareDialog — shared component untuk Watch dan Shorts
 *
 * Props:
 * - open: boolean
 * - onClose: (v: boolean) => void
 * - id: string — YouTube video ID
 * - title: string
 * - type: "watch" | "short" — menentukan URL yang di-share
 */
export function ShareDialog({ open, onClose, id, title, type = "watch" }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? type === "short"
        ? `${window.location.origin}/shorts?id=${id}`
        : `${window.location.origin}/watch?tv=${id}`
      : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) navigator.share({ title, url });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm rounded-2xl border-neutral-900"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex gap-3 items-start">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={title}
              className="w-24 aspect-video rounded-lg object-cover shrink-0"
            />
            <p className="text-sm font-medium line-clamp-3">{title}</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2">
            <p className="text-xs text-neutral-400 truncate flex-1">{url}</p>
            <button
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 h-9 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="flex-1 h-9 rounded-full border border-neutral-600 text-white text-sm font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
