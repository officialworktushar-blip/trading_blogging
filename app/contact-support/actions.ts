"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";

export type SupportState = {
  status: "idle" | "success" | "error";
  error: string | null;
};

const topics = new Set([
  "General question",
  "Topic suggestion",
  "Site or accessibility issue",
  "Partnership",
]);

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitSupportRequest(
  _previous: SupportState,
  formData: FormData,
): Promise<SupportState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const topic = String(formData.get("topic") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !topic || !message) {
    return { status: "error", error: "Please fill in all fields." };
  }
  if (!isEmail(email)) {
    return { status: "error", error: "Enter a valid email address." };
  }
  if (!topics.has(topic)) {
    return { status: "error", error: "Choose a valid topic." };
  }
  if (message.length < 12) {
    return { status: "error", error: "Add a bit more detail to your message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("support_requests").insert({
    name,
    email,
    topic,
    message,
  });

  if (error) {
    console.error("Failed to submit support request:", error.message);
    return {
      status: "error",
      error: "Could not send your message. Please try again or email us directly.",
    };
  }

  revalidatePath("/admin/support-requests");
  return { status: "success", error: null };
}
