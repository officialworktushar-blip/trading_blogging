import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Eye,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/animations/reveal";
import { canonicalMetadata } from "@/lib/seo";

// Edit this content to update the About Us page copy.
const aboutContent = {
  hero: {
    eyebrow: "About us",
    title: "Trading education without the hype",
    intro:
      "TradeLens is an educational desk for people who want to understand markets. We explain concepts with charts and plain language, then put risk management where it belongs: at the centre of every example.",
  },
  mission: {
    title: "Our mission",
    body:
      "Help traders build a repeatable process — one that starts with context, defines risk before reward, and treats every outcome as feedback rather than proof.",
  },
  whatWeCover: [
    {
      title: "Stock Market",
      text: "Equities, indices, earnings reactions and sector rotation explained with structure and risk in mind.",
    },
    {
      title: "Forex",
      text: "Major pairs, trading sessions, leverage basics and macro-aware planning.",
    },
    {
      title: "Crypto",
      text: "Volatility, market cycles, liquidity and round-the-clock risk habits for digital assets.",
    },
    {
      title: "Trading Strategies",
      text: "Rules-based playbooks you can test, journal and refine with a meaningful sample size.",
    },
    {
      title: "Technical Analysis",
      text: "Chart reading, price action and indicators used as supporting evidence — not signals on their own.",
    },
  ],
  team: [
    {
      name: "Editorial desk",
      role: "Research & writing",
      note: "Placeholder — add team member name, role and a short bio here.",
    },
    {
      name: "Market analyst",
      role: "Chart review",
      note: "Placeholder — add team member name, role and a short bio here.",
    },
    {
      name: "Risk educator",
      role: "Process & checklists",
      note: "Placeholder — add team member name, role and a short bio here.",
    },
  ],
  trust: [
    {
      icon: BookOpen,
      title: "Plain-language guides",
      text: "No secret systems. Each guide defines the idea, the conditions and the invalidation point.",
    },
    {
      icon: Eye,
      title: "Illustrative, not predictive",
      text: "Charts and figures are built to teach a concept, not to suggest a live trade or a future price.",
    },
    {
      icon: ShieldCheck,
      title: "Risk-first examples",
      text: "Position sizing and stop placement are part of the lesson, not an afterthought.",
    },
    {
      icon: Target,
      title: "Process over outcomes",
      text: "We focus on decisions you can repeat and review, because single results prove very little.",
    },
  ],
};

export const metadata: Metadata = {
  title: "About Us",
  description: aboutContent.hero.intro,
  ...canonicalMetadata("/about-us"),
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <header className="mt-6 max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            {aboutContent.hero.eyebrow}
          </p>
          <h1 className="text-balance mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            {aboutContent.hero.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            {aboutContent.hero.intro}
          </p>
        </Reveal>
      </header>

      <section className="mt-14">
        <Reveal>
          <div className="grid gap-8 rounded-2xl bg-navy-950 px-6 py-10 text-white sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
                Mission
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold">
                {aboutContent.mission.title}
              </h2>
              <p className="mt-4 leading-relaxed text-white/75">
                {aboutContent.mission.body}
              </p>
            </div>
            <ImagePlaceholder
              label="Editorial mockup: a desk notebook with chart printouts and a risk checklist"
              className="aspect-[4/3] border-white/20 bg-white/10"
            />
          </div>
        </Reveal>
      </section>

      <section className="mt-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            What we cover
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900">
            Markets and methods, explained clearly
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutContent.whatWeCover.map((item, index) => (
            <Reveal key={item.title} delay={Math.min(index * 0.06, 0.24)} className="h-full">
              <div className="card-lift h-full rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
              Team
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
            A small, education-focused desk. Replace these placeholders with real
            names, roles and bios as the team grows.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aboutContent.team.map((member, index) => (
            <Reveal key={member.role} delay={Math.min(index * 0.07, 0.21)} className="h-full">
              <div className="card-lift h-full rounded-xl border border-slate-200 bg-white p-6">
                <div
                  role="img"
                  aria-label={`${member.name} photo placeholder`}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500"
                >
                  Photo
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{member.name}</h3>
                <p className="text-sm font-medium text-teal-700">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{member.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Why trust us
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900">
            Clear standards, honest limits
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {aboutContent.trust.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={Math.min(index * 0.06, 0.18)} className="h-full">
                <div className="card-lift h-full rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <Icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <section className="mt-16 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink-900">
              Read with a risk-first mindset
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Trading involves risk. Content is for education only, not financial advice.
            </p>
          </div>
          <Link
            href="/disclaimer"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
          >
            Read full disclaimer
            <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
