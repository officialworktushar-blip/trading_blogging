import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { formatDate } from "@/lib/types";
import { SupportRequestActions } from "@/components/admin/support-request-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support Requests",
};

type SupportRequest = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  resolved: boolean;
  created_at: string;
};

async function getRequests(): Promise<{
  requests: SupportRequest[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_requests")
    .select("id, name, email, topic, message, resolved, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load support requests:", error.message);
    return { requests: [], error: "Could not load support requests." };
  }

  return { requests: (data ?? []) as SupportRequest[], error: null };
}

export default async function AdminSupportRequestsPage() {
  const { requests, error } = await getRequests();
  const openCount = requests.filter((request) => !request.resolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-900">Support Requests</h2>
        <p className="mt-1 text-sm text-ink-500">
          Messages submitted through Contact Support+. {openCount} open.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {requests.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-ink-500">
          No support requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        request.resolved
                          ? "bg-slate-100 text-ink-500"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {request.resolved ? "Resolved" : "Open"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-700">
                      {request.topic}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-ink-900">
                    {request.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-500">
                    <a
                      href={`mailto:${request.email}`}
                      className="text-teal-700 hover:underline"
                    >
                      {request.email}
                    </a>
                    {" · "}
                    <time dateTime={request.created_at}>
                      {formatDate(request.created_at)}
                    </time>
                  </p>
                </div>
                <SupportRequestActions
                  id={request.id}
                  resolved={request.resolved}
                />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                {request.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
