"use client";

// src/components/Simulasi.js
// Simulasi koin dan kartu. Tanpa login, tanpa database.
// Koin: lempar 1/10/100 kali, bandingkan dengan peluang teoritis 50%.
// Kartu: tarik dari 52 kartu, dengan atau tanpa pengembalian, hitung As.

import { useState } from "react";
import Teks from "./Teks";
import DaduMain from "./DaduMain";

const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const CHIP = "rounded-full px-4 py-1.5 text-sm font-semibold transition";
const CHIP_AKTIF = `${CHIP} bg-brand text-white shadow-sm`;
const CHIP_BIASA = `${CHIP} border border-brand/20 bg-white hover:bg-sun/50`;
const TOMBOL =
  "rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const TOMBOL_ULANG =
  "rounded-full border border-brand/20 bg-white px-5 py-2.5 font-semibold transition hover:bg-sun/50 disabled:cursor-not-allowed disabled:opacity-40";

const PERSEN = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

// ===== Koin =====
function Koin() {
  const [angka, setAngka] = useState(0);
  const [gambar, setGambar] = useState(0);
  const [terakhir, setTerakhir] = useState(null); // "A" | "G"

  const total = angka + gambar;
  const pa = total ? (angka / total) * 100 : 0;
  const pg = total ? (gambar / total) * 100 : 0;

  function lempar(n) {
    let a = 0;
    let g = 0;
    let akhir = null;
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.5) {
        a += 1;
        akhir = "A";
      } else {
        g += 1;
        akhir = "G";
      }
    }
    setAngka((x) => x + a);
    setGambar((x) => x + g);
    setTerakhir(akhir);
  }

  function ulang() {
    setAngka(0);
    setGambar(0);
    setTerakhir(null);
  }

  return (
    <section className={`${KARTU} p-5 sm:p-6`}>
      <h2 className="text-2xl font-bold">Koin</h2>
      <p className="mt-1 text-sm text-ink/70">
        Peluang teoritis tiap sisi: <Teks>{String.raw`$\dfrac{1}{2}$`}</Teks>. Lempar makin banyak
        dan lihat hasilnya mendekati 50%.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => lempar(1)} className={TOMBOL}>
          Lempar 1x
        </button>
        <button type="button" onClick={() => lempar(10)} className={TOMBOL_ULANG}>
          10x
        </button>
        <button type="button" onClick={() => lempar(100)} className={TOMBOL_ULANG}>
          100x
        </button>
        <button type="button" onClick={ulang} disabled={total === 0} className={TOMBOL_ULANG}>
          Ulang
        </button>
      </div>

      <p aria-live="polite" className="mt-4 text-sm font-semibold">
        {total === 0
          ? "Belum ada lemparan."
          : `Total ${total} lemparan.${
              total === 1 || terakhir === null
                ? ""
                : ""
            } Lemparan terakhir: ${terakhir === "A" ? "Angka" : "Gambar"}.`}
      </p>

      <div className="mt-3 space-y-3">
        {[
          { nama: "Angka", n: angka, p: pa, warna: "bg-linear-to-r from-brand to-[#9b8cf0]" },
          { nama: "Gambar", n: gambar, p: pg, warna: "bg-linear-to-r from-mint to-[#4fb8a3]" },
        ].map((b) => (
          <div key={b.nama}>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{b.nama}</span>
              <span>
                {b.n} ({PERSEN.format(b.p)}%)
              </span>
            </div>
            <div className="relative mt-1 h-4 overflow-hidden rounded-full bg-lavender">
              <div className={`h-full rounded-full ${b.warna}`} style={{ width: `${b.p}%` }} />
              {/* garis penanda 50% */}
              <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-0.5 bg-ink/40" />
            </div>
          </div>
        ))}
        <p className="text-xs text-ink/60">Garis di tengah menandai 50%, yaitu peluang teoritis.</p>
      </div>
    </section>
  );
}

// ===== Kartu =====
const BENTUK = [
  { kode: "♠", warna: "text-ink" },
  { kode: "♥", warna: "text-red-500" },
  { kode: "♦", warna: "text-red-500" },
  { kode: "♣", warna: "text-ink" },
];
const NILAI = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function buatDek() {
  return BENTUK.flatMap((b) => NILAI.map((n) => ({ n, ...b })));
}

function Kartu() {
  const [dek, setDek] = useState(buatDek);
  const [ditarik, setDitarik] = useState([]); // terbaru di depan
  const [denganKembali, setDenganKembali] = useState(false);

  const jumlahAs = ditarik.filter((k) => k.n === "A").length;
  const habis = !denganKembali && dek.length === 0;

  function tarik() {
    if (habis) return;
    if (denganKembali) {
      const k = buatDek()[Math.floor(Math.random() * 52)];
      setDitarik((d) => [k, ...d]);
    } else {
      const i = Math.floor(Math.random() * dek.length);
      const k = dek[i];
      setDek((d) => d.filter((_, j) => j !== i));
      setDitarik((d) => [k, ...d]);
    }
  }

  function kocokUlang() {
    setDek(buatDek());
    setDitarik([]);
  }

  function ubahMode(nilai) {
    setDenganKembali(nilai);
    kocokUlang();
  }

  const sisaAs = denganKembali ? 4 : dek.filter((k) => k.n === "A").length;
  const sisaTotal = denganKembali ? 52 : dek.length;

  return (
    <section className={`${KARTU} p-5 sm:p-6`}>
      <h2 className="text-2xl font-bold">Kartu</h2>
      <p className="mt-1 text-sm text-ink/70">
        Satu set 52 kartu berisi 4 As. Tarik kartu dan lihat berapa kali As muncul.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Cara menarik kartu">
        <button
          type="button"
          aria-pressed={!denganKembali}
          onClick={() => ubahMode(false)}
          className={!denganKembali ? CHIP_AKTIF : CHIP_BIASA}
        >
          Tanpa pengembalian
        </button>
        <button
          type="button"
          aria-pressed={denganKembali}
          onClick={() => ubahMode(true)}
          className={denganKembali ? CHIP_AKTIF : CHIP_BIASA}
        >
          Dengan pengembalian
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={tarik} disabled={habis} className={TOMBOL}>
          Tarik kartu
        </button>
        <button type="button" onClick={kocokUlang} disabled={ditarik.length === 0} className={TOMBOL_ULANG}>
          Kocok ulang
        </button>
      </div>

      <p aria-live="polite" className="mt-4 text-sm font-semibold">
        {habis
          ? "Semua kartu sudah ditarik. Kocok ulang untuk mulai lagi."
          : ditarik.length === 0
            ? "Belum ada kartu yang ditarik."
            : `Ditarik ${ditarik.length} kartu, As muncul ${jumlahAs} kali.`}
      </p>
      <p className="mt-1 text-xs text-ink/70">
        Peluang kartu berikutnya As: {sisaAs}/{sisaTotal}
        {sisaTotal > 0 ? ` (${PERSEN.format((sisaAs / sisaTotal) * 100)}%)` : ""}.
        {!denganKembali && " Nilainya berubah karena kartu yang sudah ditarik tidak dikembalikan."}
      </p>

      {ditarik.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ditarik.slice(0, 12).map((k, i) => (
            <span
              key={`${k.n}${k.kode}${i}`}
              className={`grid h-16 w-12 place-items-center rounded-xl border bg-white text-center font-display font-bold shadow-sm ${
                i === 0 ? "border-brand" : "border-brand/15"
              } ${k.warna}`}
            >
              <span className="block leading-tight">
                {k.n}
                <span className="block text-lg">{k.kode}</span>
              </span>
            </span>
          ))}
        </div>
      )}
      {ditarik.length > 12 && (
        <p className="mt-2 text-xs text-ink/60">Menampilkan 12 kartu terakhir.</p>
      )}
    </section>
  );
}

export default function Simulasi() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Eksperimen</p>
        <h1 className="mt-1 text-4xl font-bold">Simulasi Peluang</h1>
        <p className="mt-1 text-ink/70">
          Coba sendiri percobaan acak dan bandingkan dengan peluang teorinya.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Koin />
        <Kartu />
      </div>

      <section className={`${KARTU} mx-auto max-w-sm p-6`}>
        <h2 className="mb-4 text-center text-2xl font-bold">Dadu</h2>
        <DaduMain />
      </section>
    </div>
  );
}