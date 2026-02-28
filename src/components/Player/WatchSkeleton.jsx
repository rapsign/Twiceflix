export default function WatchSkeleton() {
  return (
    <>
      <div className="mb-2 bg-black px-0 pt-14">
        <div className="grid grid-cols-1 gap-4 px-0 lg:grid-cols-12 lg:px-2">
          <div className="lg:col-span-9 self-start space-y-6">
            <div className="aspect-video w-full bg-neutral-800 md:rounded-xl animate-pulse" />
            <div className="px-4 lg:px-2 space-y-2">
              <div className="h-5 bg-neutral-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-neutral-800 rounded animate-pulse w-1/4" />
            </div>
            <div className="px-2 md:px-4 lg:px-0">
              <div className="rounded-xl bg-neutral-900 p-4 space-y-2">
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/5" />
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-4/6" />
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/5" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-3 lg:px-0">
            <div className="grid grid-cols-1 gap-3 px-0 md:grid-cols-3 md:px-4 lg:grid-cols-1 lg:px-0 pb-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 lg:flex-row">
                  <div className="relative w-full lg:w-42 shrink-0">
                    <div className="aspect-video bg-neutral-800 overflow-hidden rounded-none md:rounded-lg animate-pulse" />
                  </div>

                  <div className="flex flex-col gap-1 px-2 md:px-0 flex-1 min-w-0">
                    <div className="h-4 bg-neutral-800 rounded animate-pulse w-full" />
                    <div className="h-4 bg-neutral-800 rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/3 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
