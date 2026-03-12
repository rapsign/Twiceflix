export default function WatchSkeleton() {
  return (
    <div className="bg-black px-0 pt-14">
      <div className="grid grid-cols-1 gap-4 px-0 xl:grid-cols-[minmax(0,1fr)_440px] xl:px-4">
        {/* Kiri - Video + Info */}
        <div className="space-y-4">
          <div className="aspect-video w-full bg-neutral-800 animate-pulse lg:rounded-xl" />
          <div className="px-4 xl:px-0 space-y-2">
            <div className="h-5 bg-neutral-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4" />
            <div className="rounded-xl bg-neutral-900 p-4 space-y-2 mt-2">
              <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/5" />
              <div className="h-3 bg-neutral-800 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-neutral-800 rounded animate-pulse w-4/6" />
            </div>
          </div>
        </div>

        {/* Kanan - Related Videos */}
        <div className="space-y-3 px-4 xl:px-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-40 shrink-0">
                <div className="aspect-video bg-neutral-800 rounded-lg animate-pulse" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="h-4 bg-neutral-800 rounded animate-pulse w-full" />
                <div className="h-4 bg-neutral-800 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/3 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
