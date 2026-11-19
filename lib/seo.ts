import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export function canonicalMetadata(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const url = absoluteUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: { url },
  };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
