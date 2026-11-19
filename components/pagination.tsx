import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
};

function pageHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function visiblePages(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 0, total];
  if (current >= total - 3) return [1, 0, total - 4, total - 3, total - 2, total - 1, total];
  return [1, 0, current - 1, current, current + 1, 0, total];
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  params = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, params, currentPage - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Link>
      ) : null}
      {pages.map((page, index) =>
        page === 0 ? (
          <span key={`gap-${index}`} className="px-1.5 text-sm text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(basePath, params, page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-navy-900 text-white"
                : "border border-slate-200 text-ink-700 hover:border-teal-300 hover:text-teal-700"
            }`}
          >
            {page}
          </Link>
        ),
      )}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, params, currentPage + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink-700 transition-colors hover:border-teal-300 hover:text-teal-700"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
