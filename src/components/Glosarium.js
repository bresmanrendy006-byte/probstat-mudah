"use client";

// src/components/Glosarium.js
// Daftar istilah dengan pencarian dan filter kategori. Tanpa login.

import { useMemo, useState } from "react";
import Link from "next/link";
import Teks from "./Teks";

const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const CHIP = "rounded-full px-4 py-1.5 text-sm font-semibold transition";
const CHIP_AKTIF = `${CHIP} bg-brand text-white shadow-sm`;
const CHIP_BIASA = `${CHIP} border border-brand/20 bg-white hover:bg-sun/50`;

export default function Glosarium({ istilah, judul, kategori }) {
  const [cari, setCari] = useState("");
  const [kat, setKat] = useState("semua");

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return istilah.filter(
      (i) =>
        (kat === "semua" || i.kategori === kat) &&
        (!q || i.istilah.toLowerCase().includes(q) || i.arti.toLowerCase().includes(q))
    );
  }, [istilah, cari, kat]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Kamus mini</p>
        <h1 className="mt-1 text-4xl font-bold">Glosarium</h1>
        <p className="mt-1 text-ink/70">Arti singkat istilah peluang dan statistika.</p>
      </div>

      <section className={`${KARTU} space-y-4 p-5`} aria-label="Cari istilah">
        <div>
          <label htmlFor="cari-istilah" className="block text-sm font-bold">
            Cari istilah
          </label>
          <input
            id="cari-istilah"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Contoh: p-value, median, power"
            className="mt-2 w-full rounded-2xl border border-brand/20 bg-paper px-4 py-3 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setKat("semua")}
            className={kat === "semua" ? CHIP_AKTIF : CHIP_BIASA}
          >
            Semua
          </button>
          {kategori.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKat(k)}
              className={kat === k ? CHIP_AKTIF : CHIP_BIASA}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      <p role="status" className="text-sm font-semibold text-ink/70">
        {tampil.length} istilah
      </p>

      {tampil.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand/25 p-5 text-center text-sm text-ink/70">
          Tidak ada istilah yang cocok. Coba kata lain.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {tampil.map((i) => (
            <li key={i.istilah} className={`${KARTU} min-w-0 p-5`}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="min-w-0 text-lg font-bold">
                  <Teks>{i.istilah}</Teks>
                </h2>
                <span className="rounded-full bg-lavender px-2.5 py-0.5 text-xs font-bold">
                  {i.kategori}
                </span>
              </div>
              <div className="mt-2 overflow-x-auto overflow-y-hidden py-1 text-sm leading-relaxed text-ink/80">
                <Teks>{i.arti}</Teks>
              </div>
              {i.slug && judul[i.slug] && (
                <Link
                  href={`/materi/${i.slug}`}
                  className="mt-3 inline-block rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold transition hover:bg-sun"
                >
                  Baca materi: {judul[i.slug]}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}