"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import VolumeControl from "./VolumeControl";
import MobileSlotContainer from "./MobileSlotContainer";
import { useSlotPool } from "../_hooks/useSlotPool";

const MobileShorts = ({ getShort, total }) => {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const activePlayerRef = useRef(null);
  const handleNavigate = useCallback(() => setPaused(false), []);

  const { slotData, goNext, goPrev, visualOffset, isNoAnim, isFirst, isLast } =
    useSlotPool(getShort, total, handleNavigate, true);

  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (isDragging.current)
      touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const delta = touchDeltaY.current;
    const threshold = window.innerHeight * 0.2;
    if (delta < -threshold && !isLast) goNext();
    else if (delta > threshold && !isFirst) goPrev();
    touchDeltaY.current = 0;
  };

  const togglePause = (e) => {
    e.stopPropagation();
    if (!activePlayerRef.current) return;
    if (paused) {
      activePlayerRef.current.playVideo();
      setPaused(false);
    } else {
      activePlayerRef.current.pauseVideo();
      setPaused(true);
    }
  };

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
    <div
      className="relative h-dvh bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <VolumeControl
            muted={muted}
            volume={volume}
            onMuteToggle={handleMuteToggle}
            onVolumeChange={handleVolumeChange}
          />
        </div>
        <button
          onClick={togglePause}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition pointer-events-auto"
        >
          {paused ? (
            <Play className="w-5 h-5 text-white" />
          ) : (
            <Pause className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <MobileSlotContainer
        slotData={slotData}
        visualOffset={visualOffset}
        isNoAnim={isNoAnim}
        activePlayerRef={activePlayerRef}
        muted={muted}
        volume={volume}
        onMuteToggle={handleMuteToggle}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default MobileShorts;
