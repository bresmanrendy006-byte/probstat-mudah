// src/lib/supabase/proxy.js
// Menyegarkan sesi login di setiap permintaan, dan menjaga halaman yang butuh login.
// Dijaga: /dashboard (harus login) dan /admin (harus login + role admin).
// Materi, video, dan kalkulator tetap terbuka untuk semua.
// Pengaman /admin juga ada di admin/layout.js dan admin/page.js; tembok sebenarnya
// tetap Row Level Security di database.

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Cocok untuk "/admin" dan "/admin/...", tapi bukan "/administrasi".
function dalamBagian(path, bagian) {
  return path === bagian || path.startsWith(`${bagian}/`);
}

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
    url.search = ""; // buang parameter lama (mis. ?mode=daftar)
    const respons = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => respons.cookies.set(cookie));
    for (const header of ["cache-control", "expires", "pragma"]) {
      const nilai = supabaseResponse.headers.get(header);
      if (nilai) respons.headers.set(header, nilai);
    }
    return respons;
  }

  // Halaman yang butuh login
  if (!user && (dalamBagian(path, "/dashboard") || dalamBagian(path, "/admin"))) {
    return alihkan("/login");
  }

  // Panel admin: harus admin. Role dibaca dari database (bukan dari user_metadata,
  // karena itu bisa dipalsukan pengguna). Kueri ini hanya jalan untuk alamat /admin.
  if (user && dalamBagian(path, "/admin")) {
    const { data: profil, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.sub)
      .maybeSingle();
    // Gagal tertutup: bila role tidak terbaca atau bukan admin, tolak.
    if (error || profil?.role !== "admin") return alihkan("/dashboard");
  }

  // Sudah login tidak perlu melihat halaman masuk lagi
  if (user && dalamBagian(path, "/login")) return alihkan("/dashboard");

  return supabaseResponse;
}