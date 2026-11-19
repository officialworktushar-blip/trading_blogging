export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-8 w-48 rounded bg-slate-200 motion-safe:animate-pulse" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200"
          >
            <div className="aspect-[16/9] rounded-t-xl bg-slate-200 motion-safe:animate-pulse" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-20 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-200 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
