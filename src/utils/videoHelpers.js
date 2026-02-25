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
