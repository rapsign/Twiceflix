import { extractEpisodeNumber } from "./episode";
import { similarity } from "./string";

export function extractSeriesName(title = "") {
  if (!title) return "";
  const match = title.match(/(.*?)(?:\s*(?:EP\.?|Episode|Part|#)\s*\d+)/i);
  return match ? match[1].trim() : title.trim();
}

export const getRelatedVideos = ({
  currentVideo,
  videos,
  similarityThreshold = 0.3,
  playedIds = new Set(),
}) => {
  if (!currentVideo || !videos?.length) return [];

  const currentEp = extractEpisodeNumber(currentVideo.title);
  const currentSeries = extractSeriesName(currentVideo.title);

  const sameSeriesVideos = [];
  const otherVideos = [];

  videos.forEach((v) => {
    if (v.id === currentVideo.id || playedIds.has(v.id)) return;
    const ep = extractEpisodeNumber(v.title);
    const series = extractSeriesName(v.title);
    const epNum = ep !== null ? Number(ep) : null;
    const videoData = { ...v, ep: epNum, series };

    if (series === currentSeries && epNum !== null) {
      sameSeriesVideos.push(videoData);
    } else {
      otherVideos.push(videoData);
    }
  });

  // sort ascending berdasarkan ep (number)
  sameSeriesVideos.sort((a, b) => a.ep - b.ep);

  // semua episode berikutnya dari currentEp
  const nextEpisodes =
    currentEp !== null
      ? sameSeriesVideos.filter(
          (v) => v.ep > Number(currentEp) && !playedIds.has(v.id),
        )
      : [];

  const remainingSeriesEpisodes = sameSeriesVideos.filter(
    (v) => !nextEpisodes.includes(v) && !playedIds.has(v.id),
  );

  // similarity dari video lain
  const scored = otherVideos.map((v) => ({
    ...v,
    score: similarity(currentVideo.title, v.title),
  }));

  const related = scored
    .filter((v) => v.score >= similarityThreshold)
    .sort((a, b) => b.score - a.score);

  const relatedIds = new Set(related.map((v) => v.id));

  const random = scored
    .filter((v) => !relatedIds.has(v.id))
    .sort(() => Math.random() - 0.5);

  return [...nextEpisodes, ...remainingSeriesEpisodes, ...related, ...random];
};
