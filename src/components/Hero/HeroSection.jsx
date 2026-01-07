import { useState, useMemo } from "react";
import useDataManager from "@/hooks/useDataManager";
import LoadingSpinner from "@/components/LoadingSpinner";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import VideoModal from "@/components/Videos/VideoModal";

const HeroSection = () => {
  const { data: videos = [], loading } = useDataManager("videos");
  const [open, setOpen] = useState(false);

  // Ambil video terbaru berdasarkan published_at
  const latestVideo = useMemo(() => {
    if (!videos.length) return null;
    return [...videos].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    )[0];
  }, [videos]);

  if (loading || !latestVideo) {
    return <LoadingSpinner />;
  }

  return (
    <section
      className="
        relative
        w-full
        bg-black
        text-white
        overflow-hidden
        aspect-video
        
        min-h-[500px]
        md:min-h-screen
      "
    >
      {/* Background */}
      <HeroBackground thumbnail={latestVideo.thumbnail} />

      {/* Content */}
      <HeroContent
        title={latestVideo.title}
        description={latestVideo.description}
        youtubeUrl={latestVideo.youtube_url}
        onMoreInfo={() => setOpen(true)}
      />

      {/* Modal */}
      <VideoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        video={latestVideo}
      />
    </section>
  );
};

export default HeroSection;
