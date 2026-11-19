"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";

export type SupportActionResult = {
  ok: boolean;
  error?: string;
};

export async function resolveSupportRequestAction(
  id: string,
  resolved: boolean,
): Promise<SupportActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_requests")
    .update({
      resolved,
      resolved_at: resolved ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update support request:", error.message);
    return { ok: false, error: "Could not update the request." };
  }

  revalidatePath("/admin/support-requests");
  return { ok: true };
}
