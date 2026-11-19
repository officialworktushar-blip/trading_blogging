import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { formatDate, type Post } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load post:", error.message);
    return null;
  }
  return (data as Post | null) ?? null;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: "article",
      publishedTime: post.created_at,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        ← Back to blog
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3 text-sm text-ink-500">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="rounded-full bg-brand-50 px-2.5 py-0.5 font-medium text-brand-700 hover:bg-brand-100"
          >
            {post.category}
          </Link>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg text-ink-500">{post.excerpt}</p>
        ) : null}
      </header>

      {post.cover_image_url ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* Content is authored HTML from the TipTap editor in /admin */}
      <div
        className="post-content mt-10 text-ink-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-ink-500">
        Questions about this article? Email{" "}
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-brand-600 hover:underline"
        >
          {siteConfig.contact.email}
        </a>
        .
      </footer>
    </article>
  );
}
