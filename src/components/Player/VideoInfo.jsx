import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPublishedDistance } from "@/utils/time";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";

const COLLAPSED_HEIGHT = 40;

const linkifyOptions = {
  className: "text-[#3EA6FF] hover:text-[#5AB3FF]",
  rel: "noopener noreferrer",
  formatHref: {
    hashtag: (href) => `/search?q=${href.substring(1)}`,
  },
  target: {
    url: "_blank",
    hashtag: "_self",
  },
  attributes: {
    url: { className: "underline" },
    hashtag: { className: "font-semibold" },
  },
};

export default function VideoInfo({ video }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
    setExpanded(false);
  }, [video.description]);

  return (
    <>
      <div className="px-4 pt-3 lg:pt-0 lg:px-2 md:px-4">
        <Linkify options={linkifyOptions}>
          <h1 className="text-base md:text-lg lg:text-xl font-semibold">
            {video.title}
          </h1>
        </Linkify>
      </div>

      <div className="px-2 md:px-4 lg:px-0">
        <Card
          className="p-0 cursor-pointer"
          onClick={() => isOverflowing && setExpanded((p) => !p)}
        >
          <CardContent className="space-y-1 px-4 py-3 md:py-4">
            <p className="text-[11px] md:text-sm font-medium text-muted-foreground">
              {formatPublishedDistance(video.published_at)}
            </p>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: expanded
                  ? contentRef.current?.scrollHeight
                  : COLLAPSED_HEIGHT,
              }}
            >
              <Linkify options={linkifyOptions}>
                <div
                  ref={contentRef}
                  className="text-sm md:text-base leading-relaxed whitespace-pre-line"
                >
                  {video.description}
                </div>
              </Linkify>
            </div>

            {isOverflowing && (
              <button
                className="text-sm font-semibold hover:underline focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((p) => !p);
                }}
              >
                {expanded ? "Show less" : "...more"}
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
