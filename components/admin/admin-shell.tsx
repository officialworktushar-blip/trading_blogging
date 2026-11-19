"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  Tags,
} from "lucide-react";
import { logoutAction } from "@/app/admin/auth-actions";
import { LogoMark } from "@/components/animations/logo-mark";
import { siteConfig } from "@/lib/site-config";

type AdminShellProps = {
  children: ReactNode;
  userEmail: string | null;
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { label: "All Blogs", href: "/admin/blogs", icon: FileText, exact: false },
  { label: "Add New Blog", href: "/admin/blogs/new", icon: PlusCircle, exact: true },
  { label: "Categories", href: "/admin/categories", icon: Tags, exact: true },
  { label: "Support Requests", href: "/admin/support", icon: MessageSquare, exact: true },
] as const;

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const current =
    navItems.find((item) => isActive(pathname, item.href, item.exact)) ?? navItems[0];

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden flex-col border-r border-navy-900 bg-navy-950 text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <LogoMark size={30} />
          <span className="font-semibold tracking-tight">{siteConfig.name}</span>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-teal-300"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                Admin console
              </p>
              <h1 className="truncate text-lg font-semibold text-ink-900">
                {current.label}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[10px] uppercase tracking-wider text-ink-500">
                  Signed in as
                </p>
                <p className="max-w-[220px] truncate text-xs font-medium text-ink-900">
                  {userEmail ?? "Unknown user"}
                </p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-red-200 hover:text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Log out
                </button>
              </form>
            </div>
          </div>
          <nav
            aria-label="Admin navigation"
            className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden"
          >
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-ink-500 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
