"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, useTransition } from "react";
import {
  deleteBlogAction,
  setPublishedAction,
} from "@/app/admin/blogs/actions";
import { useToast } from "@/components/admin/toast-provider";

type BlogRowActionsProps = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  category: string;
  published: boolean;
};

export function BlogRowActions({
  id,
  slug,
  title,
  coverUrl,
  category,
  published,
}: BlogRowActionsProps) {
  const router = useRouter();
  const { show } = useToast();
  const reduceMotion = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function toggleStatus() {
    startTransition(async () => {
      const result = await setPublishedAction(id, !published);
      if (result.ok) {
        show(published ? "Moved to drafts." : "Blog published.");
        router.refresh();
      } else {
        show(result.error ?? "Could not update status.", "error");
      }
    });
  }

  function confirmDelete() {
    setConfirming(false);
    startTransition(async () => {
      const result = await deleteBlogAction(id, slug, category, coverUrl);
      if (result.ok) {
        show("Blog deleted.");
        router.refresh();
      } else {
        show(result.error ?? "Could not delete blog.", "error");
      }
    });
  }

  return (
    <>
      <div className="flex justify-end gap-3 whitespace-nowrap">
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className="font-medium text-teal-700 hover:text-teal-800 disabled:opacity-50"
        >
          {published ? "Unpublish" : "Publish"}
        </button>
        <a
          href={`/admin/blogs/${id}/edit`}
          className="font-medium text-ink-700 hover:text-teal-700"
        >
          Edit
        </a>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={isPending}
          className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <AnimatePresence>
        {confirming ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/60 px-4"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setConfirming(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-title-${id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
            >
              <h2 id={`delete-title-${id}`} className="text-lg font-semibold text-ink-900">
                Delete this blog?
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                “{title}” and its stored cover image will be removed permanently.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-ink-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
