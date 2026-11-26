"use client";

// src/app/lupa-sandi/page.js
// Pengguna mengisi email, lalu Supabase mengirim link untuk mengatur ulang kata sandi.

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const isian =
  "mt-1.5 w-full rounded-2xl border border-brand/20 bg-paper px-4 py-3 outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15";

const JEDA_DETIK = 60;

function FormLupa() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [galat, setGalat] = useState(
    params.get("galat") === "link"
      ? "Link tidak bisa dipakai. Mungkin sudah kedaluwarsa, sudah pernah diklik, atau dibuka di browser yang berbeda. Minta link baru di bawah ini."
      : ""
  );
  const [info, setInfo] = useState("");
  const [proses, setProses] = useState(false);
  const [sisa, setSisa] = useState(0);

  // Hitung mundur supaya tombol tidak ditekan berulang (kuota email kecil)
  useEffect(() => {
    if (sisa <= 0) return;
    const id = setTimeout(() => setSisa(sisa - 1), 1000);
    return () => clearTimeout(id);
  }, [sisa]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  async function kirim(e) {
    e.preventDefault();
    setGalat("");
    setInfo("");
    if (!emailOk) {
      setGalat("Isi email dengan format yang benar, contoh: nama@email.com.");
      return;
    }

    setProses(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/pulihkan`,
    });
    setProses(false);

    if (error) {
      console.warn("Galat lupa sandi:", error.code, error.status);
      setGalat(
        error.code === "over_email_send_rate_limit"
          ? "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi."
          : "Gagal mengirim email. Coba lagi sebentar lagi."
      );
      return;
    }

    // Pesan sengaja sama untuk email terdaftar maupun tidak (agar email orang lain tidak bisa ditebak).
    setInfo(
      "Jika email itu terdaftar, link untuk mengatur ulang kata sandi sudah dikirim. Cek kotak masuk dan folder spam. Buka link-nya di browser yang sama dengan yang kamu pakai sekarang."
    );
    setSisa(JEDA_DETIK);
  }

  return (
    <div className="mx-auto mt-4 max-w-md animate-rise">
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
        <h1 className="text-3xl font-bold">Lupa kata sandi</h1>
        <p className="mt-1 text-sm text-ink/70">
          Masukkan email akunmu. Kami kirimkan link untuk membuat kata sandi baru.
        </p>

        <form onSubmit={kirim} noValidate className="mt-5 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={isian}
            />
          </div>

          {galat && (
            <p role="alert" className="rounded-2xl bg-rose/40 px-4 py-3 text-sm font-semibold">
              {galat}
            </p>
          )}
          {info && (
            <p role="status" className="rounded-2xl bg-mint/30 px-4 py-3 text-sm font-semibold">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={proses || sisa > 0}
            className="w-full rounded-full bg-linear-to-r from-brand to-[#8b7ee8] py-3 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {proses
              ? "Mengirim..."
              : sisa > 0
                ? `Kirim lagi dalam ${sisa} detik`
                : "Kirim link"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink/60">
        Ingat kata sandimu?{" "}
        <Link href="/login" className="font-semibold text-brand underline underline-offset-2">
          Kembali masuk
        </Link>
      </p>
    </div>
  );
}

export default function LupaSandi() {
  return (
    <Suspense fallback={null}>
      <FormLupa />
    </Suspense>
  );
}