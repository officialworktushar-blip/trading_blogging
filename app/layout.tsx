import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoadBar } from "@/components/animations/logo-mark";
import { TickerTape } from "@/components/animations/ticker-tape";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Trading Education`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <PageLoadBar />
        <SiteHeader />
        <TickerTape />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
