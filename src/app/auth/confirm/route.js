// src/app/auth/confirm/route.js
// Menerima pengguna yang mengklik link konfirmasi di email.
// Mendukung dua bentuk link:
//  - ?code=...        (link bawaan Supabase, alur PKCE)
//  - ?token_hash=...  (template email kustom, dipakai nanti bila SMTP sendiri terpasang)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const JENIS_BOLEH = ["signup", "email"];

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const jenis = searchParams.get("type");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Pendaftar baru selalu "pelajar", jadi tujuannya dashboard.
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  } else if (tokenHash && JENIS_BOLEH.includes(jenis)) {
    const { error } = await supabase.auth.verifyOtp({
      type: jenis,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Link tidak ada, salah, atau sudah kedaluwarsa.
  return NextResponse.redirect(`${origin}/login?galat=konfirmasi`);
}