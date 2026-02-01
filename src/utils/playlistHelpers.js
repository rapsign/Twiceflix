export function getNextVideoTitle(videos, currentVideoId) {
  const idx = videos.findIndex((v) => String(v.id) === String(currentVideoId));
  if (idx === -1 || idx + 1 >= videos.length) return "–";
  return videos[idx + 1].title;
}

export function getVideoIndex(currentVideoId, videos) {
  if (!Array.isArray(videos)) return -1;
  return videos.findIndex((v) => String(v.id) === String(currentVideoId));
}
