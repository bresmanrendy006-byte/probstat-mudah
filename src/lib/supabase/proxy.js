// src/lib/supabase/proxy.js
// Menyegarkan sesi login di setiap permintaan, dan menjaga halaman yang butuh login.
// Hanya /dashboard yang dijaga. Materi, video, dan kalkulator tetap terbuka untuk semua.

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // Jangan menaruh kode apa pun antara createServerClient dan getClaims.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const path = request.nextUrl.pathname;

  function alihkan(tujuan) {
    const url = request.nextUrl.clone();
    url.pathname = tujuan;
    const respons = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => respons.cookies.set(cookie));
    for (const header of ["cache-control", "expires", "pragma"]) {
      const nilai = supabaseResponse.headers.get(header);
      if (nilai) respons.headers.set(header, nilai);
    }
    return respons;
  }

  if (!user && path.startsWith("/dashboard")) return alihkan("/login");
  if (user && path.startsWith("/login")) return alihkan("/dashboard");

  return supabaseResponse;
}