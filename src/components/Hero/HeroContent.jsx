import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroContent = ({ title, description, youtubeUrl, onMoreInfo }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/video-player", {
      state: { youtubeUrl },
    });
  };

  return (
    <div
      className="
        absolute
        bottom-[clamp(30%,50vw,10%)]
        left-0
        max-w-[clamp(100%,40vw,50%)]
        z-20
        px-4
        rounded-md
      "
    >
      {/* Title */}
      <h1
        className="
          text-[clamp(1rem,2vw,1.75rem)]
          font-extrabold
          leading-[1.2]
          text-shadow-md
          text-white
        "
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        className="
          text-[clamp(0.8rem,1.3vw,1rem)]
          mt-3
          leading-6
          text-justify
          text-white
        "
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
      >
        {description}
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handlePlayClick}
          className="
            flex items-center gap-2
            bg-white text-black
            px-[clamp(1rem,2vw,1.5rem)]
            py-[clamp(0.6rem,1vw,0.8rem)]
            text-[clamp(0.75rem,1vw,0.9rem)]
            font-medium
            rounded-xl
            hover:bg-gray-200
            transition
          "
        >
          <Play size={16} />
          Play
        </button>

        <button
          onClick={onMoreInfo}
          className="
            flex items-center gap-2
            border border-white/70 text-white
            px-[clamp(1rem,2vw,1.5rem)]
            py-[clamp(0.6rem,1vw,0.8rem)]
            text-[clamp(0.75rem,1vw,0.9rem)]
            font-medium
                 rounded-xl
            hover:bg-white/20
            transition
          "
        >
          <Info size={16} />
          More Info
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
