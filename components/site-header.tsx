import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-ink-900"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-ink-700">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-md bg-ink-900 px-3 py-1.5 text-white transition-colors hover:bg-ink-700"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
