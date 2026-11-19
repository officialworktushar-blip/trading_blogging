import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { canonicalMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Edit this content to update the Privacy Policy page.
const privacyContent = {
  title: "Privacy Policy",
  effectiveDate: "Effective date: [add date]",
  intro:
    "This Privacy Policy explains how TradeLens collects, uses and protects information when you use this website. Replace bracketed placeholders with your specific details before publishing.",
  sections: [
    {
      heading: "Information we collect",
      body: [
        "Information you provide: when you contact us, we collect the details you submit (such as name, email address, topic and message).",
        "Usage information: we may collect basic technical information such as browser type, pages visited and approximate usage patterns to keep the site reliable and improve content.",
      ],
    },
    {
      heading: "How we use information",
      body: [
        "To respond to questions, topic suggestions and support requests.",
        "To operate, maintain and improve the website and its educational content.",
        "To protect the site against abuse, spam or technical issues.",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "This site may use essential cookies required for core functionality and, where enabled, analytics tools to understand aggregate usage.",
        "You can control cookies through your browser settings. Disabling some cookies may affect site functionality.",
      ],
    },
    {
      heading: "Sharing and retention",
      body: [
        "We do not sell your personal information. We may share information with service providers who help us operate the site (such as hosting or database services), only as needed to provide those services.",
        "We retain information only for as long as reasonably necessary for the purposes described above or as required by law.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You may request access to, correction of, or deletion of information you have submitted by contacting us. We will respond as required by applicable law.",
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TradeLens collects, uses and protects information.",
  ...canonicalMetadata("/privacy-policy"),
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <article className="mx-auto mt-8 max-w-3xl">
        <Reveal>
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Legal
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {privacyContent.title}
            </h1>
            <p className="mt-2 text-sm text-ink-500">{privacyContent.effectiveDate}</p>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {privacyContent.intro}
            </p>
          </header>
        </Reveal>

        <div className="mt-10 space-y-8">
          {privacyContent.sections.map((section, index) => (
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
            For privacy questions, contact{" "}
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
