"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";
import { IMAGE_BUCKET, storagePathFromPublicUrl } from "@/lib/image-path";
import { toSlug, uniqueSlug } from "@/lib/slug-utils";

export type SaveBlogState = {
  ok: boolean;
  error: string | null;
  id?: string;
  slug?: string;
};

export type ActionResult = {
  ok: boolean;
  error?: string;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

async function removeStoredImage(
  supabase: SupabaseServerClient,
  url: string | null | undefined,
): Promise<void> {
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  if (error) console.error("Failed to remove old image:", error.message);
}

function revalidateBlog(slug: string, category: string, id: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/blog/category/${encodeURIComponent(category)}`);
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/blogs/${id}/edit`);
}

export async function saveBlogAction(
  _previousState: SaveBlogState,
  formData: FormData,
): Promise<SaveBlogState> {
  const id = text(formData, "id");
  const rawTitle = text(formData, "title");
  const subHeading = text(formData, "sub_heading");
  const excerpt = text(formData, "excerpt");
  const content = String(formData.get("content") ?? "");
  const rawSlug = text(formData, "slug");
  const category = text(formData, "category") || "General";
  const coverUrl = text(formData, "cover_image_url");
  const coverAlt = text(formData, "cover_image_alt");
  const coverNote = text(formData, "cover_image_note");
  const author = text(formData, "author");
  const previousCoverUrl = text(formData, "previous_cover_image_url");
  const published = formData.get("published") === "true";
  const featured = formData.get("featured") === "true";

  if (!rawTitle) return { ok: false, error: "Heading is required." };
  if (!excerpt) return { ok: false, error: "Short description is required." };
  if (!content.trim()) return { ok: false, error: "Content is required." };

  const supabase = await createClient();

  let slugQuery = supabase.from("posts").select("slug");
  if (id) slugQuery = slugQuery.neq("id", id);
  const { data: slugRows, error: slugError } = await slugQuery;
  if (slugError) {
    console.error("Failed to check slugs:", slugError.message);
    return { ok: false, error: "Could not verify the slug. Please try again." };
  }

  const taken = (slugRows ?? []).map((row) => String(row.slug ?? ""));
  const existingSlug = id ? taken.find((slug) => slug === rawSlug) : undefined;
  const slug = uniqueSlug(
    rawSlug || toSlug(rawTitle),
    taken,
    existingSlug ?? null,
  );

  const row = {
    title: rawTitle,
    sub_heading: subHeading || null,
    slug,
    excerpt,
    content,
    cover_image_url: coverUrl || null,
    cover_image_alt: coverAlt || null,
    cover_image_note: coverNote || null,
    category,
    author: author || null,
    featured,
    published,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) {
      console.error("Failed to update blog:", error.message);
      return { ok: false, error: "Could not save the blog. Please try again." };
    }
    if (previousCoverUrl && previousCoverUrl !== coverUrl) {
      await removeStoredImage(supabase, previousCoverUrl);
    }
    revalidateBlog(slug, category, id);
    return { ok: true, error: null, id, slug };
  }

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert(row)
    .select("id, slug")
    .single();

  if (error) {
    console.error("Failed to create blog:", error.message);
    return { ok: false, error: "Could not create the blog. Please try again." };
  }

  const newId = String(inserted.id);
  const newSlug = String(inserted.slug ?? slug);
  revalidateBlog(newSlug, category, newId);
  return { ok: true, error: null, id: newId, slug: newSlug };
}

export async function setPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug, category")
    .single();

  if (error) {
    console.error("Failed to update status:", error.message);
    return { ok: false, error: "Could not update status." };
  }

  revalidateBlog(String(data.slug), String(data.category), id);
  return { ok: true };
}

export async function deleteBlogAction(
  id: string,
  slug: string,
  category: string,
  coverUrl: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete blog:", error.message);
    return { ok: false, error: "Could not delete the blog." };
  }

  await removeStoredImage(supabase, coverUrl);
  revalidateBlog(slug, category, id);
  return { ok: true };
}
