import type { Metadata } from "next";
import { Clock3, Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { canonicalMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ContactSupportForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Support+",
  description: "Questions, topic suggestions and support for TradeLens.",
  ...canonicalMetadata("/contact-support"),
};

export default function ContactSupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact Support+" }]}
      />

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Contact Support+
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Ask a question, suggest a topic
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          We read every message. Topic requests help decide which guide gets
          written next; accessibility or site issues get priority.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Reveal>
          <ContactSupportForm />
        </Reveal>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <Reveal delay={0.06}>
            <div className="card-lift rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                Contact details
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-ink-700">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="mt-0.5 block font-medium text-teal-700 hover:underline"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Phone
                    </p>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="mt-0.5 block font-medium text-ink-900 hover:text-teal-700"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Hours
                    </p>
                    <p className="mt-0.5 font-medium text-ink-900">
                      {siteConfig.contact.hours}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-ink-500">
              We can help clarify concepts from guides, take topic suggestions,
              and fix site or accessibility issues. We cannot provide
              personalised investment recommendations.
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
