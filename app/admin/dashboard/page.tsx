import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, FolderTree, Send } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatDate } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DashboardRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: string;
  created_at: string;
};

type DashboardData = {
  total: number;
  published: number;
  drafts: number;
  categories: { name: string; count: number }[];
  recent: DashboardRow[];
};

async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, published, category, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load dashboard:", error.message);
    return { total: 0, published: 0, drafts: 0, categories: [], recent: [] };
  }

  const rows = (data ?? []) as DashboardRow[];
  const counts = new Map<string, number>();
  for (const row of rows) {
    const name = row.category?.trim() || "General";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return {
    total: rows.length,
    published: rows.filter((row) => row.published).length,
    drafts: rows.filter((row) => !row.published).length,
    categories: Array.from(counts, ([name, count]) => ({ name, count })).sort(
      (a, b) => a.name.localeCompare(b.name),
    ),
    recent: rows.slice(0, 5),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardData();

  const cards = [
    { label: "Total blogs", value: stats.total, icon: FileText, href: "/admin/blogs" },
    { label: "Published", value: stats.published, icon: Send, href: "/admin/blogs?status=published" },
    { label: "Drafts", value: stats.drafts, icon: FileText, href: "/admin/blogs?status=draft" },
    { label: "Categories", value: stats.categories.length, icon: FolderTree, href: "/admin/categories" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink-900">Welcome back</h2>
        <p className="mt-1 text-sm text-ink-500">
          A quick view of the library and what still needs attention.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="card-lift group rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <ArrowUpRight className="hover-arrow h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <p className="mt-5 text-2xl font-semibold tabular-nums text-ink-900">{card.value}</p>
              <p className="mt-1 text-sm text-ink-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-ink-900">Recent blogs</h2>
          </div>
          {stats.recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-500">No blogs yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recent.map((post) => (
                <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/blogs/${post.id}/edit`}
                      className="truncate text-sm font-medium text-ink-900 hover:text-teal-700"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {post.category} · {formatDate(post.created_at)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-ink-500"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-ink-900">Blogs per category</h2>
          </div>
          {stats.categories.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-500">No categories yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.categories.map((category) => (
                <li key={category.name} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <Link
                    href={`/admin/blogs?category=${encodeURIComponent(category.name)}`}
                    className="font-medium text-ink-900 hover:text-teal-700"
                  >
                    {category.name}
                  </Link>
                  <span className="tabular-nums text-ink-500">{category.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
