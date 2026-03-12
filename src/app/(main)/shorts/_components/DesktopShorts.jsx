"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ShareDialog } from '@/components/ShareDialog';
import PersistentSlotContainer from "./PersistentSlotContainer";
import { useSlotPool } from "../_hooks/useSlotPool";
import { ANIM_DURATION } from "./constants";

const DesktopShorts = ({ getShort, total }) => {
  const [paused, setPaused] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeShort, setActiveShort] = useState(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const activePlayerRef = useRef(null);
  const handleNavigate = useCallback(() => setPaused(false), []);

  const { slotData, goNext, goPrev, visualOffset, isNoAnim, isFirst, isLast } =
    useSlotPool(getShort, total, handleNavigate, false);

  useEffect(() => {
    const active = slotData.find((s) => s.role === "active");
    if (active?.short) setActiveShort(active.short);
  }, [slotData]);

  useEffect(() => {
    let lastScroll = 0;
    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScroll < ANIM_DURATION + 100) return;
      lastScroll = now;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  const togglePause = useCallback(() => {
    if (!activePlayerRef.current) return;
    if (paused) {
      activePlayerRef.current.playVideo();
      setPaused(false);
    } else {
      activePlayerRef.current.pauseVideo();
      setPaused(true);
    }
  }, [paused]);

  const handleMuteToggle = useCallback(() => {
    if (!activePlayerRef.current) return;
    if (muted) {
      activePlayerRef.current.unMute();
      activePlayerRef.current.setVolume(volume);
      setMuted(false);
    } else {
      activePlayerRef.current.mute();
      setMuted(true);
    }
  }, [muted, volume]);

  const handleVolumeChange = useCallback((e) => {
    const val = Number(e.target.value);
    setVolume(val);
    activePlayerRef.current?.setVolume(val);
    if (val === 0) {
      activePlayerRef.current?.mute();
      setMuted(true);
    } else {
      activePlayerRef.current?.unMute();
      setMuted(false);
    }
  }, []);

  return (
    <>
      {activeShort && (
        <ShareDialog
          open={shareOpen}
          onClose={setShareOpen}
          id={activeShort.id}
          title={activeShort.title}
          type="short"
        />
      )}

      <div className="flex h-dvh bg-black text-white overflow-hidden pt-12">
        <div className="flex flex-1 justify-center items-center">
          <div className="relative h-full py-2">
            <div className="relative rounded-2xl overflow-hidden bg-black h-full aspect-9/16">
              <PersistentSlotContainer
                slotData={slotData}
                visualOffset={visualOffset}
                isNoAnim={isNoAnim}
                activePlayerRef={activePlayerRef}
                paused={paused}
                onTogglePause={togglePause}
                muted={muted}
                volume={volume}
                onMuteToggle={handleMuteToggle}
                onVolumeChange={handleVolumeChange}
              />
            </div>
            <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 transition"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 transition"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopShorts;
