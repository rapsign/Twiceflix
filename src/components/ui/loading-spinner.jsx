import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-red-600" />
    </div>
  );
};

export default LoadingSpinner;
