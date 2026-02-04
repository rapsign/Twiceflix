import { useMemo } from "react";
import useDataManager from "@/hooks/useDataManager";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

const HeroSection = () => {
  const { data: videos = [] } = useDataManager("youtube_video");

  const latestVideo = useMemo(() => {
    if (videos.length === 0) return null;

    return videos.reduce((latest, current) =>
      new Date(current.published_at) > new Date(latest.published_at)
        ? current
        : latest,
    );
  }, [videos]);

  if (!latestVideo) return null;

  return (
    <section className="relative w-full bg-black text-white overflow-hidden aspect-video min-h-125 md:min-h-screen">
      <HeroBackground thumbnail={latestVideo.thumbnail} />
      <HeroContent video={latestVideo} />
    </section>
  );
};

export default HeroSection;
