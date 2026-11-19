import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  tone?: "light" | "inverse";
};

export function Breadcrumbs({ items, tone = "light" }: BreadcrumbsProps) {
  const muted = tone === "inverse" ? "text-white/60" : "text-ink-500";
  const link = tone === "inverse" ? "text-white/70 hover:text-teal-300" : "text-ink-500 hover:text-teal-700";
  const current = tone === "inverse" ? "text-white" : "text-ink-700";
  const chevron = tone === "inverse" ? "text-white/30" : "text-slate-300";

  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${muted}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight className={`h-3 w-3 ${chevron}`} aria-hidden="true" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={`transition-colors ${link}`}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={`font-medium ${current}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
