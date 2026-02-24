import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-end min-h-screen text-center overflow-hidden">
      <video
        src="/mina-sad.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 py-10 rounded-xl">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-lg">
          404
        </h1>
        <p className="text-xl md:text-3xl lg:text-5xl font-bold text-white drop-shadow-lg">
          Page Not Found
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="cursor-pointer rounded-full mt-2 text-sm md:text-base"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
