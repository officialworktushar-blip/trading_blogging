import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "Contact Support+",
  description: "Questions, topic suggestions and support for TradeLens.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Support+" }]} />

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

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Reveal className="h-full">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="card-lift group flex h-full flex-col rounded-xl border border-slate-200 p-6"
          >
            <Mail className="h-6 w-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Email the desk</h2>
            <p className="mt-2 text-sm text-ink-500">{siteConfig.contact.email}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
              Write to us
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </Reveal>
        <Reveal className="h-full" delay={0.06}>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="card-lift group flex h-full flex-col rounded-xl border border-slate-200 p-6"
          >
            <Phone className="h-6 w-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Call support</h2>
            <p className="mt-2 text-sm text-ink-500">{siteConfig.contact.phone}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
              Make a call
              <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </Reveal>
      </div>

      <section className="mt-14 max-w-3xl">
        <MessageSquare className="h-6 w-6 text-teal-700" aria-hidden="true" />
        <h2 className="mt-4 font-serif text-2xl font-semibold text-ink-900">
          What we can help with
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
          <li>Clarifying a concept explained in a guide.</li>
          <li>Suggesting a market, indicator or strategy breakdown.</li>
          <li>Reporting a broken chart, link or accessibility issue.</li>
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-ink-500">
          Trading involves risk. Content is for education only, not financial
          advice. We cannot provide personalised investment recommendations.
        </p>
        <Link
          href="/blog"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
        >
          Browse the knowledge base
          <ArrowRight className="hover-arrow h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
