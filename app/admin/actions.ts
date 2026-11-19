"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createClient } from "@/lib/supabase";

export type PostFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  published: boolean;
};

function toRow(data: PostFormData) {
  return {
    title: data.title.trim(),
    slug: data.slug.trim() || slugify(data.title, { lower: true, strict: true }),
    excerpt: data.excerpt.trim() || null,
    content: data.content,
    cover_image_url: data.coverImageUrl.trim() || null,
    category: data.category.trim() || "General",
    published: data.published,
  };
}

function revalidatePost(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/dashboard");
}

export async function createPost(data: PostFormData): Promise<void> {
  const supabase = await createClient();
  const row = toRow(data);

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert(row)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);
  revalidatePost(inserted.slug);
  redirect("/admin/blogs");
}

export async function updatePost(data: PostFormData): Promise<void> {
  if (!data.id) throw new Error("Missing post id");
  const supabase = await createClient();
  const row = toRow(data);

  const { error } = await supabase.from("posts").update(row).eq("id", data.id);
  if (error) throw new Error(error.message);

  revalidatePost(row.slug);
  redirect("/admin/blogs");
}

export async function deletePost(id: string, slug: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePost(slug);
}
