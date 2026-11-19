export default function CategoryLoading() {
  return (
    <div>
      <div className="bg-navy-950 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="h-4 w-32 rounded bg-white/15 motion-safe:animate-pulse" />
          <div className="mt-10 h-10 w-72 max-w-full rounded bg-white/20 motion-safe:animate-pulse" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded bg-white/10 motion-safe:animate-pulse" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 w-full rounded bg-slate-200 motion-safe:animate-pulse" />
            ))}
          </div>
          <div className="aspect-[4/3] rounded-xl bg-slate-200 motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
