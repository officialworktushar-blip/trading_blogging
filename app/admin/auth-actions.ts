"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export type LoginState = {
  error: string | null;
};

function friendlyAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return "Incorrect email or password.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Confirm your email before signing in.";
  }
  if (/rate limit|too many requests/i.test(message)) {
    return "Too many attempts. Wait a moment and try again.";
  }
  return "Unable to sign in. Please try again.";
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  const userEmail = data.user?.email?.toLowerCase();
  if (!userEmail) {
    await supabase.auth.signOut();
    return { error: "Sign-in failed. Please try again." };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", userEmail)
    .maybeSingle();

  if (adminError) {
    console.error("Admin allowlist lookup failed:", adminError.message);
    await supabase.auth.signOut();
    return { error: "Could not verify admin access. Please try again." };
  }

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "This email is not authorized for admin access." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  revalidatePath("/admin", "layout");

  if (error) {
    console.error("Admin sign-out failed:", error.message);
    redirect("/admin/login?error=logout_failed");
  }

  redirect("/admin/login");
}
