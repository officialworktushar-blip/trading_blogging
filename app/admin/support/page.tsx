import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Support Requests",
};

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-900">Support Requests</h2>
        <p className="mt-1 text-sm text-ink-500">
          Inbox for questions sent through the contact page.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-ink-900">No stored requests yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          Contact messages are delivered to the support mailbox. Connect a
          support_requests table here later if you want to track them inside
          the CMS.
        </p>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Open mailbox
          <ArrowUpRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <Link
        href="/contact"
        target="_blank"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
      >
        View public contact page
        <ArrowUpRight className="hover-arrow h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
