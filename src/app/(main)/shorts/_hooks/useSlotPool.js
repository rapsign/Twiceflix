import { useState, useEffect } from "react";
import { useVirtualSlots } from "./useVirtualSlots";

export function useSlotPool(getShort, total, onNavigate, isMobile) {
  const slots = useVirtualSlots(total, onNavigate);
  const { currentIndex } = slots;

  const [slotData, setSlotData] = useState(() =>
    isMobile
      ? [{ short: getShort(0), role: "active" }]
      : [
          { short: null, role: "prev" },
          { short: getShort(0), role: "active" },
          { short: getShort(1), role: "next" },
        ],
  );

  useEffect(() => {
    if (isMobile) {
      setSlotData([{ short: getShort(currentIndex), role: "active" }]);
    } else {
      setSlotData([
        {
          short: getShort(currentIndex - 1),
          role: currentIndex > 0 ? "prev" : "hidden",
        },
        { short: getShort(currentIndex), role: "active" },
        {
          short: getShort(currentIndex + 1),
          role: currentIndex < total - 1 ? "next" : "hidden",
        },
      ]);
    }
  }, [currentIndex, getShort, total, isMobile]);

  return { slotData, ...slots };
}
