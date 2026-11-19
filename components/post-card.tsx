import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.cover_image_url ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-4xl font-bold text-brand-500">
            {post.title.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="p-5">
          <div className="mb-2 flex items-center gap-3 text-xs text-ink-500">
            <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
              {post.category}
            </span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          </div>
          <h3 className="text-lg font-semibold text-ink-900 group-hover:text-brand-600">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm text-ink-500">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
