export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="h-4 w-32 rounded bg-slate-200 motion-safe:animate-pulse" />
      <div className="mt-6 h-10 w-80 max-w-full rounded bg-slate-200 motion-safe:animate-pulse" />
      <div className="mt-4 h-4 w-full max-w-2xl rounded bg-slate-100 motion-safe:animate-pulse" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-24 rounded-full bg-slate-200 motion-safe:animate-pulse"
          />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-slate-200">
            <div className="aspect-[16/9] bg-slate-200 motion-safe:animate-pulse" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-24 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-100 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
