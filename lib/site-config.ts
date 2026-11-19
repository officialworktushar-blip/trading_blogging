export const siteConfig = {
  // TODO: replace with the real brand name
  name: "TradeLens",
  description:
    "Practical trading education: strategies, risk management, and market insights for serious traders.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    // TODO: replace with real contact details
    email: "hello@tradelens.example",
    phone: "+1 (555) 000-0000",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Categories", href: "/blog" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
