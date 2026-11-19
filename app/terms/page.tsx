import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { canonicalMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Edit this content to update the Terms page.
const termsContent = {
  title: "Terms of Use",
  effectiveDate: "Effective date: [add date]",
  intro:
    "By accessing or using TradeLens, you agree to these Terms of Use. Replace bracketed placeholders with your specific details before publishing.",
  sections: [
    {
      heading: "Educational purpose",
      body: [
        "This site provides educational content about markets and trading concepts. It does not provide financial, investment, legal or tax advice, and it does not recommend specific transactions.",
        "Trading involves risk and past performance is not indicative of future results. You are responsible for your own decisions.",
      ],
    },
    {
      heading: "Acceptable use",
      body: [
        "You agree to use the site lawfully and not to misuse, disrupt, scrape at scale, or attempt to gain unauthorised access to the site or its systems.",
        "You agree not to submit unlawful, abusive or misleading content through contact forms or other interactive features.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "Unless stated otherwise, the content, design and materials on this site are owned by or licensed to TradeLens and are protected by applicable intellectual property laws.",
        "You may view and share links to content for personal, non-commercial educational use, provided you do not misrepresent the material or remove attribution.",
      ],
    },
    {
      heading: "Third-party links",
      body: [
        "The site may include links to third-party websites or services. We are not responsible for their content, policies or practices.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, TradeLens and its contributors are not liable for any losses or damages arising from your use of, or reliance on, the site or its content.",
        "The site is provided on an “as is” and “as available” basis without warranties of any kind.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these Terms from time to time. Continued use of the site after changes take effect constitutes acceptance of the updated Terms.",
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the TradeLens website.",
  ...canonicalMetadata("/terms"),
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />

      <article className="mx-auto mt-8 max-w-3xl">
        <Reveal>
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Legal
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {termsContent.title}
            </h1>
            <p className="mt-2 text-sm text-ink-500">{termsContent.effectiveDate}</p>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {termsContent.intro}
            </p>
          </header>
        </Reveal>

        <div className="mt-10 space-y-8">
          {termsContent.sections.map((section, index) => (
            <Reveal key={section.heading} delay={Math.min(index * 0.05, 0.2)}>
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-serif text-2xl font-semibold text-ink-900">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-sm leading-relaxed text-ink-500">
            Questions about these Terms? Contact{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-medium text-teal-700 hover:underline"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </Reveal>
      </article>
    </div>
  );
}
