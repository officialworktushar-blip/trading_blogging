export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="h-4 w-64 rounded bg-slate-200 motion-safe:animate-pulse" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="max-w-3xl">
          <div className="h-6 w-28 rounded-full bg-slate-200 motion-safe:animate-pulse" />
          <div className="mt-5 h-12 w-full rounded bg-slate-200 motion-safe:animate-pulse" />
          <div className="mt-3 h-8 w-4/5 rounded bg-slate-200 motion-safe:animate-pulse" />
          <div className="mt-5 h-5 w-full rounded bg-slate-100 motion-safe:animate-pulse" />
          <div className="mt-2 h-5 w-5/6 rounded bg-slate-100 motion-safe:animate-pulse" />
          <div className="mt-9 aspect-[16/9] w-full rounded-xl bg-slate-200 motion-safe:animate-pulse" />
          <div className="mt-10 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-full rounded bg-slate-100 motion-safe:animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="h-64 rounded-xl border border-slate-200 bg-slate-100 motion-safe:animate-pulse lg:mt-24" />
      </div>
    </div>
  );
}
