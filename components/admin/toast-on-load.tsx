"use client";

import { useEffect } from "react";
import { useToast } from "@/components/admin/toast-provider";

export function ToastOnLoad({
  message,
  tone = "success",
}: {
  message?: string | null;
  tone?: "success" | "error";
}) {
  const { show } = useToast();

  useEffect(() => {
    if (message) show(message, tone);
  }, [message, show, tone]);

  return null;
}
