"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

const VolumeControl = ({ muted, volume, onMuteToggle, onVolumeChange }) => {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef(null);
  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div
      className="flex items-center h-9 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-200 overflow-hidden"
      style={{ width: hovered ? "108px" : "36px" }}
      onMouseEnter={() => {
        clearTimeout(timeoutRef.current);
        setHovered(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setHovered(false), 300);
      }}
    >
      <button
        onClick={onMuteToggle}
        className="w-9 h-9 shrink-0 flex items-center justify-center"
      >
        <VolumeIcon className="w-5 h-5 text-white" />
      </button>
      <div
        className="flex items-center pr-3 transition-all duration-200"
        style={{ width: hovered ? "72px" : "0px", opacity: hovered ? 1 : 0 }}
      >
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={onVolumeChange}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-1 cursor-pointer"
          style={{ accentColor: "white" }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
