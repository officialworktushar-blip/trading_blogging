import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { marketTopics, type MarketTopic } from "@/lib/site-config";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategorySection, type CategoryTile } from "@/components/category-section";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { AnimatedCandles } from "@/components/animations/animated-candles";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

type MarketPageProps = {
  params: Promise<{ slug: string }>;
};

function findTopic(slug: string): MarketTopic | undefined {
  return marketTopics.find((topic) => topic.slug === slug);
}

async function getGuides(category: string): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to load guides:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return { title: "Page not found" };
  return { title: topic.label, description: topic.short };
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const guides = await getGuides(topic.label);
  const iconBySlug: Record<string, NonNullable<CategoryTile["icon"]>> = {
    "stock-market": "stock",
    forex: "forex",
    crypto: "crypto",
    "trading-strategies": "strategies",
    "technical-analysis": "analysis",
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <AnimatedCandles />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <Breadcrumbs
            tone="inverse"
            items={[
              { label: "Home", href: "/" },
              { label: topic.label },
            ]}
          />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            Market guide
          </p>
          <h1 className="text-balance mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {topic.label}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {topic.description}
          </p>
          <Link
            href="/blog"
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-400 px-5 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-300"
          >
            Browse the blog
            <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
            What you will learn
          </h2>
          <ul className="mt-6 space-y-4">
            {topic.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-xs leading-relaxed text-ink-500">
            Trading involves risk. Content is for education only, not financial
            advice.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ImagePlaceholder label={topic.mockup} className="aspect-[4/3]" />
        </Reveal>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                From the blog
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-ink-900">
                Guides in {topic.label}
              </h2>
            </div>
            <Link
              href={`/blog?category=${encodeURIComponent(topic.label)}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
            >
              See all
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {guides.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-ink-500">
              No guides published in this category yet.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((post, index) => (
                <Reveal key={post.id} className="h-full" delay={index * 0.07}>
                  <ArticleCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CategorySection
        title="Continue exploring"
        description="Every market has its own rhythm. Compare the basics before you commit to a playbook."
        items={marketTopics
          .filter((item) => item.slug !== topic.slug)
          .map((item) => ({
            label: item.label,
            href: `/market/${item.slug}`,
            description: item.short,
            icon: iconBySlug[item.slug],
          }))}
      />
    </div>
  );
}
