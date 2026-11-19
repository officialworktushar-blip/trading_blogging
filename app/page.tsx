import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Mail } from "lucide-react";
import { marketTopics, siteConfig } from "@/lib/site-config";
import { canonicalMetadata } from "@/lib/seo";
import { getLatestPosts, getPostsByCategory } from "@/lib/posts";
import { HeroFeatured } from "@/components/hero-featured";
import { StatsStrip } from "@/components/stats-strip";
import { ArticleCard } from "@/components/article-card";
import { CategoryLatestSection } from "@/components/category-latest-section";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  ...canonicalMetadata("/"),
};

export default async function HomePage() {
  const [posts, ...categoryPosts] = await Promise.all([
    getLatestPosts(7),
    ...marketTopics.map((topic) => getPostsByCategory(topic.label, 4)),
  ]);

  const featured = posts[0] ?? null;
  const latest = posts.slice(1, 7);

  return (
    <div>
      <HeroFeatured featured={featured} />
      <StatsStrip />

      <section id="latest" className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Fresh from the desk
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Latest articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
          >
            View all articles
            <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, index) => (
              <Reveal key={post.id} className="h-full" delay={Math.min(index * 0.07, 0.35)}>
                <ArticleCard post={post} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {marketTopics.map((topic, index) => (
        <CategoryLatestSection
          key={topic.slug}
          id={index === 0 ? "markets" : undefined}
          title={topic.label}
          href={`/${topic.slug}`}
          posts={categoryPosts[index] ?? []}
        />
      ))}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Trading basics
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Build a repeatable process
              </h2>
              <p className="mt-4 leading-relaxed text-ink-500">
                Before indicators and setups, lock in the habits that protect
                capital and make learning measurable.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Plan first",
                  text: "Define the idea, entry, stop and target before you click.",
                },
                {
                  title: "Size small",
                  text: "Risk a fixed, affordable amount so one loss stays small.",
                },
                {
                  title: "Confirm context",
                  text: "Use higher-timeframe structure and volume as evidence.",
                },
                {
                  title: "Journal always",
                  text: "Record the reason and review outcomes without hindsight bias.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card-lift rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <CheckCircle2 className="h-5 w-5 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold text-ink-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.text}</p>
                </div>
              ))}
            </div>
            <Link
              href="/blog"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Browse every guide
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <Reveal>
          <div className="grid gap-8 rounded-2xl bg-navy-950 px-6 py-10 text-white sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
                Newsletter
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                Get new trading guides in your inbox
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Weekly, education-only notes: market structure, risk habits and
                strategy breakdowns. No signals, no spam.
              </p>
            </div>
            <form
              className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-5"
              action="#"
              method="post"
            >
              <label htmlFor="newsletter-email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/45"
                />
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-400 px-5 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-300"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Subscribe
                </button>
              </div>
              <p className="mt-3 text-xs text-white/55">
                UI only for this demo. Trading involves risk. Content is for
                education only, not financial advice.
              </p>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
