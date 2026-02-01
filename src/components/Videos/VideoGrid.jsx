import VideoCard from "./VideoCard";

export default function VideoGrid({ videos, onVideoClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onClick={onVideoClick} />
      ))}
    </div>
  );
}
