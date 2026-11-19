import { BlogForm } from "@/components/admin/blog-form";
import type { Post } from "@/lib/types";

type PostFormProps = {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    category: string;
    published: boolean;
  };
};

const DEFAULT_CATEGORIES = [
  "General",
  "Stock Market",
  "Forex",
  "Crypto",
  "Trading Strategies",
  "Technical Analysis",
];

export function PostForm({ post }: PostFormProps) {
  const fullPost: Post | null = post
    ? {
        ...post,
        sub_heading: null,
        cover_image_alt: null,
        cover_image_note: null,
        author: null,
        featured: false,
        created_at: new Date(0).toISOString(),
        updated_at: new Date(0).toISOString(),
      }
    : null;

  return (
    <BlogForm
      post={fullPost}
      categories={DEFAULT_CATEGORIES}
      existingSlugs={post ? [post.slug] : []}
    />
  );
}
