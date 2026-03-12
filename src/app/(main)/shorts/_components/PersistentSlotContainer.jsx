"use client";

import ShortPlayer from "./ShortPlayer";
import { ANIM_DURATION } from "./constants";

const PersistentSlotContainer = ({
  slotData,
  visualOffset,
  isNoAnim,
  activePlayerRef,
  paused,
  onTogglePause,
  muted,
  volume,
  onMuteToggle,
  onVolumeChange,
}) => {
  const getTranslateY = (role) => {
    switch (role) {
      case "prev":
        return `calc(${visualOffset} - 100%)`;
      case "active":
        return visualOffset;
      case "next":
        return `calc(${visualOffset} + 100%)`;
      default:
        return "-200%";
    }
  };

  return (
    <>
      {slotData.map((slot, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translateY(${getTranslateY(slot.role)})`,
            transition: isNoAnim
              ? "none"
              : `transform ${ANIM_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
            willChange: slot.role === "active" ? "transform" : "auto",
            pointerEvents: slot.role === "active" ? "auto" : "none",
            visibility: slot.role === "hidden" ? "hidden" : "visible",
          }}
        >
          <ShortPlayer
            short={slot.short}
            isActive={slot.role === "active"}
            isMobile={false}
            onPlayerReady={
              slot.role === "active"
                ? (p) => { activePlayerRef.current = p; }
                : undefined
            }
            paused={paused}
            onTogglePause={slot.role === "active" ? onTogglePause : undefined}
            muted={muted}
            volume={volume}
            onMuteToggle={slot.role === "active" ? onMuteToggle : undefined}
            onVolumeChange={slot.role === "active" ? onVolumeChange : undefined}
          />
        </div>
      ))}
    </>
  );
};

export default PersistentSlotContainer;
