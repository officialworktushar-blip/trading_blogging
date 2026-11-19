import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { AnimatedCandles } from "@/components/animations/animated-candles";
import { CountUp } from "@/components/animations/count-up";
import { FloatingChartCards } from "@/components/animations/floating-chart-cards";
import { Reveal } from "@/components/animations/reveal";

export function HeroFeatured({ featured }: { featured: PostSummary | null }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <AnimatedCandles />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Education first · risk always
          </p>
          <h1 className="text-balance mt-6 font-serif text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Learn to read the market before you trade it.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Clear, practical guides on market structure, trading strategies and
            risk management — written to help you build a process, not chase a
            signal.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-lg bg-teal-400 px-5 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-300"
            >
              Start reading
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#markets"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore markets
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <dd>
                <CountUp value={150} suffix="+" />
              </dd>
              <dt className="mt-1 text-xs text-white/60">guides</dt>
            </div>
            <div>
              <dd>
                <CountUp value={5} />
              </dd>
              <dt className="mt-1 text-xs text-white/60">markets</dt>
            </div>
            <div>
              <dd>
                <CountUp value={12} suffix="k+" />
              </dd>
              <dt className="mt-1 text-xs text-white/60">readers</dt>
            </div>
          </dl>
        </Reveal>

        <div className="relative">
          <FloatingChartCards />
          {featured ? (
            <Reveal delay={0.2} className="relative z-10 mx-auto max-w-sm">
              <Link
                href={`/blog/${featured.slug}`}
                className="card-lift group block rounded-xl border border-white/15 bg-navy-900/90 p-5 shadow-2xl backdrop-blur"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                  Featured guide
                </p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-white">
                  {featured.title}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  Read now
                  <ArrowRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
