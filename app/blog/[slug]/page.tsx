import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";
import {
  formatDate,
  POST_SUMMARY_COLUMNS,
  type Post,
  type PostSummary,
} from "@/lib/types";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, canonicalMetadata, jsonLd } from "@/lib/seo";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { ShareBar } from "@/components/share-bar";
import { Reveal } from "@/components/animations/reveal";

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

async function getRelatedPosts(post: Post): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to load related posts:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const canonical = canonicalMetadata(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    ...canonical,
    openGraph: {
      ...canonical.openGraph,
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

function readingMinutes(content: string): number {
  return Math.max(3, Math.round(content.replace(/<[^>]*>/g, " ").length / 900));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const categoryHref = `/blog?category=${encodeURIComponent(post.category)}`;
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const minutes = readingMinutes(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
  };

  return (
    <div>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
      />
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.category, href: categoryHref },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <header className="max-w-3xl">
              <Link
                href={categoryHref}
                className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
              >
                {post.category}
              </Link>
              <h1 className="text-balance mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
                {post.title}
              </h1>
              {post.sub_heading ? (
                <p className="mt-3 font-serif text-xl leading-snug text-ink-700">
                  {post.sub_heading}
                </p>
              ) : null}
              {post.excerpt ? (
                <p className="mt-5 text-lg leading-relaxed text-ink-500">
                  {post.excerpt}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-ink-500">
                {post.author ? <span>By {post.author}</span> : null}
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {minutes} min read
                </span>
              </div>
            </header>

            <div className="mt-9">
              {post.cover_image_url ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={post.cover_image_url}
                    alt={post.cover_image_alt || post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 860px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  label={post.cover_image_note || `Cover image: ${post.title}`}
                />
              )}
            </div>

            <div
              className="post-content mt-10 max-w-3xl text-ink-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Risk disclaimer
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                Trading involves risk. Content is for education only, not
                financial advice. Decide independently and consider speaking with
                a qualified professional before acting on any information.
              </p>
            </div>

            <ShareBar title={post.title} />

            <footer className="mt-8 max-w-3xl border-t border-slate-200 pt-8 text-sm text-ink-500">
              Questions about this article?{" "}
              <Link href="/contact-support" className="text-teal-700 hover:underline">
                Contact Support+
              </Link>{" "}
              or email{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-teal-700 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
              .
            </footer>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-lift rounded-xl border border-slate-200 bg-white p-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Before you trade
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
                <li>Write the idea and its invalidation level down first.</li>
                <li>Size the position so the planned stop is affordable.</li>
                <li>Review the outcome in a journal, not in hindsight.</li>
              </ul>
              <Link
                href="/contact-support"
                className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
              >
                Contact Support+
                <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-serif text-3xl font-semibold text-ink-900">
              Related articles
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} className="h-full" delay={index * 0.07}>
                  <ArticleCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
