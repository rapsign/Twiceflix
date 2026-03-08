import { useMemo } from "react";
import useDataManager from "@/hooks/useDataManager";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

const HeroSection = () => {
  const { data: videos = [], loading } = useDataManager("youtube_video");

  const latestVideo = useMemo(() => {
    if (videos.length === 0) return null;
    return (
      videos
        .filter((v) => !v.is_short)
        .sort(
          (a, b) =>
            new Date(b.published_at ?? 0).getTime() -
            new Date(a.published_at ?? 0).getTime(),
        )[0] ?? null
    );
  }, [videos]);

  if (loading) {
    return (
      <section className="relative w-full bg-black text-white overflow-hidden aspect-video min-h-125 md:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black animate-pulse" />
      </section>
    );
  }

  if (!latestVideo) {
    return (
      <section className="relative w-full bg-black text-white overflow-hidden aspect-video min-h-125 md:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      </section>
    );
  }

  return (
    <section className="relative w-full bg-black text-white overflow-hidden aspect-video min-h-125 md:min-h-screen">
      <HeroBackground thumbnail={latestVideo.thumbnail} />
      <HeroContent video={latestVideo} />
    </section>
  );
};

export default HeroSection;
