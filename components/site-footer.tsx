import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { LogoMark } from "@/components/animations/logo-mark";

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="text-lg font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {siteConfig.description}
            </p>
            <div className="mt-5 space-y-1.5 text-sm text-white/65">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="block transition-colors hover:text-teal-300"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="block transition-colors hover:text-teal-300"
              >
                {siteConfig.contact.phone}
              </a>
              <p>{siteConfig.contact.hours}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm text-white/65">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-teal-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/55">
            Trading involves risk. Content is for education only, not financial advice.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <p>Illustrative charts and figures are for demonstration only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
