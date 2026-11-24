"use client";

// src/components/BankSoal.js
// Latihan soal bebas: filter per kategori/materi, jawab, lihat pembahasan.
// Tanpa login tetap bisa dipakai. Bila login, tiap jawaban dicatat ke jawaban_soal
// (tidak memengaruhi skor_kuis).

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Teks from "./Teks";
import { createClient } from "@/lib/supabase/client";

const HURUF = ["A", "B", "C", "D"];
const PER_HALAMAN = 10;
const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const CHIP = "rounded-full px-4 py-1.5 text-sm font-semibold transition";
const CHIP_AKTIF = `${CHIP} bg-brand text-white shadow-sm`;
const CHIP_BIASA = `${CHIP} border border-brand/20 bg-white hover:bg-sun/50`;

export default function BankSoal({ daftar, soal }) {
  const [kategori, setKategori] = useState("semua");
  const [slug, setSlug] = useState("semua");
  const [jawaban, setJawaban] = useState({}); // { idSoal: nomorPilihan }
  const [tampil, setTampil] = useState(PER_HALAMAN);
  const [userId, setUserId] = useState(undefined); // undefined = memeriksa, null = belum login
  const [gagalSimpan, setGagalSimpan] = useState(false);
  const sudahDicatat = useRef(new Set()); // mencegah catatan ganda bila klik cepat

  useEffect(() => {
    let batal = false;
    async function cek() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        if (!batal) setUserId(data?.claims?.sub ?? null);
      } catch {
        if (!batal) setUserId(null);
      }
    }
    cek();
    return () => {
      batal = true;
    };
  }, []);

  const chipMateri = useMemo(
    () =>
      daftar
        .filter((k) => kategori === "semua" || k.kategori === kategori)
        .flatMap((k) => k.materi),
    [daftar, kategori]
  );
  const judulDari = (s) => daftar.flatMap((k) => k.materi).find((m) => m.slug === s)?.judul ?? s;

  const terfilter = useMemo(() => {
    if (slug !== "semua") return soal.filter((s) => s.slug === slug);
    const slugKategori = new Set(chipMateri.map((m) => m.slug));
    return soal.filter((s) => slugKategori.has(s.slug));
  }, [soal, slug, chipMateri]);

  const terjawab = terfilter.filter((s) => jawaban[s.id] !== undefined).length;
  const benar = terfilter.filter((s) => jawaban[s.id] === s.benar).length;

  function pilihKategori(k) {
    setKategori(k);
    setSlug("semua");
    setTampil(PER_HALAMAN);
  }

  function pilihSlug(s) {
    setSlug(s);
    setTampil(PER_HALAMAN);
  }

  async function jawab(s, i) {
    if (sudahDicatat.current.has(s.id)) return;
    sudahDicatat.current.add(s.id);
    setJawaban((j) => ({ ...j, [s.id]: i }));
    if (!userId) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("jawaban_soal")
        .insert({ user_id: userId, soal_id: s.id, slug: s.slug, benar: i === s.benar });
      if (error) throw error;
    } catch (err) {
      console.error("Gagal mencatat jawaban bank soal:", err);
      setGagalSimpan(true);
    }
  }

  function ulangi() {
    setJawaban((j) => {
      const baru = { ...j };
      for (const s of terfilter) {
        delete baru[s.id];
        sudahDicatat.current.delete(s.id);
      }
      return baru;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Latihan</p>
        <h1 className="mt-1 text-4xl font-bold">Bank Soal</h1>
        <p className="mt-1 text-ink/70">
          Pilih materi, jawab soalnya, dan baca pembahasan langsung.
        </p>
      </div>

      {/* Filter */}
      <section className={`${KARTU} space-y-4 p-5`} aria-label="Filter soal">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => pilihKategori("semua")}
            className={kategori === "semua" ? CHIP_AKTIF : CHIP_BIASA}
          >
            Semua kategori
          </button>
          {daftar.map((k) => (
            <button
              key={k.kategori}
              type="button"
              onClick={() => pilihKategori(k.kategori)}
              className={kategori === k.kategori ? CHIP_AKTIF : CHIP_BIASA}
            >
              {k.kategori}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => pilihSlug("semua")}
            className={slug === "semua" ? CHIP_AKTIF : "rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"}
          >
            Semua materi
          </button>
          {chipMateri.map((m) => (
            <button
              key={m.slug}
              type="button"
              onClick={() => pilihSlug(m.slug)}
              className={slug === m.slug ? CHIP_AKTIF : "rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"}
            >
              {m.judul}
            </button>
          ))}
        </div>
      </section>

      {/* Status login + ringkasan */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="rounded-full bg-sun px-4 py-1.5 font-semibold">
          {terfilter.length} soal · Terjawab {terjawab} · Benar {benar}
        </p>
        <div className="flex items-center gap-3">
          {terjawab > 0 && (
            <button
              type="button"
              onClick={ulangi}
              className="rounded-full border border-brand/20 bg-white px-4 py-1.5 font-semibold transition hover:bg-sun/50"
            >
              Ulangi soal ini
            </button>
          )}
        </div>
      </div>

      {userId === null && (
        <p className="rounded-2xl bg-lavender/60 p-3 text-sm">
          Jawabanmu belum tercatat.{" "}
          <Link href="/login" className="font-bold text-brand underline">
            Masuk
          </Link>{" "}
          agar soal yang sering salah muncul di dashboard.
        </p>
      )}
      {gagalSimpan && (
        <p role="alert" className="rounded-2xl bg-rose/40 p-3 text-sm font-semibold">
          Sebagian jawaban gagal dicatat. Latihan tetap bisa dilanjutkan.
        </p>
      )}

      {/* Daftar soal */}
      <ul className="space-y-5">
        {terfilter.slice(0, tampil).map((s, n) => {
          const dipilih = jawaban[s.id];
          const sudah = dipilih !== undefined;
          return (
            <li key={s.id} className={`${KARTU} p-5 sm:p-6`}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-sun px-3 py-1 font-bold">No. {n + 1}</span>
                <span className="rounded-full bg-lavender px-3 py-1 font-semibold">
                  {judulDari(s.slug)}
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold">
                <Teks>{s.pertanyaan}</Teks>
              </p>
              <div className="mt-4 space-y-3">
                {s.pilihan.map((p, i) => {
                  let gaya =
                    "border-brand/15 bg-white hover:-translate-y-0.5 hover:border-brand/40 hover:bg-lavender/50";
                  let huruf = "bg-lavender";
                  if (sudah) {
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
                      onClick={() => jawab(s, i)}
                      disabled={sudah}
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
              {sudah && (
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
            </li>
          );
        })}
      </ul>

      {terfilter.length > tampil && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setTampil((t) => t + PER_HALAMAN)}
            className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5"
          >
            Tampilkan lebih banyak ({terfilter.length - tampil} lagi)
          </button>
        </div>
      )}

      {terfilter.length === 0 && (
        <p className="rounded-2xl border border-dashed border-brand/25 p-5 text-center text-sm text-ink/70">
          Belum ada soal untuk pilihan ini.
        </p>
      )}
    </div>
  );
}