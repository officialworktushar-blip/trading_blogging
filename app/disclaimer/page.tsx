import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/animations/reveal";
import { canonicalMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Edit this content to update the Disclaimer page.
const disclaimerContent = {
  title: "Disclaimer",
  intro:
    "Please read this disclaimer carefully before using TradeLens or relying on any material published on this site.",
  sections: [
    {
      heading: "Education only, not financial advice",
      body: [
        "All content on this site — including articles, charts, examples, statistics and commentary — is provided for general educational and informational purposes only.",
        "Nothing on this site constitutes financial, investment, legal, tax or other professional advice, and nothing should be interpreted as a recommendation to buy, sell or hold any security, currency, derivative or digital asset.",
      ],
    },
    {
      heading: "Trading involves risk",
      body: [
        "Trading and investing involve substantial risk, including the possible loss of some or all of your capital. Markets can move quickly and unpredictably, and leverage can amplify both gains and losses.",
        "You are solely responsible for evaluating any information and for any decisions you make. Consider seeking advice from a qualified, independent professional who understands your circumstances.",
      ],
    },
    {
      heading: "Past performance is not indicative of future results",
      body: [
        "Past performance, historical data, backtests and illustrative examples are not indicative of future results. Any strategy that worked in one market environment may fail in another.",
        "No representation is being made that any approach discussed on this site will or is likely to achieve profits or losses similar to those shown or described.",
      ],
    },
    {
      heading: "Illustrative and hypothetical material",
      body: [
        "Charts, figures and scenarios on this site may be simplified, hypothetical or illustrative. They are designed to explain concepts and should not be treated as live data, signals or guarantees.",
      ],
    },
    {
      heading: "No warranties",
      body: [
        "We aim to keep information accurate and up to date, but we make no warranties or representations about completeness, reliability or suitability. Content may contain errors or become outdated without notice.",
      ],
    },
  ],
  contactNote:
    "If you have questions about this disclaimer, contact us before relying on any material on this site.",
};

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Education only, not financial advice. Trading involves risk and past performance is not indicative of future results.",
  ...canonicalMetadata("/disclaimer"),
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />

      <article className="mx-auto mt-8 max-w-3xl">
        <Reveal>
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Legal
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {disclaimerContent.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {disclaimerContent.intro}
            </p>
          </header>
        </Reveal>

        <div className="mt-10 space-y-8">
          {disclaimerContent.sections.map((section, index) => (
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
            {disclaimerContent.contactNote}{" "}
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
