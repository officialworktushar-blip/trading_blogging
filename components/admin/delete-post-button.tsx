"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deletePost(id, slug);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed");
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </span>
  );
}
