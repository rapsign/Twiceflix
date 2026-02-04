import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroContent = ({ video }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/watch/${video.id}`);
  };

  return (
    <div
      className="
    absolute
    top-1/2
    left-0
    -translate-y-1/2
    max-w-[clamp(90%,50vw,45%)]
    z-20
    px-4
  "
    >
      {/* Title */}
      <h1
        className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.5rem] w-full xl:w-1/2 font-extrabold leading-tight text-shadow-md text-white"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
      >
        {video.title}
      </h1>

      {/* Description */}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handlePlayClick}
          className="flex items-center gap-2 bg-white text-black px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.6rem,1vw,0.8rem)] text-[clamp(0.75rem,1vw,0.9rem)] font-medium rounded-xl hover:bg-gray-200 transition cursor-pointer"
        >
          <Play size={16} />
          Play
        </button>

        <button
          onClick={handlePlayClick}
          className="flex items-center gap-2 border border-white/70 text-white px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.6rem,1vw,0.8rem)] text-[clamp(0.75rem,1vw,0.9rem)] font-medium rounded-xl hover:bg-white/20 transition cursor-pointer"
        >
          <Info size={16} />
          More Info
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
