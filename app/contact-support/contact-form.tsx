"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitSupportRequest, type SupportState } from "./actions";

const initialState: SupportState = { status: "idle", error: null };

export function ContactSupportForm() {
  const [state, formAction, isPending] = useActionState(
    submitSupportRequest,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-ink-900 placeholder:text-slate-400 outline-none focus:border-teal-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-700";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support-name" className={labelClass}>
            Name
          </label>
          <input
            id="support-name"
            name="name"
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="support-email" className={labelClass}>
            Email
          </label>
          <input
            id="support-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="support-topic" className={labelClass}>
          Topic
        </label>
        <select
          id="support-topic"
          name="topic"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          <option value="General question">General question</option>
          <option value="Topic suggestion">Topic suggestion</option>
          <option value="Site or accessibility issue">
            Site or accessibility issue
          </option>
          <option value="Partnership">Partnership</option>
        </select>
      </div>
      <div>
        <label htmlFor="support-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="support-message"
          name="message"
          required
          rows={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 outline-none focus:border-teal-500"
          placeholder="How can we help?"
        />
      </div>

      {state.status === "success" ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm text-teal-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Message sent. We read every request and will reply by email when a
          response is needed.
        </p>
      ) : null}
      {state.status === "error" && state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs leading-relaxed text-ink-500">
        Trading involves risk. Content is for education only, not financial
        advice. We cannot provide personalised investment recommendations.
      </p>
    </form>
  );
}
