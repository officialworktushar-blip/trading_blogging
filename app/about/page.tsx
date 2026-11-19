import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { CountUp } from "@/components/animations/count-up";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why TradeLens writes risk-first trading education.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          About us
        </p>
        <h1 className="text-balance mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Trading education without the hype
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-500">
          TradeLens is an educational desk for people who want to understand
          markets. We explain concepts with charts and plain language, then put
          risk management where it belongs: at the centre of every example.
        </p>
      </header>

      <section className="mt-14 grid gap-8 sm:grid-cols-3">
        <Reveal className="h-full">
          <div className="card-lift h-full rounded-xl border border-slate-200 p-6">
            <BookOpen className="h-6 w-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Plain-language guides</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              No secret systems. Each guide defines the idea, the conditions
              and the invalidation point.
            </p>
          </div>
        </Reveal>
        <Reveal className="h-full" delay={0.06}>
          <div className="card-lift h-full rounded-xl border border-slate-200 p-6">
            <LineChart className="h-6 w-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Illustrative charts</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Diagrams are built to teach a concept, not to suggest a live
              trade or a future price.
            </p>
          </div>
        </Reveal>
        <Reveal className="h-full" delay={0.12}>
          <div className="card-lift h-full rounded-xl border border-slate-200 p-6">
            <ShieldCheck className="h-6 w-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Risk-first examples</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Position sizing and stop placement are part of the lesson, not
              an afterthought.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mt-16 grid gap-10 rounded-2xl bg-navy-950 px-6 py-12 text-white sm:px-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold">Small numbers, honest scope</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            A focused library is easier to keep accurate than a huge one. Here
            is what this desk currently covers.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dd><CountUp value={150} suffix="+" /></dd>
              <dt className="mt-1 text-xs text-white/60">guides</dt>
            </div>
            <div>
              <dd><CountUp value={5} /></dd>
              <dt className="mt-1 text-xs text-white/60">markets</dt>
            </div>
            <div>
              <dd><CountUp value={100} suffix="%" /></dd>
              <dt className="mt-1 text-xs text-white/60">education</dt>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <ImagePlaceholder
            label="Editorial mockup: a desk notebook with chart printouts and a risk checklist"
            className="aspect-[4/3] border-white/20 bg-white/10"
          />
        </Reveal>
      </section>

      <section id="disclaimer" className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl font-semibold text-ink-900">
          Risk disclaimer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Trading involves risk. Content is for education only, not financial
          advice. Illustrative data, charts and performance figures on this
          site are for demonstration purposes. Decide independently, and if
          needed, speak with a qualified professional.
        </p>
        <Link
          href="/blog"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
        >
          Read the guides
          <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
