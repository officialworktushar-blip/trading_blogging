import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { PostForm } from "@/components/admin/post-form";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit post",
};

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load post:", error.message);
    notFound();
  }
  if (!data) notFound();

  const post = data as Post;

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-ink-900">
        Edit: {post.title}
      </h2>
      <PostForm post={post} />
    </div>
  );
}
