import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, FolderTree, Send } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatDate } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: string;
  created_at: string;
};

type Stats = {
  total: number;
  published: number;
  drafts: number;
  categories: number;
  recent: AdminPostRow[];
};

async function getStats(): Promise<Stats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, published, category, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load dashboard stats:", error.message);
    return { total: 0, published: 0, drafts: 0, categories: 0, recent: [] };
  }

  const rows = (data ?? []) as AdminPostRow[];
  return {
    total: rows.length,
    published: rows.filter((row) => row.published).length,
    drafts: rows.filter((row) => !row.published).length,
    categories: new Set(rows.map((row) => row.category)).size,
    recent: rows.slice(0, 5),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total posts", value: stats.total, icon: FileText, href: "/admin/posts" },
    { label: "Published", value: stats.published, icon: Send, href: "/admin/posts" },
    { label: "Drafts", value: stats.drafts, icon: FileText, href: "/admin/posts" },
    { label: "Categories", value: stats.categories, icon: FolderTree, href: "/admin/categories" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink-900">Welcome back</h2>
        <p className="mt-1 text-sm text-ink-500">
          A quick view of the content library and what needs attention.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="card-lift group rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="hover-arrow h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-2xl font-semibold tabular-nums text-ink-900">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-ink-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-ink-900">Recent posts</h2>
          <Link
            href="/admin/posts"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
          >
            All blogs
            <ArrowUpRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-500">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {stats.recent.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <Link
                    href={`/admin/posts/${post.id}`}
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
    </div>
  );
}
