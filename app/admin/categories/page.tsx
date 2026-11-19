import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
};

type CategoryRow = {
  category: string | null;
};

type CategoryStat = {
  name: string;
  count: number;
};

async function getCategories(): Promise<CategoryStat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("category");

  if (error) {
    console.error("Failed to load categories:", error.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as CategoryRow[]) {
    const name = row.category?.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">Categories</h2>
          <p className="mt-1 text-sm text-ink-500">
            Categories are set on each post in the editor.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          + Add New Blog
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          No categories found yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="card-lift rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-lg font-semibold text-ink-900">{category.name}</p>
              <p className="mt-1 text-sm text-ink-500">
                {category.count} post{category.count === 1 ? "" : "s"}
              </p>
              <Link
                href={`/blog/category/${encodeURIComponent(category.name)}`}
                target="_blank"
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
              >
                View on site
                <ArrowUpRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
