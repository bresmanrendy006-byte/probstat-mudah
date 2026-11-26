"use client";

// src/app/atur-ulang-sandi/page.js
// Tujuan link pemulihan. Pengguna sudah punya sesi sementara dari /auth/pulihkan,
// lalu mengisi kata sandi baru.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const isian =
  "mt-1.5 w-full rounded-2xl border border-brand/20 bg-paper px-4 py-3 outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15";

const pesanGalat = {
  same_password: "Kata sandi baru harus berbeda dari yang lama.",
  weak_password: "Kata sandi ditolak karena terlalu lemah. Coba yang lebih kuat.",
};

export default function AturUlangSandi() {
  const router = useRouter();
  // "cek" = sedang memeriksa sesi, "ada" = boleh mengisi, "tidak" = tidak ada sesi
  const [status, setStatus] = useState("cek");
  const [password, setPassword] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setStatus(data?.user ? "ada" : "tidak");
    });
  }, []);

  const aturan = [
    [password.length >= 8, "Minimal 8 karakter"],
    [/[A-Za-z]/.test(password), "Mengandung huruf"],
    [/\d/.test(password), "Mengandung angka"],
    [password.length > 0 && password === ulang, "Kedua isian sama"],
  ];
  const semuaOk = aturan.every(([ok]) => ok);

  async function simpan(e) {
    e.preventDefault();
    setGalat("");
    if (!semuaOk) {
      setGalat("Lengkapi dulu semua aturan di bawah kolom isian.");
      return;
    }
    setProses(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.warn("Galat atur ulang sandi:", error.code, error.status);
      setGalat(pesanGalat[error.code] ?? "Gagal menyimpan kata sandi baru. Coba lagi.");
      setProses(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (status === "cek") {
    return <p className="mt-10 text-center text-sm text-ink/60">Memeriksa link...</p>;
  }

  if (status === "tidak") {
    return (
      <div className="mx-auto mt-4 max-w-md animate-rise">
        <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
          <h1 className="text-3xl font-bold">Link belum berlaku</h1>
          <p className="mt-2 text-sm text-ink/70">
            Halaman ini hanya bisa dibuka lewat link di email pemulihan. Link mungkin sudah
            kedaluwarsa atau dibuka di browser yang berbeda.
          </p>
          <Link
            href="/lupa-sandi"
            className="mt-5 inline-block rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5"
          >
            Minta link baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-md animate-rise">
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
        <h1 className="text-3xl font-bold">Kata sandi baru</h1>
        <p className="mt-1 text-sm text-ink/70">Buat kata sandi baru untuk akunmu.</p>

        <form onSubmit={simpan} noValidate className="mt-5 space-y-5">
          <div>
            <label htmlFor="sandi-baru" className="text-sm font-semibold">Kata sandi baru</label>
            <div className="flex gap-2">
              <input
                id="sandi-baru"
                type={lihat ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={isian}
              />
              <button
                type="button"
                onClick={() => setLihat(!lihat)}
                aria-pressed={lihat}
                className="mt-1.5 shrink-0 rounded-2xl border border-brand/20 bg-white px-4 text-sm font-semibold transition hover:bg-sun/50"
              >
                {lihat ? "Sembunyi" : "Lihat"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="sandi-ulang" className="text-sm font-semibold">Ulangi kata sandi baru</label>
            <input
              id="sandi-ulang"
              type={lihat ? "text" : "password"}
              autoComplete="new-password"
              value={ulang}
              onChange={(e) => setUlang(e.target.value)}
              className={isian}
            />
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {aturan.map(([ok, teks]) => (
                <li
                  key={teks}
                  className={`flex items-center gap-2 ${
                    ok ? "font-semibold text-emerald-700" : "text-ink/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      ok ? "bg-mint text-ink" : "bg-lavender text-ink/50"
                    }`}
                  >
                    {ok ? "✓" : "○"}
                  </span>
                  <span>{teks}</span>
                </li>
              ))}
            </ul>
          </div>

          {galat && (
            <p role="alert" className="rounded-2xl bg-rose/40 px-4 py-3 text-sm font-semibold">
              {galat}
            </p>
          )}

          <button
            type="submit"
            disabled={proses || !semuaOk}
            className="w-full rounded-full bg-linear-to-r from-brand to-[#8b7ee8] py-3 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {proses ? "Menyimpan..." : "Simpan kata sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}