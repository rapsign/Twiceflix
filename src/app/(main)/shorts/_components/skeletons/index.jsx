import { cn } from "@/lib/utils";
import { shimmerStyle } from "../constants";

export const SkeletonPulse = ({ className }) => (
  <div
    className={cn("rounded bg-neutral-800", className)}
    style={{
      background:
        "linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

export const SkeletonShortPlayer = () => (
  <div className="relative w-full h-full bg-neutral-900 overflow-hidden flex flex-col justify-end">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, #141414 25%, #1e1e1e 50%, #141414 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />
    <div className="relative z-20 p-4 space-y-2">
      <SkeletonPulse className="h-3 w-24 rounded-full" />
      <SkeletonPulse className="h-4 w-3/4 rounded-full" />
      <SkeletonPulse className="h-4 w-1/2 rounded-full" />
    </div>
  </div>
);

export const MobileSkeletonLoader = () => (
  <div className="relative h-dvh bg-black overflow-hidden">
    <style>{shimmerStyle}</style>
    <div className="absolute top-4 left-4 z-30">
      <SkeletonPulse className="w-9 h-9 rounded-full" />
    </div>
    <div className="absolute top-4 right-4 z-30">
      <SkeletonPulse className="w-9 h-9 rounded-full" />
    </div>
    <SkeletonShortPlayer />
  </div>
);

export const DesktopSkeletonLoader = () => (
  <div className="flex h-dvh bg-black text-white overflow-hidden pt-12">
    <style>{shimmerStyle}</style>
    <div className="flex flex-1 justify-center items-center">
      <div className="relative h-full py-2">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 h-full aspect-9/16">
          <SkeletonShortPlayer />
        </div>
      </div>
    </div>
  </div>
);
