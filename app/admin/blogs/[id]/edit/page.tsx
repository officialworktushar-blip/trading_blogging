import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { getBlogOptions } from "@/lib/admin-blog-options";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Blog",
};

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load blog:", error.message);
    return null;
  }
  return (data as Post | null) ?? null;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const { categories, slugs } = await getBlogOptions(id);
  return (
    <BlogForm
      key={post.id}
      post={post}
      categories={categories}
      existingSlugs={slugs}
    />
  );
}
