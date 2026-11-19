import { createClient } from "@/lib/supabase";

/** Server-only: returns the sorted list of distinct published categories. */
export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("category")
    .eq("published", true);

  if (error) return [];
  const set = new Set<string>();
  for (const row of data ?? []) {
    const category = (row as { category: string | null }).category;
    if (category) set.add(category);
  }
  return Array.from(set).sort();
}
