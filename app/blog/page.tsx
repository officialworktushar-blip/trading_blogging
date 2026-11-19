import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { getCategories } from "@/lib/posts";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Trading strategies, risk management, and market insights.",
};

const PAGE_SIZE = 6;

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
};

type PostPage = {
  posts: PostSummary[];
  total: number;
};

async function getPosts(
  category: string | undefined,
  query: string | undefined,
  page: number,
): Promise<PostPage> {
  const supabase = await createClient();
  let builder = supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS, { count: "exact" })
    .eq("published", true);

  if (category) builder = builder.eq("category", category);

  const cleanQuery = query?.replace(/[%,"\\]/g, " ").trim();
  if (cleanQuery) {
    builder = builder.or(
      `title.ilike.%${cleanQuery}%,excerpt.ilike.%${cleanQuery}%`,
    );
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await builder
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("Failed to load posts:", error.message);
    return { posts: [], total: 0 };
  }
  return {
    posts: (data ?? []) as PostSummary[],
    total: count ?? 0,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, q, page: rawPage } = await searchParams;
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const cleanQuery = q?.trim() ?? "";

  const [{ posts, total }, categories] = await Promise.all([
    getPosts(category, cleanQuery, page),
    getCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Knowledge base
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Trading guides and market notes
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          Strategies, risk management, and market insights — written for
          traders who prefer a process to a prediction.
        </p>
      </header>

      {categories.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter by category">
          <Link
            href={cleanQuery ? `/blog?q=${encodeURIComponent(cleanQuery)}` : "/blog"}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "bg-navy-900 text-white"
                : "bg-slate-100 text-ink-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const params = new URLSearchParams();
            params.set("category", cat);
            if (cleanQuery) params.set("q", cleanQuery);
            return (
              <Link
                key={cat}
                href={`/blog?${params.toString()}`}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-ink-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 text-sm text-ink-500">
        <p>
          {total} article{total === 1 ? "" : "s"}
          {category ? ` in “${category}”` : ""}
          {cleanQuery ? ` for “${cleanQuery}”` : ""}
        </p>
        {totalPages > 1 ? <p>Page {currentPage} of {totalPages}</p> : null}
      </div>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          No posts found. Try another category or search term.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} className="h-full" delay={Math.min(index * 0.06, 0.3)}>
              <ArticleCard post={post} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/blog"
        params={{ category, q: cleanQuery || undefined }}
      />
    </div>
  );
}
