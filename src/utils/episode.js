export const extractEpisodeNumber = (title = "") => {
  const patterns = [
    /ep\.?\s*0*(\d+)/i, // Ep 01, EP.01, ep1, ep.1
    /episode\s*0*(\d+)/i, // Episode 3, episode03
    /part\s*0*(\d+)/i, // Part 2, part02
    /#0*(\d+)/, // #5, #05
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return parseInt(match[1], 10);
  }

  return null;
};
