import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, type Post } from "@/lib/types";
import { BlogRowActions } from "@/components/admin/blog-row-actions";
import { ToastOnLoad } from "@/components/admin/toast-on-load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Blogs",
};

type BlogsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    saved?: string;
    error?: string;
  }>;
};

type BlogRow = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "cover_image_url"
  | "category"
  | "published"
  | "featured"
  | "created_at"
>;

async function getBlogs(
  query: string,
  status: string,
  category: string,
): Promise<BlogRow[]> {
  const supabase = await createClient();
  let builder = supabase
    .from("posts")
    .select("id, title, slug, cover_image_url, category, published, featured, created_at");

  const cleanQuery = query.replace(/[%,"\\()';]/g, " ").trim();
  if (cleanQuery) {
    builder = builder.or(
      `title.ilike.%${cleanQuery}%,excerpt.ilike.%${cleanQuery}%`,
    );
  }
  if (status === "published" || status === "draft") {
    builder = builder.eq("published", status === "published");
  }
  if (category) builder = builder.eq("category", category);

  const { data, error } = await builder.order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load blogs:", error.message);
    return [];
  }
  return (data ?? []) as BlogRow[];
}

async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("category");
  if (error) {
    console.error("Failed to load categories:", error.message);
    return [];
  }
  const values = new Set<string>();
  for (const row of data ?? []) {
    const value = String(row.category ?? "").trim();
    if (value) values.add(value);
  }
  return Array.from(values).sort();
}

const toastMessages: Record<string, string> = {
  created: "Blog created.",
  updated: "Blog updated.",
};

export default async function AdminBlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = params.status ?? "";
  const category = params.category ?? "";
  const [blogs, categories] = await Promise.all([
    getBlogs(query, status, category),
    getCategories(),
  ]);
  const toast = params.saved
    ? (toastMessages[params.saved] ?? "Blog saved.")
    : params.error;

  return (
    <div className="space-y-6">
      <ToastOnLoad message={toast} tone={params.saved ? "success" : "error"} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">All Blogs</h2>
          <p className="mt-1 text-sm text-ink-500">
            Search, filter and manage every article.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          + Add New Blog
        </Link>
      </div>

      <form
        method="get"
        action="/admin/blogs"
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_160px_180px_auto_auto]"
      >
        <label className="sr-only" htmlFor="blog-search">
          Search blogs
        </label>
        <input
          id="blog-search"
          name="q"
          defaultValue={query}
          placeholder="Search by title or description…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <label className="sr-only" htmlFor="blog-status-filter">
          Status
        </label>
        <select
          id="blog-status-filter"
          name="status"
          defaultValue={status}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <label className="sr-only" htmlFor="blog-category-filter">
          Category
        </label>
        <select
          id="blog-category-filter"
          name="category"
          defaultValue={category}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Filter
        </button>
        <Link
          href="/admin/blogs"
          className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-ink-700 hover:bg-slate-50"
        >
          Clear
        </Link>
      </form>

      {blogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          No blogs match these filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Thumbnail</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-4 py-3">
                    <div
                      role="img"
                      aria-label={blog.cover_image_url ? `Cover for ${blog.title}` : "No cover image"}
                      className="h-12 w-20 rounded-md border border-slate-200 bg-slate-100 bg-cover bg-center"
                      style={
                        blog.cover_image_url
                          ? { backgroundImage: `url("${blog.cover_image_url}")` }
                          : undefined
                      }
                    />
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="block truncate font-medium text-ink-900 hover:text-teal-700"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-ink-500">
                      /blog/{blog.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{blog.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          blog.published
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-ink-500"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                      {blog.featured ? (
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-500">
                    {formatDate(blog.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <BlogRowActions
                      id={blog.id}
                      slug={blog.slug}
                      title={blog.title}
                      coverUrl={blog.cover_image_url}
                      category={blog.category}
                      published={blog.published}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
