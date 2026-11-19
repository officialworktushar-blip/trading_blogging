import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/admin/toast-provider";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Admin session lookup failed:", error.message);
  }

  return (
    <ToastProvider>
      <AdminShell userEmail={data.user?.email ?? null}>{children}</AdminShell>
    </ToastProvider>
  );
}
