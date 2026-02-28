"use client";

import { useState } from "react";
import { Flag, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REPORT_REASONS = [
  "Not a TWICE content",
  "Duplicate video",
  "Broken or unavailable video",
  "Inappropriate content",
  "Other",
];

/**
 * ReportDialog — shared component untuk Watch dan Shorts
 *
 * Props:
 * - open: boolean
 * - onClose: (v: boolean) => void
 * - id: string — YouTube video ID
 * - type: "watch" | "short"
 */
export function ReportDialog({ open, onClose, id, type = "watch" }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = (v) => {
    if (!v) {
      setSelected(null);
      setNote("");
      setStep(1);
      setSubmitted(false);
    }
    onClose(v);
  };

  const handleSubmit = () => {
    // TODO: POST ke API { id, type, reason: selected, note }
    setSubmitted(true);
    setTimeout(() => handleClose(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-sm rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            Report {type === "short" ? "Short" : "Video"}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-neutral-400 text-center">
              Thank you! We'll review this and fix it if needed.
            </p>
          </div>
        ) : step === 1 ? (
          <div className="space-y-3 pt-1">
            <p className="text-sm text-neutral-400">
              Help us keep TWICEFLIX accurate. What's wrong with this{" "}
              {type === "short" ? "short" : "video"}?
            </p>
            <p className="text-xs text-neutral-600 font-mono">ID: {id}</p>
            <div className="space-y-1">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelected(reason)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    selected === reason
                      ? "bg-red-600/20 text-red-400 font-medium"
                      : "hover:bg-neutral-800 text-white"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleClose(false)}
                className="flex-1 h-9 rounded-full border border-neutral-600 text-white text-sm hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                disabled={!selected}
                onClick={() => setStep(2)}
                className="flex-1 h-9 rounded-full bg-white text-black text-sm font-medium disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl">
              <Flag className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400 font-medium">{selected}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Want to tell us more?</p>
              <p className="text-xs text-neutral-500">It's optional</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add more details here..."
                rows={4}
                className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-9 rounded-full border border-neutral-600 text-white text-sm hover:bg-neutral-800 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
