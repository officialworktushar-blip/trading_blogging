"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/auth-actions";
import { LogoMark } from "@/components/animations/logo-mark";
import { siteConfig } from "@/lib/site-config";

const initialState: LoginState = { error: null };

export function LoginForm({ notice }: { notice?: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const message = state.error ?? notice;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5">
          <LogoMark size={36} />
          <span className="text-xl font-bold tracking-tight text-white">
            {siteConfig.name}
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-navy-900 p-7 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            Admin console
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-white">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Use the email and password created for your admin account.
          </p>

          <form action={formAction} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-teal-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-teal-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {message ? (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          Trading involves risk. Content is for education only, not financial
          advice.
        </p>
      </div>
    </div>
  );
}
