export function usePlaylistHelpers() {
  const getNextLabel = (videos, currentVideoId, isLooping, playlistTitle) => {
    const idx = videos.findIndex(
      (v) => String(v.id) === String(currentVideoId),
    );
    const isLastVideo = idx !== -1 && idx + 1 >= videos.length;
    return isLastVideo && !isLooping ? playlistTitle : "Next";
  };

  const getNextVideoTitle = (
    videos,
    currentVideoId,
    isLooping,
    playlistTitle,
  ) => {
    const idx = videos.findIndex(
      (v) => String(v.id) === String(currentVideoId),
    );
    if (idx === -1) return "–";
    if (idx + 1 >= videos.length) {
      if (isLooping && videos.length > 0) return videos[0].title;
      return `End of ${playlistTitle}`;
    }
    return videos[idx + 1].title;
  };

  const getVideoIndex = (currentVideoId, videos) => {
    if (!Array.isArray(videos)) return -1;
    return videos.findIndex((v) => String(v.id) === String(currentVideoId));
  };

  return { getNextLabel, getNextVideoTitle, getVideoIndex };
}
