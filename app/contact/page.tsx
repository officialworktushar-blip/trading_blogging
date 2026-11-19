import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink-900">Contact us</h1>
      <p className="mt-3 text-ink-500">
        Have a question, topic suggestion, or want to contribute? Reach out —
        we read every message.
      </p>
      <dl className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div>
          <dt className="text-sm font-medium text-ink-500">Email</dt>
          <dd className="mt-1">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-brand-600 hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-ink-500">Phone</dt>
          <dd className="mt-1">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="text-brand-600 hover:underline"
            >
              {siteConfig.contact.phone}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
