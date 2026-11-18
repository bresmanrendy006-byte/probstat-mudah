"use client";

// src/components/Kuis.js
// Kuis pilihan ganda per materi. Bisa dikerjakan tanpa login.
// Jika sudah login: nilai disimpan ke skor_kuis, dan nilai >= 70 menandai materi selesai di progres.
// Jika sudah pernah mengerjakan: tampil ringkasan + tombol "Ulangi kuis" dulu.

import { useEffect, useState } from "react";
import Link from "next/link";
import Teks from "./Teks";
import { createClient } from "@/lib/supabase/client";

const NILAI_LULUS = 70;
const HURUF = ["A", "B", "C", "D"];

const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const TOMBOL_UTAMA =
  "rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 active:translate-y-0";
const TOMBOL_ULANG =
  "rounded-full border border-brand/20 bg-sun px-6 py-2.5 font-semibold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0";

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Kuis({ slug, soal }) {
  // "memuat" | "ringkasan" | "mengerjakan" | "hasil"
  const [mode, setMode] = useState("memuat");
  const [riwayat, setRiwayat] = useState(null); // { terakhir, tanggal, terbaik, jumlah }

  const [nomor, setNomor] = useState(0); // soal ke berapa (mulai dari 0)
  const [dipilih, setDipilih] = useState(null); // pilihan yang diklik (null = belum memilih)
  const [jumlahBenar, setJumlahBenar] = useState(0);
  const [nilai, setNilai] = useState(0);
  // "menyimpan" | "tersimpan" | "belum-login" | "gagal"
  const [statusSimpan, setStatusSimpan] = useState("menyimpan");

  const total = soal.length;
  const s = soal[nomor];
  const sudahMemilih = dipilih !== null;
  const soalTerakhir = nomor === total - 1;

  // Saat komponen muncul: cek apakah pengguna sudah login dan pernah mengerjakan kuis ini.
  useEffect(() => {
    let dibatalkan = false;

    async function cekRiwayat() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        const userId = data?.claims?.sub;
        if (!userId) {
          if (!dibatalkan) setMode("mengerjakan");
          return;
        }

        // Filter user_id WAJIB: admin boleh membaca skor semua pengguna,
        // jadi tanpa filter ini ringkasan admin akan tercampur data orang lain.
        const { data: baris, error } = await supabase
          .from("skor_kuis")
          .select("nilai, dibuat")
          .eq("user_id", userId)
          .eq("slug", slug)
          .order("dibuat", { ascending: false })
          .limit(50);
        if (error) throw error;

        if (dibatalkan) return;
        if (baris && baris.length > 0) {
          setRiwayat({
            terakhir: baris[0].nilai,
            tanggal: baris[0].dibuat,
            terbaik: Math.max(...baris.map((b) => b.nilai)),
            jumlah: baris.length,
          });
          setMode("ringkasan");
        } else {
          setMode("mengerjakan");
        }
      } catch (err) {
        console.error("Gagal membaca riwayat kuis:", err);
        if (!dibatalkan) setMode("mengerjakan");
      }
    }

    cekRiwayat();
    return () => {
      dibatalkan = true;
    };
  }, [slug]);

  function pilih(i) {
    if (sudahMemilih) return; // jawaban dikunci setelah dipilih
    setDipilih(i);
    if (i === s.benar) setJumlahBenar((n) => n + 1);
  }

  function lanjut() {
    if (!soalTerakhir) {
      setNomor((n) => n + 1);
      setDipilih(null);
    } else {
      selesaikan();
    }
  }

  async function selesaikan() {
    const hasil = Math.round((jumlahBenar / total) * 100);
    setNilai(hasil);
    setMode("hasil");
    setStatusSimpan("menyimpan");

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub;

      if (!userId) {
        setStatusSimpan("belum-login");
        return;
      }

      const { error: errSkor } = await supabase
        .from("skor_kuis")
        .insert({ user_id: userId, slug, nilai: hasil });
      if (errSkor) throw errSkor;

      if (hasil >= NILAI_LULUS) {
        const { error: errProgres } = await supabase
          .from("progres")
          .upsert(
            { user_id: userId, slug },
            { onConflict: "user_id,slug", ignoreDuplicates: true }
          );
        if (errProgres) throw errProgres;
      }

      setStatusSimpan("tersimpan");
    } catch (err) {
      console.error("Gagal menyimpan skor:", err);
      setStatusSimpan("gagal");
    }
  }

  // Mulai (atau mulai ulang) kuis dari soal pertama.
  function mulai() {
    setNomor(0);
    setDipilih(null);
    setJumlahBenar(0);
    setNilai(0);
    setStatusSimpan("menyimpan");
    setMode("mengerjakan");
  }

  // ===== Tampilan memuat =====
  if (mode === "memuat") {
    return (
      <div className={`${KARTU} p-6 text-center text-sm text-ink/70`} role="status">
        Memuat kuis...
      </div>
    );
  }

  // ===== Tampilan ringkasan (sudah pernah mengerjakan) =====
  if (mode === "ringkasan" && riwayat) {
    const lulus = riwayat.terbaik >= NILAI_LULUS;
    return (
      <div className={`${KARTU} p-6 text-center`}>
        <p className="text-sm font-bold uppercase tracking-wide text-brand">
          Kamu sudah mengerjakan kuis ini
        </p>
        <p className="mx-auto mt-3 grid size-28 place-items-center rounded-full bg-linear-to-br from-lavender to-peach/50 font-display text-5xl font-bold">
          {riwayat.terakhir}
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Nilai terakhir · {formatTanggal(riwayat.tanggal)}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          <span className="rounded-full bg-sun px-3 py-1 font-semibold">
            Terbaik: {riwayat.terbaik}
          </span>
          <span className="rounded-full bg-lavender px-3 py-1 font-semibold">
            {riwayat.jumlah}x percobaan
          </span>
        </div>

        <p className="mt-4 font-semibold">
          {lulus
            ? "Kamu sudah pernah lulus di bab ini."
            : `Belum pernah mencapai batas lulus (${NILAI_LULUS}). Yuk coba lagi!`}
        </p>

        <button type="button" onClick={mulai} className={`mt-5 ${TOMBOL_ULANG}`}>
          Ulangi kuis
        </button>
      </div>
    );
  }

  // ===== Tampilan hasil (baru selesai mengerjakan) =====
  if (mode === "hasil") {
    const lulus = nilai >= NILAI_LULUS;
    return (
      <div className={`${KARTU} p-6 text-center`}>
        <p className="text-sm font-bold uppercase tracking-wide text-brand">Hasil kuis</p>
        <p
          className={`mx-auto mt-3 grid size-28 place-items-center rounded-full font-display text-5xl font-bold ${
            lulus ? "bg-mint/40" : "bg-peach/50"
          }`}
        >
          {nilai}
        </p>
        <p className="mt-2 text-sm text-ink/70">
          {jumlahBenar} dari {total} soal benar
        </p>
        <p className="mt-3 font-semibold">
          {lulus
            ? "Mantap! Kamu sudah paham bab ini."
            : `Belum lulus (batas ${NILAI_LULUS}). Baca materinya lagi, lalu coba ulang ya!`}
        </p>

        <div
          aria-live="polite"
          className="mt-4 rounded-2xl bg-lavender/60 p-3 text-sm"
        >
          {statusSimpan === "menyimpan" && <p>Menyimpan skor...</p>}
          {statusSimpan === "tersimpan" && (
            <p>
              Skor tersimpan di akunmu.
              {lulus && " Materi ini ditandai selesai."}{" "}
              <Link href="/dashboard" className="font-bold text-brand underline">
                Lihat dashboard
              </Link>
            </p>
          )}
          {statusSimpan === "belum-login" && (
            <p>
              Skor ini belum tersimpan.{" "}
              <Link href="/login" className="font-bold text-brand underline">
                Masuk
              </Link>{" "}
              agar progres dan skormu tercatat.
            </p>
          )}
          {statusSimpan === "gagal" && (
            <p>Skor gagal disimpan. Periksa koneksi internetmu, lalu coba ulang kuisnya.</p>
          )}
        </div>

        <button type="button" onClick={mulai} className={`mt-5 ${TOMBOL_ULANG}`}>
          Ulangi kuis
        </button>
      </div>
    );
  }

  // ===== Tampilan soal =====
  // Bilah progres ikut maju begitu soal dijawab.
  const kemajuan = ((nomor + (sudahMemilih ? 1 : 0)) / total) * 100;

  return (
    <div className={`${KARTU} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold">
          Soal {nomor + 1} dari {total}
        </span>
        <div
          role="progressbar"
          aria-label="Kemajuan kuis"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(kemajuan)}
          className="h-2.5 w-32 overflow-hidden rounded-full bg-lavender"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-mint to-[#4fb8a3] transition-all motion-reduce:transition-none"
            style={{ width: `${kemajuan}%` }}
          />
        </div>
      </div>

      <p className="mt-5 text-lg font-semibold">
        <Teks>{s.pertanyaan}</Teks>
      </p>

      <div className="mt-4 space-y-3">
        {s.pilihan.map((p, i) => {
          let gaya = "border-brand/15 bg-white hover:-translate-y-0.5 hover:border-brand/40 hover:bg-lavender/50";
          let huruf = "bg-lavender";
          if (sudahMemilih) {
            if (i === s.benar) {
              gaya = "border-mint bg-mint/25";
              huruf = "bg-mint";
            } else if (i === dipilih) {
              gaya = "border-rose bg-rose/40";
              huruf = "bg-rose";
            } else {
              gaya = "border-brand/10 bg-white opacity-60";
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => pilih(i)}
              disabled={sudahMemilih}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition motion-reduce:transition-none ${gaya}`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${huruf}`}
              >
                {HURUF[i]}
              </span>
              <span className="min-w-0 overflow-x-auto overflow-y-hidden py-1">
                <Teks>{p}</Teks>
              </span>
            </button>
          );
        })}
      </div>

      {sudahMemilih && (
        <div
          aria-live="polite"
          className={`mt-4 rounded-2xl p-4 text-sm ${
            dipilih === s.benar ? "bg-mint/20" : "bg-rose/30"
          }`}
        >
          <p className="font-bold">
            {dipilih === s.benar
              ? "Benar! 🎉"
              : `Belum tepat. Jawaban yang benar: ${HURUF[s.benar]}.`}
          </p>
          <p className="mt-1 leading-relaxed">
            <Teks>{s.pembahasan}</Teks>
          </p>
        </div>
      )}

      {sudahMemilih && (
        <button type="button" onClick={lanjut} className={`mt-4 ${TOMBOL_UTAMA}`}>
          {soalTerakhir ? "Lihat hasil" : "Soal berikutnya →"}
        </button>
      )}
    </div>
  );
}