import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-ink-900">{siteConfig.name}</p>
          <p className="mt-1">{siteConfig.description}</p>
        </div>
        <div className="flex flex-col gap-1">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="hover:text-brand-600"
          >
            {siteConfig.contact.email}
          </a>
          <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-brand-600">
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>
    </footer>
  );
}
