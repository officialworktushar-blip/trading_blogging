import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { getCategories } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Trading strategies, risk management, and market insights.",
};

type BlogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

async function getPosts(category?: string): Promise<PostSummary[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPosts(category),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">Blog</h1>
      <p className="mt-2 text-ink-500">
        Strategies, risk management, and market insights.
      </p>

      {categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !category
                ? "bg-ink-900 text-white"
                : "bg-slate-100 text-ink-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-ink-900 text-white"
                  : "bg-slate-100 text-ink-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-12 text-center text-ink-500">
          No posts found{category ? ` in “${category}”` : ""} yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
