"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

type ShareBarProps = {
  title: string;
};

type ShareNavigator = Navigator & {
  share?: (data: { title?: string; url?: string }) => Promise<void>;
};

export function ShareBar({ title }: ShareBarProps) {
  const [status, setStatus] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function flash(message: string) {
    setStatus(message);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(""), 2400);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("Link copied");
    } catch {
      flash("Copy unavailable — use the address bar");
    }
  }

  async function handleShare() {
    const share = (navigator as ShareNavigator).share;
    if (!share) {
      await handleCopy();
      return;
    }
    try {
      await share({ title, url: window.location.href });
    } catch {
      flash("Sharing cancelled");
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
        Share this guide
      </span>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700"
      >
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        Copy link
      </button>
      <button
        type="button"
        onClick={() => void handleShare()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700"
      >
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
        Share
      </button>
      {status ? (
        <span role="status" className="inline-flex items-center gap-1 text-xs text-teal-700">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          {status}
        </span>
      ) : null}
    </div>
  );
}
