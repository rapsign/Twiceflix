"use client";

import VideoGrid from "../components/Videos/VideoGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import useDataManager from "../hooks/useDataManager";

export default function Videos() {
  const { data: videos, loading } = useDataManager("videos");

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-0 md:pt-18 bg-black">
      <VideoGrid videos={videos} />
    </div>
  );
}
