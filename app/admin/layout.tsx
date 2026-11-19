import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-ink-900">TradeLens CMS</h1>
        </div>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin/posts" className="text-ink-700 hover:text-brand-600">
            Posts
          </Link>
          <Link href="/admin/posts/new" className="text-ink-700 hover:text-brand-600">
            New post
          </Link>
          <Link href="/" className="text-ink-500 hover:text-ink-900">
            View site
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
