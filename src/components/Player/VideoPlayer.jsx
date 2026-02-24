export default function VideoPlayer({ iframeRef, isMobile }) {
  if (isMobile) {
    return (
      <div className="sticky top-12 z-50 bg-black aspect-video">
        <div ref={iframeRef} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <div ref={iframeRef} className="rounded-xl h-full w-full" />
    </div>
  );
}
