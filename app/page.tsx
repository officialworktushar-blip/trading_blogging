import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import {
  POST_SUMMARY_COLUMNS,
  type PostSummary,
} from "@/lib/types";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/animations/fade-in";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.name,
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

export default async function HomePage() {
  const posts = await getLatestPosts(6);

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Trading education
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Learn to trade with clarity and discipline
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-500">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/blog"
                className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
              >
                Read the blog
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-ink-900 transition-colors hover:bg-slate-100"
              >
                Contact us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink-900">Latest articles</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-ink-500">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={Math.min(i * 0.08, 0.4)}>
                <PostCard post={post} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
