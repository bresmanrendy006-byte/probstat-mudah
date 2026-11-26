"use client";

// src/app/login/page.js
// Halaman Masuk / Daftar. Tersambung Supabase; pengalihan setelah masuk berdasarkan role.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const pesanGalat = {
  invalid_credentials: "Email atau kata sandi salah.",
  user_already_exists: "Email ini sudah terdaftar. Coba masuk.",
  email_exists: "Email ini sudah terdaftar. Coba masuk.",
  weak_password: "Kata sandi ditolak karena terlalu lemah. Coba yang lebih kuat.",
  email_not_confirmed: "Email belum dikonfirmasi. Cek kotak masuk emailmu.",
  over_email_send_rate_limit: "Terlalu banyak percobaan. Tunggu beberapa menit.",
  validation_failed: "Format email tidak valid.",
  email_address_invalid: "Alamat email ini ditolak. Periksa apakah emailnya benar dan aktif.",
};

const isian =
  "mt-1.5 w-full rounded-2xl border border-brand/20 bg-paper px-4 py-3 outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15";

// Daftar aturan di bawah kolom isian. Netral sebelum diisi, hijau jika terpenuhi, merah jika belum.
function Aturan({ id, terisi, daftar }) {
  return (
    <ul id={id} className="mt-2.5 space-y-1.5 text-xs">
      {daftar.map(([ok, teks]) => {
        const gaya = ok
          ? "font-semibold text-emerald-700"
          : terisi
            ? "text-red-700"
            : "text-ink/60";
        const bulat = ok
          ? "bg-mint text-ink"
          : terisi
            ? "bg-rose text-red-800"
            : "bg-lavender text-ink/50";
        const tanda = ok ? "✓" : terisi ? "✕" : "○";
        return (
          <li key={teks} className={`flex items-center gap-2 ${gaya}`}>
            <span
              aria-hidden="true"
              className={`grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${bulat}`}
            >
              {tanda}
            </span>
            <span>{teks}</span>
          </li>
        );
      })}
    </ul>
  );
}

// Bilah kekuatan kata sandi: 3 segmen, diisi sesuai jumlah aturan yang terpenuhi.
function BilahKekuatan({ jumlah }) {
  const warna = ["bg-rose", "bg-sun", "bg-mint"];
  const nama = ["Lemah", "Cukup", "Kuat"];
  return (
    <div className="mt-3" aria-hidden="true">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < jumlah ? warna[Math.max(jumlah - 1, 0)] : "bg-lavender"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs font-semibold text-ink/60">
        Kekuatan: {jumlah > 0 ? nama[jumlah - 1] : "-"}
      </p>
    </div>
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
  // Bila datang dari link konfirmasi yang gagal (/login?galat=konfirmasi), tampilkan pesannya.
  const [galat, setGalat] = useState(
    params.get("galat") === "konfirmasi"
      ? "Link konfirmasi tidak bisa dipakai di sini. Jika emailmu sudah dikonfirmasi, silakan masuk dengan email dan kata sandimu. Jika belum, coba daftar ulang."
      : ""
  );
  const [info, setInfo] = useState("");
  // True bila email yang dipakai mendaftar ternyata sudah terdaftar (tampilkan tombol Masuk).
  const [sudahAda, setSudahAda] = useState(false);
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
  const kekuatan = aturanPassword.filter(([ok]) => ok).length;

  function ganti(modeDaftar) {
    setDaftar(modeDaftar);
    setGalat("");
    setInfo("");
    setSudahAda(false);
  }

  async function kirim(e) {
    e.preventDefault();
    setGalat("");
    setInfo("");
    setSudahAda(false);

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
        options: {
          data: { nama: nama.trim() },
          // Tujuan setelah pengguna mengklik link di email.
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) {
        // Catat kode galatnya saja (tanpa data pribadi) untuk bahan diagnosis.
        console.warn("Galat daftar:", error.code, error.status);
        setGalat(
          pesanGalat[error.code] ??
            "Pendaftaran gagal. Periksa apakah emailnya benar dan aktif, lalu coba lagi."
        );
      } else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        // Supabase tidak membuat akun baru dan tidak mengirim email: emailnya sudah terdaftar.
        setGalat("Email ini sudah terdaftar. Silakan masuk dengan email dan kata sandimu.");
        setSudahAda(true);
      } else if (data.session) {
        // Pendaftar baru selalu "pelajar".
        router.push("/dashboard");
        router.refresh();
      } else {
        setInfo(
          "Pendaftaran berhasil. Cek emailmu (termasuk folder spam) dan klik link konfirmasi, lalu masuk."
        );
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        console.warn("Galat masuk:", error.code, error.status);
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
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-linear-to-br from-brand to-[#9b8cf0] text-xl font-bold text-white shadow-md"
        >
          σ
        </span>
        <h1 className="mt-4 text-3xl font-bold">{daftar ? "Daftar" : "Masuk"}</h1>
        <p className="mt-1 text-sm text-ink/70">
          {daftar
            ? "Buat akun untuk menyimpan progres belajarmu."
            : "Masuk untuk melihat progres belajarmu."}
        </p>

        {/* Pilihan Masuk / Daftar */}
        <div className="mt-5 flex gap-1 rounded-full bg-lavender p-1">
          {[
            ["Masuk", false],
            ["Daftar", true],
          ].map(([label, mode]) => (
            <button
              key={label}
              type="button"
              onClick={() => ganti(mode)}
              aria-pressed={daftar === mode}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                daftar === mode ? "bg-white shadow-sm" : "text-ink/60 hover:text-ink"
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
                className="mt-1.5 shrink-0 rounded-2xl border border-brand/20 bg-white px-4 text-sm font-semibold transition hover:bg-sun/50"
              >
                {lihat ? "Sembunyi" : "Lihat"}
              </button>
            </div>
            {daftar && password.length > 0 && <BilahKekuatan jumlah={kekuatan} />}
            {daftar && (
              <Aturan id="aturan-password" terisi={password.length > 0} daftar={aturanPassword} />
            )}
          </div>

          {!daftar && (
            <p className="-mt-2 text-right text-sm">
              <Link
                href="/lupa-sandi"
                className="font-semibold text-brand underline underline-offset-2"
              >
                Lupa kata sandi?
              </Link>
            </p>
          )}

          {galat && (
            <div role="alert" className="rounded-2xl bg-rose/40 px-4 py-3 text-sm font-semibold">
              <p>{galat}</p>
              {sudahAda && (
                <button
                  type="button"
                  onClick={() => ganti(false)}
                  className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-sun"
                >
                  Masuk dengan email ini
                </button>
              )}
            </div>
          )}
          {info && (
            <p role="status" className="rounded-2xl bg-mint/30 px-4 py-3 text-sm font-semibold">
              {info}
            </p>
          )}

          {daftar && (
            <p className="text-xs leading-relaxed text-ink/60">
              Dengan mendaftar, kamu menyetujui{" "}
              <Link
                href="/syarat"
                target="_blank"
                className="font-semibold text-brand underline underline-offset-2"
              >
                Syarat Layanan
              </Link>{" "}
              dan{" "}
              <Link
                href="/privasi"
                target="_blank"
                className="font-semibold text-brand underline underline-offset-2"
              >
                Kebijakan Privasi
              </Link>
              .
            </p>
          )}

          <button
            type="submit"
            disabled={proses || (daftar && !semuaOk)}
            className="w-full rounded-full bg-linear-to-r from-brand to-[#8b7ee8] py-3 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
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