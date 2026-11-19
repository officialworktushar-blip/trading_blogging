import { createClient } from "@/lib/supabase";

const DEFAULT_CATEGORIES = [
  "General",
  "Stock Market",
  "Forex",
  "Crypto",
  "Trading Strategies",
  "Technical Analysis",
];

export async function getBlogOptions(
  excludeId?: string,
): Promise<{ categories: string[]; slugs: string[] }> {
  const supabase = await createClient();

  const categoriesResult = await supabase.from("posts").select("category");
  if (categoriesResult.error) {
    console.error("Failed to load categories:", categoriesResult.error.message);
  }

  let slugQuery = supabase.from("posts").select("slug");
  if (excludeId) slugQuery = slugQuery.neq("id", excludeId);
  const slugsResult = await slugQuery;
  if (slugsResult.error) {
    console.error("Failed to load slugs:", slugsResult.error.message);
  }

  const categories = new Set(DEFAULT_CATEGORIES);
  for (const row of categoriesResult.data ?? []) {
    const value = String(row.category ?? "").trim();
    if (value) categories.add(value);
  }

  const slugs = (slugsResult.data ?? []).map((row) => String(row.slug ?? ""));

  return {
    categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
    slugs,
  };
}
