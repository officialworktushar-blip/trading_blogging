import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { PageLoadBar } from "@/components/animations/logo-mark";
import { SiteChrome } from "@/components/site-chrome";
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
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PageLoadBar />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
