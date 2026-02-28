"use client";

import { Play, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const HeroContent = ({ video }) => {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push(`/watch?tv=${video.id}`);
  };

  return (
    <div className="absolute top-1/2 left-0 -translate-y-1/2 max-w-[clamp(90%,50vw,45%)] z-20 px-4">
      <h1
        className="text-[clamp(1.75rem,3.5vw,3.5rem)] w-full xl:w-1/2 font-extrabold leading-tight text-white"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
      >
        {video.title}
      </h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={handlePlayClick}
          variant="secondary"
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.6rem,1vw,0.8rem)] text-[clamp(0.75rem,1vw,0.9rem)] rounded-xl font-medium cursor-pointer"
        >
          <Play size={16} />
          Play
        </Button>
        <Button
          onClick={handlePlayClick}
          variant="outline"
          className="flex items-center gap-2 border border-white/70 bg-transparent text-white hover:bg-white/20 hover:text-white px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.6rem,1vw,0.8rem)] text-[clamp(0.75rem,1vw,0.9rem)] rounded-xl font-medium cursor-pointer"
        >
          <Info size={16} />
          More Info
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
