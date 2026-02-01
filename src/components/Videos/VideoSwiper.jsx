"use client";

import useDataManager from "../../hooks/useDataManager";
import CustomSwiper from "../CustomSwiper";

const VideoSwiper = () => {
  const { data: videos } = useDataManager("videos");

  return (
    <div className="bg-transparent text-white py-2 w-full z-50">
      <CustomSwiper items={videos} title="TWICE Videos" />
    </div>
  );
};

export default VideoSwiper;
