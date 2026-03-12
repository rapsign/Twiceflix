export const MOBILE_BREAKPOINT = 768;
export const ANIM_DURATION = 300;

export const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

export const linkifyOptions = {
  formatHref: { hashtag: (href) => `/search?q=${href.substring(1)}` },
  target: { url: "_blank", hashtag: "_self" },
  attributes: (href, type) => ({
    className:
      type === "hashtag"
        ? "text-[#3EA6FF] font-semibold hover:text-[#5AB3FF]"
        : "text-[#3EA6FF] underline hover:text-[#5AB3FF]",
    ...(type === "hashtag" ? {} : { rel: "noopener noreferrer" }),
    onClick: (e) => e.stopPropagation(),
  }),
};
