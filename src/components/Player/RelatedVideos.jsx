import { useNavigate } from "react-router-dom";
import { formatPublishedDistance } from "@/utils/time";

export default function RelatedVideos({ relatedVideos }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-3 px-0 md:grid-cols-3 md:px-4 lg:grid-cols-1 lg:px-0 pb-1">
      {relatedVideos.map((v) => (
        <div
          key={v.id}
          className="flex cursor-pointer flex-col gap-2 lg:flex-row"
          onClick={() => navigate(`/watch/${v.id}`)}
        >
          <img
            src={v.thumbnail}
            className="w-full aspect-video rounded-none object-cover md:rounded-lg lg:w-42"
          />
          <div className="flex flex-col gap-1 px-2 md:px-0">
            <p className="line-clamp-2 text-sm font-medium">{v.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatPublishedDistance(v.published_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
