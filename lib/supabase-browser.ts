import { createBrowserClient } from "@supabase/ssr";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return { url, key };
}

/**
 * Browser-side Supabase client. Import this only from "use client"
 * components (e.g. @/lib/supabase-browser).
 */
export function createClient() {
  const { url, key } = getEnv();
  return createBrowserClient(url, key);
}
