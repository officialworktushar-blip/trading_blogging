import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  not_authorized: "This email is not authorized for admin access.",
  admin_check_failed: "Could not verify admin access. Please try again.",
  auth_check_failed: "Your session could not be verified. Please sign in again.",
  auth_not_configured: "Authentication is not configured on this server.",
  logout_failed: "Sign out did not complete. Please try again.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Admin session lookup failed:", userError.message);
  }

  const user = data.user;
  if (user?.email) {
    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .ilike("email", user.email.toLowerCase())
      .maybeSingle();

    if (adminError) {
      console.error("Admin allowlist lookup failed:", adminError.message);
    } else if (adminRow) {
      redirect("/admin/dashboard");
    } else {
      await supabase.auth.signOut();
    }
  }

  const notice = error ? (errorMessages[error] ?? "Sign in failed. Please try again.") : null;

  return (
    <div className="relative">
      <LoginForm notice={notice} />
      <Link
        href="/"
        className="fixed bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-teal-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to site
      </Link>
    </div>
  );
}
