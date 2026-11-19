export const siteConfig = {
  name: "TradeLens",
  description:
    "Practical trading education: strategies, risk management, and market insights for serious traders.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "hello@tradelens.example",
    phone: "+1 (555) 000-0000",
    hours: "Monday–Friday, 9:00 AM–5:00 PM (ET)",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Stock Market", href: "/stock-market" },
    { label: "Forex", href: "/forex" },
    { label: "Crypto", href: "/crypto" },
    { label: "Trading Strategies", href: "/trading-strategies" },
    { label: "Technical Analysis", href: "/technical-analysis" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Support+", href: "/contact-support" },
    { label: "About Us", href: "/about-us" },
  ],
  footerColumns: [
    {
      title: "Learn",
      links: [
        { label: "Stock Market", href: "/stock-market" },
        { label: "Forex", href: "/forex" },
        { label: "Crypto", href: "/crypto" },
        { label: "Trading Strategies", href: "/trading-strategies" },
        { label: "Technical Analysis", href: "/technical-analysis" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "All articles", href: "/blog" },
        { label: "Search", href: "/search" },
        { label: "Latest guides", href: "/#latest" },
        { label: "About Us", href: "/about-us" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Support+", href: "/contact-support" },
        { label: "Email us", href: "mailto:hello@tradelens.example" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
} as const;

export type MarketTopic = {
  slug: string;
  label: string;
  short: string;
  description: string;
  bullets: string[];
  mockup: string;
};

export const marketTopics: MarketTopic[] = [
  {
    slug: "stock-market",
    label: "Stock Market",
    short: "Equities, indices and earnings-driven moves explained.",
    description:
      "Build a repeatable process for reading equities: market structure, sector rotation, earnings reactions and the risk controls that keep a losing day small.",
    bullets: [
      "How indices, sectors and individual equities move together",
      "Reading earnings gaps and volume confirmation",
      "Position sizing around volatile releases",
    ],
    mockup: "Daily stock index chart with support and resistance zones",
  },
  {
    slug: "forex",
    label: "Forex",
    short: "Major pairs, sessions and the mechanics of leverage.",
    description:
      "Understand the world's largest market. Learn how currency pairs are quoted, why sessions matter and how to plan trades around macro releases without overexposing an account.",
    bullets: [
      "Pips, spreads, lots and margin in plain language",
      "London, New York and Asia session behaviour",
      "News calendars and slippage-aware planning",
    ],
    mockup: "EUR/USD hourly chart with London and New York session shading",
  },
  {
    slug: "crypto",
    label: "Crypto",
    short: "Volatility, cycles and on-chain context for digital assets.",
    description:
      "Digital assets move fast. Get comfortable with volatility, market cycles, liquidity and the risk habits that matter when a market trades around the clock.",
    bullets: [
      "Volatility ranges and staged entries",
      "Spot versus derivatives: what changes",
      "Liquidity, exchange risk and custody basics",
    ],
    mockup: "BTC daily candlestick chart with a volatility band overlay",
  },
  {
    slug: "trading-strategies",
    label: "Trading Strategies",
    short: "Rules-based playbooks you can test and refine.",
    description:
      "A strategy is a set of decisions made before the market opens. Explore trend, breakout, pullback and mean-reversion frameworks, then learn how to validate them with a sample size.",
    bullets: [
      "Entry, stop and exit rules written down in advance",
      "Backtesting basics and avoiding curve fitting",
      "Journal reviews that produce real improvements",
    ],
    mockup: "Strategy playbook mockup with entry, stop and target labels",
  },
  {
    slug: "technical-analysis",
    label: "Technical Analysis",
    short: "Charts, indicators and price action without the noise.",
    description:
      "Read a chart as a record of decisions. Learn trend structure, candlestick context, volume, moving averages and oscillators as supporting evidence rather than signals on their own.",
    bullets: [
      "Trend lines, market structure and higher-timeframe context",
      "Candlestick patterns with volume confirmation",
      "RSI and moving averages used as context",
    ],
    mockup: "Multi-panel chart with candles, RSI gauge and volume bars",
  },
];

export type NavItem = (typeof siteConfig.nav)[number];
