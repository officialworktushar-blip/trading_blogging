import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { canonicalMetadata } from "@/lib/seo";
import { sanitizeIlikeQuery } from "@/lib/search";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

type SearchResult = {
  posts: PostSummary[];
  total: number;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `Search: ${query}` : "Search",
    description: "Search trading guides, strategies and market insights.",
    ...canonicalMetadata("/search"),
  };
}

async function searchPosts(query: string, page: number): Promise<SearchResult> {
  const cleanQuery = sanitizeIlikeQuery(query);
  if (!cleanQuery) return { posts: [], total: 0 };

  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS, { count: "exact" })
    .eq("published", true)
    .or(`title.ilike.%${cleanQuery}%,excerpt.ilike.%${cleanQuery}%`)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("Failed to search posts:", error.message);
    return { posts: [], total: 0 };
  }

  return {
    posts: (data ?? []) as PostSummary[],
    total: count ?? 0,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: rawPage } = await searchParams;
  const query = q?.trim() ?? "";
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { posts, total } = await searchPosts(query, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Search
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Find guides and insights
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          Search by title or description across published articles.
        </p>
      </header>

      <form action="/search" method="get" className="mt-8 flex max-w-xl gap-2">
        <label htmlFor="search-q" className="sr-only">
          Search articles
        </label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search guides, strategies and markets…"
          className="h-11 flex-1 rounded-lg border border-slate-300 px-3 text-sm text-ink-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Search
        </button>
      </form>

      <div className="mt-10 border-b border-slate-200 pb-4 text-sm text-ink-500">
        {query ? (
          <p>
            {total} result{total === 1 ? "" : "s"} for “{query}”
            {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}
          </p>
        ) : (
          <p>Enter a term to search published articles.</p>
        )}
      </div>

      {!query ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          Try searching for “risk management”, “candlesticks” or a market name.
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          No results found. Try a different keyword or browse the blog.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} className="h-full" delay={Math.min(index * 0.05, 0.25)}>
              <ArticleCard post={post} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/search"
        params={{ q: query || undefined }}
      />
    </div>
  );
}
