"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { resolveSupportRequestAction } from "@/app/admin/support-requests/actions";
import { useToast } from "@/components/admin/toast-provider";

type SupportRequestActionsProps = {
  id: string;
  resolved: boolean;
};

export function SupportRequestActions({
  id,
  resolved,
}: SupportRequestActionsProps) {
  const router = useRouter();
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await resolveSupportRequestAction(id, !resolved);
      if (result.ok) {
        show(resolved ? "Marked as open." : "Marked as resolved.");
        router.refresh();
      } else {
        show(result.error ?? "Could not update request.", "error");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        resolved
          ? "border border-slate-300 text-ink-700 hover:bg-slate-50"
          : "bg-teal-600 text-white hover:bg-teal-700"
      }`}
    >
      {isPending ? "Saving…" : resolved ? "Reopen" : "Mark resolved"}
    </button>
  );
}
