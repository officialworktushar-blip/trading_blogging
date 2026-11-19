export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
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
