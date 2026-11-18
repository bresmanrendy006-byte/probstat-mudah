// src/app/auth/confirm/route.js
// Menerima pengguna yang mengklik link konfirmasi di email.
// Memverifikasi token, membuat sesi, lalu mengalihkan ke /dashboard.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Jenis token yang kita terima dari email pendaftaran.
const JENIS_BOLEH = ["signup", "email"];

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const jenis = searchParams.get("type");

  if (tokenHash && JENIS_BOLEH.includes(jenis)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: jenis,
      token_hash: tokenHash,
    });
    if (!error) {
      // Pendaftar baru selalu "pelajar", jadi tujuannya dashboard.
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Token tidak ada, salah, atau sudah kedaluwarsa.
  return NextResponse.redirect(`${origin}/login?galat=konfirmasi`);
}