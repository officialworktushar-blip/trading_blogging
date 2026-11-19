import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, LineChart, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { marketTopics, siteConfig } from "@/lib/site-config";
import { ArticleCard } from "@/components/article-card";
import { CategorySection, type CategoryTile } from "@/components/category-section";
import { HeroFeatured } from "@/components/hero-featured";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

const iconBySlug: Record<string, NonNullable<CategoryTile["icon"]>> = {
  "stock-market": "stock",
  forex: "forex",
  crypto: "crypto",
  "trading-strategies": "strategies",
  "technical-analysis": "analysis",
};

export default async function HomePage() {
  const posts = await getLatestPosts(7);
  const featured = posts[0] ?? null;
  const latest = posts.slice(1, 7);

  return (
    <div>
      <HeroFeatured featured={featured} />

      <CategorySection
        id="markets"
        title="Markets and methods, explained simply"
        description="Pick a market to learn how it moves, then build a strategy with rules you can actually follow."
        items={marketTopics.map((topic) => ({
          label: topic.label,
          href: `/market/${topic.slug}`,
          description: topic.short,
          icon: iconBySlug[topic.slug],
        }))}
      />

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <ImagePlaceholder
              label="Workshop mockup: trade journal with entry, stop, target and review notes"
              className="aspect-[4/3]"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              A process you can repeat
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              From chart reading to a written trading plan
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              Every guide follows the same structure: what the market is doing,
              what would invalidate the idea, and how to size the position so
              one outcome never defines your month.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3 text-sm text-ink-700">
                <LineChart className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                <span>Chart examples with clear support, resistance and structure.</span>
              </li>
              <li className="flex gap-3 text-sm text-ink-700">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                <span>Risk-first checklists before any entry discussion.</span>
              </li>
              <li className="flex gap-3 text-sm text-ink-700">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                <span>Journal prompts that turn a screen into a lesson.</span>
              </li>
            </ul>
            <Link
              href="/blog"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
            >
              Browse every guide
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

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

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Reveal>
          <div className="flex flex-col gap-5 rounded-2xl bg-teal-50 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">
                Have a topic you want unpacked?
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Send it to the support desk. The clearest questions become the
                next guides.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Contact Support+
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
