"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { saveBlogAction, type SaveBlogState } from "@/app/admin/blogs/actions";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { useToast } from "@/components/admin/toast-provider";
import type { Post } from "@/lib/types";
import { toSlug, uniqueSlug } from "@/lib/slug-utils";

const initialState: SaveBlogState = { ok: false, error: null };

type BlogFormProps = {
  post?: Post | null;
  categories: string[];
  existingSlugs: string[];
};

export function BlogForm({ post, categories, existingSlugs }: BlogFormProps) {
  const router = useRouter();
  const { show } = useToast();
  const [state, formAction, isPending] = useActionState(saveBlogAction, initialState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [subHeading, setSubHeading] = useState(post?.sub_heading ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState(post?.category ?? categories[0] ?? "General");
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_image_alt ?? "");
  const [coverNote, setCoverNote] = useState(post?.cover_image_note ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [slugInput, setSlugInput] = useState(post?.slug ?? "");
  const [uploadCount, setUploadCount] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const redirected = useRef(false);
  const lastError = useRef<string | null>(null);

  const effectiveSlug = useMemo(() => {
    const base = slugTouched ? slugInput || title : title;
    return uniqueSlug(toSlug(base), existingSlugs, post?.slug ?? null);
  }, [existingSlugs, post?.slug, slugInput, slugTouched, title]);

  const uploading = uploadCount > 0;
  const invalid = !title.trim() || !excerpt.trim() || !content.trim();

  function trackUpload(busy: boolean) {
    setUploadCount((count) => Math.max(0, count + (busy ? 1 : -1)));
  }

  useEffect(() => {
    if (state.error && state.error !== lastError.current) {
      lastError.current = state.error;
      show(state.error, "error");
    }
    if (!state.error) lastError.current = null;
  }, [show, state.error]);

  useEffect(() => {
    if (!state.ok || redirected.current) return;
    redirected.current = true;
    show(post ? "Blog updated." : "Blog created.");
    router.push(`/admin/blogs?saved=${post ? "updated" : "created"}`);
  }, [post, router, show, state.ok]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlugInput(toSlug(value));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setFormError(null);
    if (uploading || invalid) {
      event.preventDefault();
      setFormError("Complete the required fields and wait for uploads to finish.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-teal-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-700";

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="space-y-6">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <label htmlFor="blog-title" className={labelClass}>
              Heading <span className="text-red-600">*</span>
            </label>
            <input
              id="blog-title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="blog-subheading" className={labelClass}>
              Sub Heading
            </label>
            <input
              id="blog-subheading"
              value={subHeading}
              onChange={(event) => setSubHeading(event.target.value)}
              className={inputClass}
              placeholder="Optional supporting line"
            />
          </div>
          <div>
            <label htmlFor="blog-excerpt" className={labelClass}>
              Short Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Content</label>
            <TiptapEditor
              initialContent={content}
              onChange={setContent}
              onUploadingChange={trackUpload}
              onError={(message) => show(message, "error")}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-900">Cover image</h2>
          <p className="mt-1 text-xs text-ink-500">
            Files are uploaded directly to Supabase Storage as WebP.
          </p>
          <div className="mt-4">
            <CoverImageField
              value={coverUrl}
              alt={coverAlt}
              note={coverNote}
              onChange={setCoverUrl}
              onAltChange={setCoverAlt}
              onNoteChange={setCoverNote}
              onBusyChange={trackUpload}
              onError={(message) => show(message, "error")}
            />
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <label htmlFor="blog-category" className={labelClass}>
              Category
            </label>
            <select
              id="blog-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="blog-author" className={labelClass}>
              Author
            </label>
            <input
              id="blog-author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className={inputClass}
              placeholder="Author name"
            />
          </div>
          <div>
            <label htmlFor="blog-slug" className={labelClass}>
              Slug
            </label>
            <input
              id="blog-slug"
              value={slugTouched ? slugInput : toSlug(title)}
              onChange={(event) => {
                setSlugTouched(true);
                setSlugInput(event.target.value);
              }}
              className={inputClass}
              placeholder="auto-generated-from-title"
            />
            <p className="mt-2 text-xs text-ink-500">
              Live URL:{" "}
              <Link
                href={`/blog/${effectiveSlug}`}
                target="_blank"
                className="break-all font-medium text-teal-700 hover:underline"
              >
                /blog/{effectiveSlug}
              </Link>
            </p>
          </div>
          <div>
            <label htmlFor="blog-status" className={labelClass}>
              Status
            </label>
            <select
              id="blog-status"
              value={published ? "published" : "draft"}
              onChange={(event) => setPublished(event.target.value === "published")}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-ink-700">
            Featured
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
          </label>
        </section>

        {(formError || state.error) && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError ?? state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || invalid || isPending}
            className="flex-1 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving…" : uploading ? "Uploading…" : "Save blog"}
          </button>
          <Link
            href="/admin/blogs"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </aside>

      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="sub_heading" value={subHeading} />
      <input type="hidden" name="excerpt" value={excerpt} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="slug" value={effectiveSlug} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="cover_image_alt" value={coverAlt} />
      <input type="hidden" name="cover_image_note" value={coverNote} />
      <input type="hidden" name="author" value={author} />
      <input type="hidden" name="published" value={String(published)} />
      <input type="hidden" name="featured" value={String(featured)} />
      <input
        type="hidden"
        name="previous_cover_image_url"
        value={post?.cover_image_url ?? ""}
      />
    </form>
  );
}
