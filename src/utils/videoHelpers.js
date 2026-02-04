/* ===============================
   Utils: videoHelpers.js
================================ */

/**
 * Parse ISO 8601 duration (PT#H#M#S) → HH:MM:SS atau MM:SS
 * @param {string} iso
 * @returns {string} formatted duration
 */
export function parseDuration(iso) {
  if (!iso) return "00:00";

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const hh = hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hh + mm + ":" + ss;
}

/**
 * Format view count → 14K, 1.2M, etc.
 * @param {number|string} count
 * @returns {string} formatted views
 */
export function formatViews(count) {
  if (!count) return "0 views";

  const num = parseInt(count, 10);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M views";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K views";
  return num + " views";
}
