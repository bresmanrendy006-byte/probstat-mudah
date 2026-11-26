// src/app/auth/pulihkan/route.js
// Menerima pengguna yang mengklik link "lupa kata sandi" di email.
// Berhasil -> halaman atur ulang sandi. Gagal -> kembali ke halaman lupa sandi.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const jenis = searchParams.get("type");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/atur-ulang-sandi`);
  } else if (tokenHash && jenis === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}/atur-ulang-sandi`);
  }

  return NextResponse.redirect(`${origin}/lupa-sandi?galat=link`);
}