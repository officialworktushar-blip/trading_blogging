import { CountUp } from "@/components/animations/count-up";

const stats = [
  { value: 150, suffix: "+", label: "guides" },
  { value: 5, suffix: "", label: "markets" },
  { value: 12, suffix: "k+", label: "readers" },
];

export function StatsStrip() {
  return (
    <section
      aria-label="Site statistics"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-8 sm:py-10">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-semibold tabular-nums text-ink-900 sm:text-3xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
