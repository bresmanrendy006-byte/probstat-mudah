"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pesanGalat = {
  invalid_credentials: "Email atau kata sandi salah.",
  user_already_exists: "Email ini sudah terdaftar. Coba masuk.",
  email_exists: "Email ini sudah terdaftar. Coba masuk.",
  weak_password: "Kata sandi ditolak karena terlalu lemah. Coba yang lebih kuat.",
  email_not_confirmed: "Email belum dikonfirmasi. Cek kotak masuk emailmu.",
  over_email_send_rate_limit: "Terlalu banyak percobaan. Tunggu beberapa menit.",
  validation_failed: "Format email tidak valid.",
};

const isian =
  "mt-1 w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 outline-none transition focus:bg-white focus:ring-2 focus:ring-sun";

// Daftar aturan di bawah kolom isian. Netral sebelum diisi, hijau jika terpenuhi, merah jika belum.
function Aturan({ id, terisi, daftar }) {
  return (
    <ul id={id} className="mt-2 space-y-1 text-xs">
      {daftar.map(([ok, teks]) => {
        const gaya = ok
          ? "font-semibold text-emerald-700"
          : terisi
          ? "text-red-700"
          : "text-ink/60";
        const tanda = ok ? "✓" : terisi ? "✕" : "○";
        return (
          <li key={teks} className={`flex items-start gap-1.5 ${gaya}`}>
            <span aria-hidden="true" className="w-3 shrink-0">{tanda}</span>
            <span>{teks}</span>
          </li>
        );
      })}
    </ul>
  );
}

function FormLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [daftar, setDaftar] = useState(params.get("mode") === "daftar");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [info, setInfo] = useState("");
  const [proses, setProses] = useState(false);

  const aturanNama = [[nama.trim().length >= 2 && nama.trim().length <= 50, "Nama 2 sampai 50 karakter"]];
  const aturanEmail = [
    [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()), "Format email valid, contoh: nama@email.com"],
  ];
  const aturanPassword = [
    [password.length >= 8, "Minimal 8 karakter"],
    [/[A-Za-z]/.test(password), "Mengandung huruf"],
    [/\d/.test(password), "Mengandung angka"],
  ];
  const semuaOk = [...aturanNama, ...aturanEmail, ...aturanPassword].every(([ok]) => ok);

  function ganti(modeDaftar) {
    setDaftar(modeDaftar);
    setGalat("");
    setInfo("");
  }

  async function kirim(e) {
    e.preventDefault();
    setGalat("");
    setInfo("");

    if (daftar && !semuaOk) {
      setGalat("Lengkapi dulu semua aturan di bawah kolom isian.");
      return;
    }
    if (!daftar && (!email.trim() || !password)) {
      setGalat("Isi email dan kata sandi.");
      return;
    }

    setProses(true);
    const supabase = createClient();

    if (daftar) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { nama: nama.trim() } },
      });
      if (error) {
        setGalat(pesanGalat[error.code] ?? "Pendaftaran gagal. Coba lagi.");
      } else if (data.session) {
        // Pendaftar baru selalu "pelajar".
        router.push("/dashboard");
        router.refresh();
      } else {
        setInfo("Pendaftaran berhasil. Cek emailmu untuk konfirmasi, lalu masuk.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setGalat(pesanGalat[error.code] ?? "Gagal masuk. Coba lagi.");
      } else {
        // Baca role dari database: admin ke /admin, pelajar ke /dashboard.
        const { data: profil } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        router.push(profil?.role === "admin" ? "/admin" : "/dashboard");
        router.refresh();
      }
    }
    setProses(false);
  }

  return (
    <div className="mx-auto mt-4 max-w-md animate-rise">
      <div className="rounded-2xl border-2 border-ink bg-white p-7 shadow-hard">
        <span className="grid size-11 place-items-center rounded-lg border-2 border-ink bg-brand text-xl text-white shadow-hard">
          σ
        </span>
        <h1 className="mt-4 text-3xl font-bold">{daftar ? "Daftar" : "Masuk"}</h1>
        <p className="mt-1 text-sm text-ink/70">
          {daftar
            ? "Buat akun untuk menyimpan progres belajarmu."
            : "Masuk untuk melihat progres belajarmu."}
        </p>

        <div className="mt-5 flex gap-2">
          {[
            ["Masuk", false],
            ["Daftar", true],
          ].map(([label, mode]) => (
            <button
              key={label}
              type="button"
              onClick={() => ganti(mode)}
              className={`flex-1 rounded-full border-2 border-ink py-1.5 text-sm font-semibold transition ${
                daftar === mode ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={kirim} noValidate className="mt-5 space-y-5">
          {daftar && (
            <div>
              <label htmlFor="nama" className="text-sm font-semibold">Nama</label>
              <input
                id="nama"
                autoComplete="name"
                maxLength={50}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                aria-describedby="aturan-nama"
                placeholder="Nama kamu"
                className={isian}
              />
              <Aturan id="aturan-nama" terisi={nama.length > 0} daftar={aturanNama} />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={daftar ? "aturan-email" : undefined}
              placeholder="nama@email.com"
              className={isian}
            />
            {daftar && <Aturan id="aturan-email" terisi={email.length > 0} daftar={aturanEmail} />}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold">Kata sandi</label>
            <div className="flex gap-2">
              <input
                id="password"
                type={lihat ? "text" : "password"}
                autoComplete={daftar ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={daftar ? "aturan-password" : undefined}
                className={isian}
              />
              <button
                type="button"
                onClick={() => setLihat(!lihat)}
                aria-pressed={lihat}
                className="mt-1 shrink-0 rounded-xl border-2 border-ink bg-white px-3 text-sm font-semibold transition hover:bg-sun"
              >
                {lihat ? "Sembunyi" : "Lihat"}
              </button>
            </div>
            {daftar && <Aturan id="aturan-password" terisi={password.length > 0} daftar={aturanPassword} />}
          </div>

          {galat && (
            <p role="alert" className="rounded-lg border-2 border-ink bg-sun/30 px-3 py-2 text-sm font-semibold">
              {galat}
            </p>
          )}
          {info && (
            <p role="status" className="rounded-lg border-2 border-ink bg-mint/20 px-3 py-2 text-sm font-semibold">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={proses || (daftar && !semuaOk)}
            className="w-full rounded-xl border-2 border-ink bg-brand py-3 font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard"
          >
            {proses ? "Memproses..." : daftar ? "Daftar" : "Masuk"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink/60">
        Materi, video, dan kalkulator tetap bisa dipakai tanpa login.
      </p>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <FormLogin />
    </Suspense>
  );
}