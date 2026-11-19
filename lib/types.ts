export type Post = {
  id: string;
  title: string;
  sub_heading: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_note: string | null;
  category: string;
  author: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PostSummary = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_image_url"
  | "category"
  | "created_at"
>;

export const POST_SUMMARY_COLUMNS =
  "id, title, slug, excerpt, cover_image_url, category, created_at";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
