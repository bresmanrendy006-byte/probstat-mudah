"use client";

// src/components/AksiMateri.js
// Kartu aksi di halaman materi: "Tandai selesai" (tabel progres) dan "Simpan" (tabel bookmark).
// Hanya aktif jika sudah login. Jika belum, tampil ajakan masuk/daftar.

import { useEffect, useState } from "react";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/client";

// ===== Ikon kecil (SVG) =====
function IkonCentang({ className = "size-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </svg>
  );
}

function IkonBookmark({ terisi = false, className = "size-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={terisi ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

const KARTU = "mt-5 rounded-3xl border border-brand/10 bg-white p-4 shadow-hard";

// Gaya dasar tombol (dipakai dua tombol di kartu "siap"). Tinggi tetap 44px (h-11).
const GAYA_TOMBOL =
  "flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto";

export default function AksiMateri({ slug }) {
  // "memuat" | "belum-login" | "galat" | "siap"
  const [status, setStatus] = useState("memuat");
  const [userId, setUserId] = useState(null);
  const [selesai, setSelesai] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);
  const [sibuk, setSibuk] = useState(false); // sedang menulis ke database
  const [galat, setGalat] = useState("");

  // Saat muncul: cek login, lalu baca status awal dari tabel progres dan bookmark.
  useEffect(() => {
    let dibatalkan = false;

    async function muat() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        const id = data?.claims?.sub;
        if (!id) {
          if (!dibatalkan) setStatus("belum-login");
          return;
        }

        // Filter user_id wajib: admin boleh membaca data semua pengguna,
        // jadi tanpa filter ini hasilnya bisa tercampur.
        const [resProgres, resBookmark] = await Promise.all([
          supabase
            .from("progres")
            .select("slug")
            .eq("user_id", id)
            .eq("slug", slug)
            .maybeSingle(),
          supabase
            .from("bookmark")
            .select("slug")
            .eq("user_id", id)
            .eq("slug", slug)
            .maybeSingle(),
        ]);
        if (resProgres.error) throw resProgres.error;
        if (resBookmark.error) throw resBookmark.error;

        if (dibatalkan) return;
        setUserId(id);
        setSelesai(!!resProgres.data);
        setTersimpan(!!resBookmark.data);
        setStatus("siap");
      } catch (err) {
        console.error("Gagal membaca status materi:", err);
        if (!dibatalkan) setStatus("galat");
      }
    }

    muat();
    return () => {
      dibatalkan = true;
    };
  }, [slug]);

  // Tandai selesai / batalkan tanda selesai.
  async function ubahSelesai() {
    if (sibuk || !userId) return;
    setSibuk(true);
    setGalat("");
    try {
      const supabase = createClient();
      if (selesai) {
        const { error } = await supabase
          .from("progres")
          .delete()
          .eq("user_id", userId)
          .eq("slug", slug);
        if (error) throw error;
        setSelesai(false);
      } else {
        const { error } = await supabase
          .from("progres")
          .upsert(
            { user_id: userId, slug },
            { onConflict: "user_id,slug", ignoreDuplicates: true }
          );
        if (error) throw error;
        setSelesai(true);
      }
    } catch (err) {
      console.error("Gagal mengubah progres:", err);
      setGalat("Gagal menyimpan. Periksa koneksi internetmu, lalu coba lagi.");
    } finally {
      setSibuk(false);
    }
  }

  // Simpan / hapus bookmark.
  async function ubahBookmark() {
    if (sibuk || !userId) return;
    setSibuk(true);
    setGalat("");
    try {
      const supabase = createClient();
      if (tersimpan) {
        const { error } = await supabase
          .from("bookmark")
          .delete()
          .eq("user_id", userId)
          .eq("slug", slug);
        if (error) throw error;
        setTersimpan(false);
      } else {
        const { error } = await supabase
          .from("bookmark")
          .upsert(
            { user_id: userId, slug },
            { onConflict: "user_id,slug", ignoreDuplicates: true }
          );
        if (error) throw error;
        setTersimpan(true);
      }
    } catch (err) {
      console.error("Gagal mengubah bookmark:", err);
      setGalat("Gagal menyimpan. Periksa koneksi internetmu, lalu coba lagi.");
    } finally {
      setSibuk(false);
    }
  }

  // ===== Memuat: kerangka seukuran kartu "siap" supaya tata letak tidak melompat =====
  // Tinggi: HP = 188px, layar >= 640px = 112px (harus sama dengan materi/[slug]/loading.js).
  if (status === "memuat") {
    return <Skeleton className="mt-5 h-[188px] w-full rounded-3xl sm:h-[112px]" />;
  }

  // ===== Belum login: ajakan masuk / daftar =====
  if (status === "belum-login") {
    return (
      <div className={`${KARTU} flex flex-col gap-4 sm:flex-row sm:items-center`}>
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-sun"
        >
          <IkonBookmark terisi className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">Simpan progres belajarmu</p>
          <p className="mt-1 text-sm text-ink/70">
            Masuk untuk menandai materi selesai dan menyimpannya ke daftar tersimpan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/login"
            className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Masuk
          </Link>
          <Link
            href="/login?mode=daftar"
            className="rounded-full border border-brand/20 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-sun/50"
          >
            Daftar gratis
          </Link>
        </div>
      </div>
    );
  }

  // ===== Galat saat membaca status =====
  if (status === "galat") {
    return (
      <div
        role="alert"
        className="mt-5 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-4 shadow-hard"
      >
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-red-500 font-bold text-white"
        >
          !
        </span>
        <div className="min-w-0">
          <p className="font-bold">Status tombol gagal dimuat</p>
          <p className="mt-0.5 text-sm text-ink/70">
            Periksa koneksi internetmu, lalu muat ulang halaman (F5).
          </p>
        </div>
      </div>
    );
  }

  // ===== Siap: dua tombol + teks status =====
  let teksStatus = "Selesai membaca? Tandai supaya progresmu tercatat di dashboard.";
  if (sibuk) teksStatus = "Menyimpan...";
  else if (selesai) teksStatus = "Hebat, materi ini sudah selesai! Klik tombol hijau lagi untuk membatalkan.";

  return (
    <div className={KARTU}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={ubahSelesai}
          disabled={sibuk}
          aria-pressed={selesai}
          className={`${GAYA_TOMBOL} ${
            selesai
              ? "bg-mint text-ink"
              : "bg-linear-to-r from-brand to-[#8b7ee8] text-white"
          }`}
        >
          <IkonCentang />
          {selesai ? "Sudah selesai" : "Tandai selesai"}
        </button>

        <button
          type="button"
          onClick={ubahBookmark}
          disabled={sibuk}
          aria-pressed={tersimpan}
          className={`${GAYA_TOMBOL} ${
            tersimpan ? "bg-sun" : "border border-brand/20 bg-white hover:bg-sun/50"
          }`}
        >
          <IkonBookmark terisi={tersimpan} />
          {tersimpan ? "Tersimpan" : "Simpan"}
        </button>
      </div>

      {/* min-h dipasang agar tinggi kartu tetap, dua baris di HP dan satu baris di layar lebar */}
      <p aria-live="polite" className="mt-3 min-h-10 text-sm leading-5 text-ink/70 sm:min-h-5">
        {teksStatus}
      </p>
      {galat && (
        <p role="alert" className="mt-1 text-sm font-semibold text-red-700">
          {galat}
        </p>
      )}
    </div>
  );
}