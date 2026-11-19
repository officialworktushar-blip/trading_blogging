import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/animations/reveal";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 6;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function getPostsByCategory(
  category: string,
  page: number,
): Promise<{ posts: PostSummary[]; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS, { count: "exact" })
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("Failed to load posts:", error.message);
    return { posts: [], total: 0 };
  }
  return { posts: (data ?? []) as PostSummary[], total: count ?? 0 };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = safeDecode(category);
  return {
    title: `${label} — Articles`,
    description: `Trading articles in the ${label} category.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const { page: rawPage } = await searchParams;
  const category = safeDecode(rawCategory);
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { posts, total } = await getPostsByCategory(category, requestedPage);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  if (posts.length === 0 && total === 0) notFound();
  if (requestedPage > totalPages) {
    redirect(`/blog/category/${encodeURIComponent(category)}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: category },
        ]}
      />
      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Category
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {category}
        </h1>
        <p className="mt-4 text-ink-500">
          {total} article{total === 1 ? "" : "s"} in this category.
        </p>
        <Link
          href="/blog"
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
        >
          All categories
          <span className="hover-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.id} className="h-full" delay={Math.min(index * 0.07, 0.3)}>
            <ArticleCard post={post} priority={index < 2} />
          </Reveal>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/category/${encodeURIComponent(category)}`}
      />
    </div>
  );
}
