import type { Metadata } from "next";
import { getBlogOptions } from "@/lib/admin-blog-options";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add New Blog",
};

export default async function NewBlogPage() {
  const { categories, slugs } = await getBlogOptions();
  return <BlogForm categories={categories} existingSlugs={slugs} />;
}
