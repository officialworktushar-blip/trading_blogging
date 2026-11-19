"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { LogoMark } from "@/components/animations/logo-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-ink-900">
            {siteConfig.name}
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="ml-4 hidden flex-1 items-center justify-between gap-2 xl:flex"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap text-[13px] font-medium transition-colors ${
                isActive(item.href)
                  ? "text-teal-700"
                  : "text-ink-700 hover:text-teal-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700"
          >
            {searchOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((open) => !open);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700 xl:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <form
        id="site-search"
        action="/blog"
        method="get"
        aria-hidden={!searchOpen}
        className={`absolute inset-x-0 top-full origin-top border-b border-slate-200 bg-white px-4 py-3 shadow-lg transition-[opacity,transform] duration-200 ${
          searchOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <label htmlFor="site-search-input" className="sr-only">
            Search articles
          </label>
          <input
            id="site-search-input"
            ref={inputRef}
            type="search"
            name="q"
            placeholder="Search guides, strategies and markets…"
            tabIndex={searchOpen ? 0 : -1}
            className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-ink-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            tabIndex={searchOpen ? 0 : -1}
            className="h-10 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Search
          </button>
        </div>
      </form>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 pb-5 pt-2 shadow-xl transition-[opacity,transform] duration-200 xl:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="mx-auto grid max-w-2xl gap-1 sm:grid-cols-2">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-teal-50 text-teal-700"
                    : "text-ink-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="sm:col-span-2">
            <Link
              href="/admin/dashboard"
              tabIndex={menuOpen ? 0 : -1}
              className="mt-2 block rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-slate-50"
            >
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
