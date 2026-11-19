"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { createPost, updatePost, type PostFormData } from "@/app/admin/actions";

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

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    post?.cover_image_url ?? "",
  );
  const [category, setCategory] = useState(post?.category ?? "General");
  const [published, setPublished] = useState(post?.published ?? false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data: PostFormData = {
      id: post?.id,
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      category,
      published,
    };

    startTransition(async () => {
      try {
        if (post?.id) {
          await updatePost(data);
        } else {
          await createPost(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500";
  const labelClass = "mb-1 block text-sm font-medium text-ink-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="e.g. Risk management for swing traders"
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug
            </label>
            <input
              id="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={inputClass}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={inputClass}
              placeholder="Short summary shown on cards and in search results"
            />
          </div>

          <div>
            <span className={labelClass}>Content</span>
            <TiptapEditor initialContent={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="e.g. Strategies"
            />
          </div>

          <div>
            <label htmlFor="cover" className={labelClass}>
              Cover image URL
            </label>
            <input
              id="cover"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://… (Supabase Storage public URL)"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600"
            />
            Published
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/posts")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
