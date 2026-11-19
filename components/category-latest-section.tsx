import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/animations/reveal";

type CategoryLatestSectionProps = {
  title: string;
  href: string;
  posts: PostSummary[];
  id?: string;
};

export function CategoryLatestSection({
  title,
  href,
  posts,
  id,
}: CategoryLatestSectionProps) {
  return (
    <section
      id={id}
      className="border-t border-slate-200 bg-slate-50 py-14 sm:py-16"
    >
      <Reveal>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Latest in {title}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900">
                {title} essentials
              </h2>
            </div>
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
            >
              View all
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink-500">
              No guides published here yet.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
