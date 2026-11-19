import { createClient } from "@/lib/supabase";
import { POST_SUMMARY_COLUMNS, type PostSummary } from "@/lib/types";

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("category")
    .eq("published", true);

  if (error) {
    console.error("Failed to load categories:", error.message);
    return [];
  }

  const set = new Set<string>();
  for (const row of data ?? []) {
    const category = String(row.category ?? "").trim();
    if (category) set.add(category);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load latest posts:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function getPostsByCategory(
  category: string,
  limit: number,
): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Failed to load posts in ${category}:`, error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}
