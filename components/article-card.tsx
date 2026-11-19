import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/types";
import { ImagePlaceholder } from "@/components/image-placeholder";

type ArticleCardProps = {
  post: PostSummary;
  priority?: boolean;
  compact?: boolean;
};

function readingTime(post: PostSummary): string {
  const source = `${post.excerpt ?? ""} ${post.title}`;
  return `${Math.max(2, Math.round(source.length / 220))} min read`;
}

export function ArticleCard({ post, priority = false, compact = false }: ArticleCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Link href={href} className="block p-3 pb-0" tabIndex={-1} aria-hidden="true">
        {post.cover_image_url ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <ImagePlaceholder
            label={`Editorial image: ${post.title}`}
            compact={compact}
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-ink-500">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="rounded-full bg-teal-50 px-2.5 py-0.5 font-medium text-teal-700 transition-colors hover:bg-teal-100"
          >
            {post.category}
          </Link>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-ink-900 transition-colors group-hover:text-teal-700">
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {readingTime(post)}
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-semibold text-teal-700"
          >
            Read guide
            <ArrowUpRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
