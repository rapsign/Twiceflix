import { useEffect, useRef } from "react";

export default function useYouTubeEndListener(youtubeId, onEnd) {
  const iframeContainerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!youtubeId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current || !iframeContainerRef.current) return;
      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        height: "100%",
        width: "100%",
        videoId: youtubeId,
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) onEnd?.();
          },
        },
        playerVars: { rel: 0, modestbranding: 1, autoplay: 1 },
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [youtubeId, onEnd]);

  return iframeContainerRef;
}
