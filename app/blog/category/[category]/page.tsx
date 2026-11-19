import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";
import { PostCard } from "@/components/post-card";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

async function getPostsByCategory(
  category: string,
): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${decodeURIComponent(category)} — Articles`,
    description: `Trading articles in the ${decodeURIComponent(category)} category.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const posts = await getPostsByCategory(category);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">{category}</h1>
      <p className="mt-2 text-ink-500">
        {posts.length} article{posts.length === 1 ? "" : "s"} in this category.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
