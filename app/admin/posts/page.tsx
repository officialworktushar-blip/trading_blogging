import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, type Post } from "@/lib/types";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts",
};

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink-900">
          All posts ({posts.length})
        </h2>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-ink-500">
          No posts yet. Create your first one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id} className="bg-white">
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-ink-500">{post.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-ink-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-500">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </Link>
                      {post.published ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-medium text-ink-500 hover:text-ink-900"
                        >
                          View
                        </Link>
                      ) : null}
                      <DeletePostButton id={post.id} slug={post.slug} />
                    </div>
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
