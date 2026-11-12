"use client";

import { useState } from "react";
import Link from "next/link";

const kartu = "bg-white border-2 border-ink rounded-xl shadow-hard";
const kotakDasar =
  "w-full rounded-xl border-2 bg-paper p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-sun";

// Warna border: merah kalau salah, hijau kalau benar, biasa kalau belum disentuh
function kelasKotak(salah, benar) {
  const warna = salah
    ? "border-red-600"
    : benar
      ? "border-mint"
      : "border-ink";
  return `${kotakDasar} ${warna}`;
}

// ---------- Validasi ----------

const POLA_NAMA = /^[\p{L}\s.'-]+$/u; // huruf (semua bahasa), spasi, titik, apostrof, strip
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cekForm({ nama, email, sandi, ulang, setuju }) {
  const galat = {};

  // Nama
  const namaRapi = nama.trim();
  if (!namaRapi) {
    galat.nama = "Nama wajib diisi.";
  } else if (!POLA_NAMA.test(namaRapi)) {
    galat.nama = "Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung.";
  } else if ((namaRapi.match(/\p{L}/gu) || []).length < 2) {
    galat.nama = "Nama minimal 2 huruf.";
  } else if (namaRapi.length > 50) {
    galat.nama = "Nama maksimal 50 karakter.";
  }

  // Email
  const emailRapi = email.trim();
  if (!emailRapi) {
    galat.email = "Email wajib diisi.";
  } else if (/\s/.test(emailRapi)) {
    galat.email = "Email tidak boleh mengandung spasi.";
  } else if (!emailRapi.includes("@")) {
    galat.email = "Email harus memakai tanda @. Contoh: nama@gmail.com";
  } else if (!POLA_EMAIL.test(emailRapi)) {
    galat.email = "Format email belum lengkap. Contoh: nama@gmail.com";
  }

  // Sandi
  if (!sandi) {
    galat.sandi = "Kata sandi wajib diisi.";
  } else if (sandi.length < 8) {
    galat.sandi = "Kata sandi minimal 8 karakter.";
  } else if (!/[A-Za-z]/.test(sandi) || !/\d/.test(sandi)) {
    galat.sandi = "Kata sandi harus berisi huruf dan angka.";
  } else if (sandi.length > 72) {
    galat.sandi = "Kata sandi maksimal 72 karakter.";
  }

  // Ulangi sandi
  if (!ulang) {
    galat.ulang = "Ulangi kata sandi di sini.";
  } else if (ulang !== sandi) {
    galat.ulang = "Kata sandi tidak sama.";
  }

  if (!setuju) galat.setuju = "Centang dulu untuk melanjutkan.";

  return galat;
}

// Syarat sandi untuk daftar centang
function syaratSandi(sandi) {
  return [
    { teks: "Minimal 8 karakter", ok: sandi.length >= 8 },
    { teks: "Ada huruf", ok: /[A-Za-z]/.test(sandi) },
    { teks: "Ada angka", ok: /\d/.test(sandi) },
  ];
}

// Kekuatan kata sandi: 0 sampai 4
function kekuatan(sandi) {
  let skor = 0;
  if (sandi.length >= 8) skor++;
  if (/[A-Za-z]/.test(sandi) && /\d/.test(sandi)) skor++;
  if (/[A-Z]/.test(sandi) && /[a-z]/.test(sandi)) skor++;
  if (/[^A-Za-z0-9]/.test(sandi) || sandi.length >= 12) skor++;
  return skor;
}

const labelKuat = ["", "Lemah", "Cukup", "Bagus", "Kuat"];
const warnaKuat = ["", "bg-red-500", "bg-sun", "bg-mint", "bg-mint"];

const URUTAN_KOLOM = ["nama", "email", "sandi", "ulang", "setuju"];

// ---------- TEMPAT SAMBUNGAN SUPABASE (nanti, Urutan 5) ----------
// Sekarang hanya pura-pura berhasil. Nanti isinya diganti dengan
// supabase.auth.signUp(...) dan mengembalikan { galat: "pesan" } jika gagal.
async function daftarAkun({ nama, email, sandi }) {
  await new Promise((selesai) => setTimeout(selesai, 800));
  return { berhasil: true };
}

// ---------- Komponen kecil untuk satu kolom isian ----------

function Kolom({ id, label, galat, benar, pesanBenar, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      <div aria-live="polite">
        {galat && (
          <p id={`${id}-galat`} className="mt-1 text-sm font-medium text-red-700">
            ✕ {galat}
          </p>
        )}
        {!galat && benar && pesanBenar && (
          <p className="mt-1 text-sm font-medium text-green-700">✓ {pesanBenar}</p>
        )}
      </div>
    </div>
  );
}

// ---------- Halaman ----------

export default function Daftar() {
  const [isi, setIsi] = useState({
    nama: "",
    email: "",
    sandi: "",
    ulang: "",
    setuju: false,
  });
  const [sentuh, setSentuh] = useState({}); // kolom mana yang sudah diketik/ditinggalkan
  const [lihat, setLihat] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [selesai, setSelesai] = useState(false);
  const [galatUmum, setGalatUmum] = useState("");

  // Validasi dihitung ulang di setiap ketikan
  const semuaGalat = cekForm(isi);
  const kuat = kekuatan(isi.sandi);

  // Galat hanya ditampilkan kalau kolomnya sudah disentuh
  const galat = {};
  const benar = {};
  for (const k of URUTAN_KOLOM) {
    if (sentuh[k]) {
      if (semuaGalat[k]) galat[k] = semuaGalat[k];
      else benar[k] = true;
    }
  }

  function ubah(e) {
    const { name, type, value, checked } = e.target;
    setIsi((lama) => ({ ...lama, [name]: type === "checkbox" ? checked : value }));
    setSentuh((lama) => ({ ...lama, [name]: true }));
  }

  function tinggalkan(e) {
    const { name } = e.target;
    setSentuh((lama) => ({ ...lama, [name]: true }));
  }

  async function kirim(e) {
    e.preventDefault();
    setGalatUmum("");

    // Tandai semua kolom supaya semua galat terlihat
    setSentuh({ nama: true, email: true, sandi: true, ulang: true, setuju: true });

    const kolomSalah = URUTAN_KOLOM.find((k) => semuaGalat[k]);
    if (kolomSalah) {
      document.getElementById(kolomSalah)?.focus();
      return;
    }

    setMengirim(true);
    const hasil = await daftarAkun(isi);
    setMengirim(false);

    if (hasil.galat) {
      setGalatUmum(hasil.galat);
      return;
    }
    setSelesai(true);
  }

  if (selesai) {
    return (
      <div className="mx-auto max-w-md">
        <section className={`${kartu} p-6 text-center`}>
          <p className="text-5xl" aria-hidden="true">🎉</p>
          <h1 className="mt-3 text-3xl font-bold">Pendaftaran berhasil</h1>
          <p className="mt-2 text-ink/70">
            Selamat datang, {isi.nama.trim()}! Akunmu sudah siap dipakai untuk
            menyimpan progres belajar.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl border-2 border-ink bg-brand px-5 py-2.5 font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Lanjut ke Login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-4xl font-bold">Daftar</h1>
      <p className="mt-1 text-ink/70">
        Buat akun untuk menyimpan progres. Materi, video, dan kalkulator tetap
        bisa dipakai tanpa akun.
      </p>

      <form onSubmit={kirim} noValidate className={`${kartu} mt-6 space-y-4 p-5`}>
        <Kolom id="nama" label="Nama" galat={galat.nama} benar={benar.nama} pesanBenar="Nama sudah benar.">
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="name"
            maxLength={60}
            value={isi.nama}
            onChange={ubah}
            onBlur={tinggalkan}
            placeholder="Nama kamu"
            aria-invalid={!!galat.nama}
            aria-describedby={galat.nama ? "nama-galat" : undefined}
            className={kelasKotak(galat.nama, benar.nama)}
          />
        </Kolom>

        <Kolom id="email" label="Email" galat={galat.email} benar={benar.email} pesanBenar="Format email benar.">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={isi.email}
            onChange={ubah}
            onBlur={tinggalkan}
            placeholder="nama@email.com"
            aria-invalid={!!galat.email}
            aria-describedby={galat.email ? "email-galat" : undefined}
            className={kelasKotak(galat.email, benar.email)}
          />
        </Kolom>

        <Kolom id="sandi" label="Kata sandi" galat={galat.sandi} benar={benar.sandi} pesanBenar="Kata sandi memenuhi syarat.">
          <div className="flex gap-2">
            <input
              id="sandi"
              name="sandi"
              type={lihat ? "text" : "password"}
              autoComplete="new-password"
              value={isi.sandi}
              onChange={ubah}
              onBlur={tinggalkan}
              placeholder="Minimal 8 karakter"
              aria-invalid={!!galat.sandi}
              aria-describedby={galat.sandi ? "sandi-galat" : undefined}
              className={kelasKotak(galat.sandi, benar.sandi)}
            />
            <button
              type="button"
              onClick={() => setLihat(!lihat)}
              className="shrink-0 rounded-xl border-2 border-ink bg-white px-3 text-sm font-semibold transition hover:bg-sun"
            >
              {lihat ? "Sembunyi" : "Lihat"}
            </button>
          </div>

          {/* Daftar syarat yang berubah secara langsung */}
          <ul className="mt-2 space-y-0.5 text-xs">
            {syaratSandi(isi.sandi).map((s) => (
              <li
                key={s.teks}
                className={s.ok ? "font-medium text-green-700" : "text-ink/60"}
              >
                {s.ok ? "✓" : "○"} {s.teks}
              </li>
            ))}
          </ul>

          {isi.sandi && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-2 flex-1 rounded-full border border-ink/30 ${
                      n <= kuat ? warnaKuat[kuat] : "bg-white"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink/60">
                Kekuatan: {labelKuat[kuat] || "Terlalu pendek"}
              </p>
            </div>
          )}
        </Kolom>

        <Kolom id="ulang" label="Ulangi kata sandi" galat={galat.ulang} benar={benar.ulang} pesanBenar="Kata sandi sama.">
          <input
            id="ulang"
            name="ulang"
            type={lihat ? "text" : "password"}
            autoComplete="new-password"
            value={isi.ulang}
            onChange={ubah}
            onBlur={tinggalkan}
            placeholder="Ketik ulang kata sandi"
            aria-invalid={!!galat.ulang}
            aria-describedby={galat.ulang ? "ulang-galat" : undefined}
            className={kelasKotak(galat.ulang, benar.ulang)}
          />
        </Kolom>

        <div>
          <label className="flex items-start gap-2 text-sm">
            <input
              id="setuju"
              type="checkbox"
              name="setuju"
              checked={isi.setuju}
              onChange={ubah}
              className="mt-0.5 h-4 w-4 accent-brand"
            />
            <span>Aku setuju data akun dipakai untuk menyimpan progres belajarku.</span>
          </label>
          {galat.setuju && (
            <p role="alert" className="mt-1 text-sm font-medium text-red-700">
              ✕ {galat.setuju}
            </p>
          )}
        </div>

        {galatUmum && (
          <p
            role="alert"
            className="rounded-lg border-2 border-red-600 bg-red-50 p-3 text-sm font-medium text-red-700"
          >
            {galatUmum}
          </p>
        )}

        <button
          type="submit"
          disabled={mengirim}
          className="w-full rounded-xl border-2 border-ink bg-brand px-5 py-2.5 font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mengirim ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/70">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-brand underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}