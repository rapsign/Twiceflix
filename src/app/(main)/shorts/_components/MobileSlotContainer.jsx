"use client";

import ShortPlayer from "./ShortPlayer";
import { ANIM_DURATION } from "./constants";

const MobileSlotContainer = ({
  slotData,
  visualOffset,
  isNoAnim,
  activePlayerRef,
  muted,
  volume,
  onMuteToggle,
  onVolumeChange,
}) => {
  const slot = slotData[0];
  if (!slot) return null;

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translateY(${visualOffset})`,
        transition: isNoAnim
          ? "none"
          : `transform ${ANIM_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        willChange: "transform",
      }}
    >
      <ShortPlayer
        short={slot.short}
        isActive={true}
        isMobile={true}
        onPlayerReady={(p) => { activePlayerRef.current = p; }}
        muted={muted}
        volume={volume}
        onMuteToggle={onMuteToggle}
        onVolumeChange={onVolumeChange}
      />
    </div>
  );
};

export default MobileSlotContainer;
