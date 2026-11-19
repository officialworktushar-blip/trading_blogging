import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
        404
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        Page not found
      </h1>
      <p className="mt-3 text-ink-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-navy-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-navy-800"
      >
        Back to home
      </Link>
    </div>
  );
}
