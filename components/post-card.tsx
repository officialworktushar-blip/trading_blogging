import { ArticleCard } from "@/components/article-card";
import type { PostSummary } from "@/lib/types";

export function PostCard({ post }: { post: PostSummary }) {
  return <ArticleCard post={post} />;
}
