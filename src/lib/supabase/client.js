// src/lib/supabase/client.js
// Klien Supabase untuk kode yang berjalan di browser (komponen "use client").

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}