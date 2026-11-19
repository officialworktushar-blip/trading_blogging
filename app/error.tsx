"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-ink-900">
        Something went wrong
      </h1>
      <p className="mt-3 text-ink-500">
        An unexpected error occurred. Please try again.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="mt-6 max-w-full overflow-x-auto rounded-lg bg-slate-100 p-4 text-left text-xs text-red-700">
          {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ""}
        </pre>
      ) : null}
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
