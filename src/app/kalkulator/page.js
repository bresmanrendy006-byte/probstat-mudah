"use client";

// src/app/kalkulator/page.js
// Kalkulator 8 mode: Dasar, Peluang, Statistika, Binomial, Poisson, Normal, Uji t, Korelasi.
// Hasil ringkas + langkah penyelesaian + grafik + keterangan otomatis.
// Di layar sempit, setelah menghitung layar digulir ke kartu Hasil.

import { useEffect, useRef, useState } from "react";
import { prosesDasar, prosesPeluang, prosesStatistika } from "@/lib/proses";
import { prosesBinomial, prosesPoisson, prosesNormal } from "@/lib/distribusi";
import { prosesUjiT } from "@/lib/uji";
import { prosesKorelasi } from "@/lib/regresi";
import { keteranganStatistika } from "@/lib/keterangan";
import Teks from "@/components/Teks";
import GrafikStatistik from "@/components/GrafikStatistik";
import GrafikDistribusi from "@/components/GrafikDistribusi";
import GrafikT from "@/components/GrafikT";
import GrafikScatter from "@/components/GrafikScatter";

const mode = [
  {
    nama: "Dasar",
    hint: "Contoh: (12 + 8) * 3 / 4",
    contoh: "Ketik ekspresi, misalnya 2^5 + sqrt(49)",
    isiContoh: "(12 + 8) * 3 / 4",
    chip: ["(12 + 8) * 3 / 4", "2^5 + sqrt(49)"],
    proses: prosesDasar,
  },
  {
    nama: "Peluang",
    hint: "Contoh: n = 10, r = 3",
    contoh: "Faktorial, permutasi, dan kombinasi",
    isiContoh: "n = 10, r = 3",
    chip: ["n = 10, r = 3", "n = 5, r = 2", "n = 8, r = 4"],
    proses: prosesPeluang,
  },
  {
    nama: "Statistika",
    hint: "Contoh: 70, 85, 90, 65, 85, 100, 78",
    contoh: "Mean, median, modus, varians, simpangan baku, kuartil, grafik",
    isiContoh: "70, 85, 90, 65, 85, 100, 78",
    chip: ["70, 85, 90, 65, 85, 100, 78", "2, 4, 4, 4, 5, 5, 7, 9", "10, 12, 13, 14, 15, 16, 60"],
    proses: prosesStatistika,
  },
  {
    nama: "Binomial",
    hint: "Contoh: n = 10, p = 0.5, k = 3",
    contoh: "n percobaan, peluang sukses p, dan k sukses. Desimal pakai titik (0.5).",
    isiContoh: "n = 10, p = 0.5, k = 3",
    chip: ["n = 10, p = 0.5, k = 3", "n = 20, p = 0.3, k = 6"],
    proses: prosesBinomial,
  },
  {
    nama: "Poisson",
    hint: "Contoh: lambda = 4, k = 2",
    contoh: "Rata-rata kejadian (lambda) dan banyak kejadian k",
    isiContoh: "lambda = 4, k = 2",
    chip: ["lambda = 4, k = 2", "lambda = 3, k = 5"],
    proses: prosesPoisson,
  },
  {
    nama: "Normal",
    hint: "Contoh: mu = 70, sigma = 10, x = 85",
    contoh: "Isi mu dan sigma, lalu x (satu batas) atau a dan b (dua batas)",
    isiContoh: "mu = 70, sigma = 10, x = 85",
    chip: [
      "mu = 70, sigma = 10, x = 85",
      "mu = 100, sigma = 15, a = 85, b = 115",
      "mu = 0, sigma = 1, x = 1.96",
    ],
    proses: prosesNormal,
  },
  {
    nama: "Uji t",
    uji: true,
    contoh: "Bandingkan rata-rata: satu sampel, dua sampel bebas, atau berpasangan (dua arah).",
  },
  {
    nama: "Korelasi",
    kor: true,
    contoh: "Hubungan dua variabel: korelasi r, uji signifikansi, dan garis regresi linear.",
  },
];

// Pengaturan khusus mode Uji t
const jenisUji = [
  { kode: "satu", nama: "Satu sampel", labelA: "Data sampel", labelB: "" },
  { kode: "bebas", nama: "Dua sampel bebas", labelA: "Kelompok A", labelB: "Kelompok B" },
  { kode: "pasangan", nama: "Berpasangan", labelA: "Pengukuran 1 (A)", labelB: "Pengukuran 2 (B)" },
];

const contohUji = {
  satu: { a: "70, 85, 90, 65, 85, 100, 78", b: "", mu0: "75" },
  bebas: { a: "70, 75, 80, 85, 90", b: "60, 65, 70, 75, 80", mu0: "" },
  pasangan: { a: "60, 70, 65, 80, 75", b: "68, 75, 70, 88, 79", mu0: "" },
};

// Contoh cepat mode Korelasi
const contohKor = [
  { nama: "Positif kuat", a: "1, 2, 3, 4, 5, 6, 7, 8", b: "2, 4, 5, 4, 5, 7, 8, 9" },
  { nama: "Negatif kuat", a: "1, 2, 3, 4, 5, 6", b: "10, 8, 7, 5, 4, 2" },
  { nama: "Hampir tidak ada hubungan", a: "1, 2, 3, 4, 5, 6, 7, 8", b: "5, 3, 6, 4, 7, 3, 6, 4" },
];

const pilihanAlpha = ["0.01", "0.05", "0.1"];

const kartu = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const isian =
  "mt-2 w-full rounded-2xl border border-brand/20 bg-paper p-4 text-sm outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15";

// Warna kotak hasil, dipakai bergantian.
const aksen = ["bg-lavender", "bg-mint/30", "bg-peach/40", "bg-rose/40", "bg-sun/40"];

function JudulKartu({ ikon, warna, children }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-bold">
      <span
        aria-hidden="true"
        className={`grid size-8 shrink-0 place-items-center rounded-xl text-base ${warna}`}
      >
        {ikon}
      </span>
      {children}
    </h2>
  );
}

export default function Kalkulator() {
  const [aktif, setAktif] = useState(2);
  const [teks, setTeks] = useState("");
  const [hasil, setHasil] = useState(null);
  const [versi, setVersi] = useState(0); // naik tiap kali menghitung, supaya animasi diputar ulang
  const hasilRef = useRef(null);

  // Isian untuk mode dua kotak (Uji t dan Korelasi)
  const [jenis, setJenis] = useState("satu");
  const [dataA, setDataA] = useState("");
  const [dataB, setDataB] = useState("");
  const [mu0, setMu0] = useState("");
  const [alpha, setAlpha] = useState("0.05");

  const m = mode[aktif];
  const duaKotak = Boolean(m.uji || m.kor);
  const ju = jenisUji.find((j) => j.kode === jenis);

  // Keterangan otomatis: dari hasil uji/korelasi, atau dari data mode Statistika
  const keterangan =
    hasil?.keterangan ??
    (hasil?.data && hasil?.kuartil ? keteranganStatistika(hasil.data, hasil.kuartil) : null);

  const kosong = duaKotak ? !dataA && !dataB && !mu0 && !hasil : !teks && !hasil;

  // Di layar sempit (kartu Hasil ada di bawah Input), gulir ke Hasil setelah menghitung.
  useEffect(() => {
    if (versi === 0) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hasilRef.current?.scrollIntoView({
      behavior: kurangiGerak ? "auto" : "smooth",
      block: "start",
    });
  }, [versi]);

  function pilihMode(i) {
    setAktif(i);
    setTeks("");
    setDataA("");
    setDataB("");
    setMu0("");
    setHasil(null);
  }

  function pilihJenis(kode) {
    setJenis(kode);
    setHasil(null);
  }

  function hitung(isi) {
    setHasil(m.proses(isi));
    setVersi((v) => v + 1);
  }

  function hitungUji(nilai) {
    setHasil(prosesUjiT(nilai));
    setVersi((v) => v + 1);
  }

  function hitungKor(nilai) {
    setHasil(prosesKorelasi(nilai));
    setVersi((v) => v + 1);
  }

  function jalankan() {
    if (m.uji) hitungUji({ jenis, a: dataA, b: dataB, mu0, alpha });
    else if (m.kor) hitungKor({ x: dataA, y: dataB, alpha });
    else hitung(teks);
  }

  function pakaiContoh(isi) {
    setTeks(isi);
    hitung(isi);
  }

  function pakaiContohUji() {
    const c = contohUji[jenis];
    setDataA(c.a);
    setDataB(c.b);
    setMu0(c.mu0);
    hitungUji({ jenis, a: c.a, b: c.b, mu0: c.mu0, alpha });
  }

  function pakaiContohKor(c) {
    setDataA(c.a);
    setDataB(c.b);
    hitungKor({ x: c.a, y: c.b, alpha });
  }

  function hapus() {
    setTeks("");
    setDataA("");
    setDataB("");
    setMu0("");
    setHasil(null);
  }

  function saatTekan(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      jalankan();
    }
  }

  function klikContoh() {
    if (m.uji) pakaiContohUji();
    else if (m.kor) pakaiContohKor(contohKor[0]);
    else pakaiContoh(m.isiContoh);
  }

  // Penomoran langkah: mulai dari 1 lagi setiap ada judul kelompok
  let nomor = 0;

  return (
    <div className="animate-rise">
      <h1 className="text-4xl font-bold">Kalkulator</h1>
      <p className="mt-1 text-ink/70">Masukkan data, lihat hasil dan langkahnya.</p>

      {/* Pilihan mode */}
      <div
        className="mt-6 inline-flex max-w-full flex-wrap gap-1 rounded-3xl border border-brand/10 bg-white p-1 shadow-sm sm:rounded-full"
        role="tablist"
        aria-label="Jenis hitungan"
      >
        {mode.map((x, i) => (
          <button
            key={x.nama}
            type="button"
            role="tab"
            aria-selected={aktif === i}
            onClick={() => pilihMode(i)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              aktif === i ? "bg-brand text-white shadow-sm" : "hover:bg-lavender"
            }`}
          >
            {x.nama}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Input */}
        <section className={`${kartu} min-w-0 p-5 sm:p-6`}>
          {duaKotak ? (
            <>
              <h2 className="text-lg font-bold">Masukkan data</h2>
              <p className="text-sm text-ink/60">{m.contoh}</p>

              {/* Jenis uji (hanya Uji t) */}
              {m.uji && (
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Jenis uji t">
                  {jenisUji.map((j) => (
                    <button
                      key={j.kode}
                      type="button"
                      aria-pressed={jenis === j.kode}
                      onClick={() => pilihJenis(j.kode)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        jenis === j.kode
                          ? "bg-brand text-white shadow-sm"
                          : "bg-lavender hover:bg-sun"
                      }`}
                    >
                      {j.nama}
                    </button>
                  ))}
                </div>
              )}

              <label htmlFor="data-a" className="mt-4 block text-sm font-bold">
                {m.kor ? "Data X (variabel bebas)" : ju.labelA}
              </label>
              <textarea
                id="data-a"
                rows={3}
                value={dataA}
                onChange={(e) => setDataA(e.target.value)}
                onKeyDown={saatTekan}
                placeholder={m.kor ? "Contoh: 1, 2, 3, 4, 5" : "Contoh: 70, 85, 90, 65, 85"}
                className={isian}
              />

              {(m.kor || jenis !== "satu") && (
                <>
                  <label htmlFor="data-b" className="mt-4 block text-sm font-bold">
                    {m.kor ? "Data Y (variabel terikat)" : ju.labelB}
                  </label>
                  <textarea
                    id="data-b"
                    rows={3}
                    value={dataB}
                    onChange={(e) => setDataB(e.target.value)}
                    onKeyDown={saatTekan}
                    placeholder={m.kor ? "Contoh: 2, 4, 5, 4, 5" : "Contoh: 60, 65, 70, 75, 80"}
                    className={isian}
                  />
                </>
              )}

              {m.kor && (
                <div className="mt-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Contoh cepat</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {contohKor.map((c) => (
                      <button
                        key={c.nama}
                        type="button"
                        onClick={() => pakaiContohKor(c)}
                        className="rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-sun"
                      >
                        {c.nama}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {m.uji && jenis === "satu" && (
                  <div>
                    <label htmlFor="mu0" className="block text-sm font-bold">
                      Nilai hipotesis (μ₀)
                    </label>
                    <input
                      id="mu0"
                      inputMode="decimal"
                      value={mu0}
                      onChange={(e) => setMu0(e.target.value)}
                      onKeyDown={saatTekan}
                      placeholder="Contoh: 75"
                      className={`${isian} p-3`}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="alpha" className="block text-sm font-bold">
                    Taraf signifikansi (α)
                  </label>
                  <select
                    id="alpha"
                    value={alpha}
                    onChange={(e) => setAlpha(e.target.value)}
                    className={`${isian} p-3`}
                  >
                    {pilihanAlpha.map((a) => (
                      <option key={a} value={a}>
                        {a === "0.1" ? "0,10" : a.replace(".", ",")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <label htmlFor="data" className="block text-lg font-bold">
                Masukkan data
              </label>
              <p className="text-sm text-ink/60">{m.contoh}</p>
              <textarea
                id="data"
                rows={5}
                value={teks}
                onChange={(e) => setTeks(e.target.value)}
                onKeyDown={saatTekan}
                placeholder={m.hint}
                className={`${isian} mt-3`}
              />

              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Contoh cepat</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.chip.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => pakaiContoh(c)}
                      className="rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-sun"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={jalankan}
              className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              Hitung
            </button>
            <button
              type="button"
              onClick={klikContoh}
              className="rounded-full border border-brand/20 bg-white px-5 py-2.5 font-semibold transition hover:bg-sun/50"
            >
              Coba contoh
            </button>
            <button
              type="button"
              onClick={hapus}
              disabled={kosong}
              className="rounded-full border border-brand/20 bg-white px-5 py-2.5 font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/20 disabled:hover:bg-white disabled:hover:text-ink"
            >
              Hapus
            </button>
          </div>
          <p className="mt-3 text-xs text-ink/50">Tip: tekan Ctrl + Enter untuk menghitung.</p>
        </section>

        {/* Hasil */}
        <section ref={hasilRef} className={`${kartu} min-w-0 scroll-mt-28 p-5 sm:p-6`}>
          <JudulKartu ikon="=" warna="bg-mint/40">
            Hasil
          </JudulKartu>

          {!hasil && (
            <p className="mt-3 text-sm text-ink/60">
              Belum ada hasil. Isi data lalu tekan Hitung, atau pilih salah satu contoh cepat.
            </p>
          )}

          {hasil?.galat && (
            <p
              key={versi}
              role="alert"
              className="mt-3 animate-rise rounded-2xl bg-rose/40 p-4 text-sm font-semibold"
            >
              {hasil.galat}
            </p>
          )}

          {hasil?.ringkasan && (
            <dl key={versi} className="mt-4 grid animate-rise grid-cols-2 gap-3 text-sm">
              {hasil.ringkasan.map((h, i) => (
                <div
                  key={h.label}
                  className={`min-w-0 rounded-2xl p-3.5 ${aksen[i % aksen.length]} ${
                    hasil.ringkasan.length === 1 ? "col-span-2" : ""
                  }`}
                >
                  <dt className="text-ink/70">
                    <Teks>{h.label}</Teks>
                  </dt>
                  <dd className="mt-1 overflow-x-auto overflow-y-hidden font-display text-xl font-bold">
                    <Teks>{h.nilai}</Teks>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Langkah */}
        <section className={`${kartu} min-w-0 p-5 sm:p-6`}>
          <JudulKartu ikon="✎" warna="bg-peach/60">
            Langkah penyelesaian
          </JudulKartu>

          {!hasil?.langkah && (
            <p className="mt-3 text-sm text-ink/60">
              Langkah muncul setelah kamu menekan Hitung.
            </p>
          )}

          {hasil?.langkah && (
            <div key={versi} className="mt-4 animate-rise space-y-3 text-sm text-ink/80">
              {hasil.langkah.map((l, i) => {
                if (l.startsWith("#")) {
                  nomor = 0;
                  return (
                    <p
                      key={i}
                      className="mt-2 inline-block rounded-full bg-sun/60 px-3 py-0.5 font-bold text-ink"
                    >
                      {l.slice(1).trim()}
                    </p>
                  );
                }
                nomor += 1;
                return (
                  <div key={i} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lavender text-xs font-bold text-brand">
                      {nomor}
                    </span>
                    <div className="min-w-0 overflow-x-auto overflow-y-hidden py-0.5">
                      <Teks>{l}</Teks>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Grafik */}
        <section className={`${kartu} min-w-0 p-5 sm:p-6`}>
          <JudulKartu ikon="▮" warna="bg-lavender text-brand">
            Grafik
          </JudulKartu>

          {hasil?.data && hasil?.kuartil ? (
            <div key={versi} className="animate-rise">
              <GrafikStatistik data={hasil.data} kuartil={hasil.kuartil} />
            </div>
          ) : hasil?.grafik?.jenis === "t" ? (
            <div key={versi} className="animate-rise">
              <GrafikT grafik={hasil.grafik} />
            </div>
          ) : hasil?.grafik?.jenis === "scatter" ? (
            <div key={versi} className="animate-rise">
              <GrafikScatter grafik={hasil.grafik} />
            </div>
          ) : hasil?.grafik ? (
            <div key={versi} className="animate-rise">
              <GrafikDistribusi grafik={hasil.grafik} />
            </div>
          ) : (
            <div className="mt-4 grid h-44 place-items-center rounded-2xl border border-dashed border-brand/25 bg-paper text-center">
              <div>
                <div aria-hidden="true" className="mx-auto flex h-14 items-end justify-center gap-1.5">
                  {[28, 44, 56, 40, 24].map((tinggi, i) => (
                    <span
                      key={i}
                      className={`w-4 rounded-t-md ${aksen[i % aksen.length]}`}
                      style={{ height: `${tinggi}px` }}
                    />
                  ))}
                </div>
                <p className="mt-3 px-4 text-sm text-ink/60">
                  {aktif === 2
                    ? "Hitung data di mode Statistika untuk melihat histogram dan boxplot."
                    : aktif >= 3
                      ? "Hitung dulu untuk melihat grafiknya."
                      : "Grafik tersedia di mode Statistika, Binomial, Poisson, Normal, Uji t, dan Korelasi."}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Keterangan otomatis */}
      {keterangan && (
        <section key={versi} className={`${kartu} mt-6 animate-rise p-5 sm:p-6`}>
          <JudulKartu ikon="💡" warna="bg-sun/60">
            Keterangan otomatis
          </JudulKartu>
          <p className="mt-1 text-xs text-ink/60">
            Dibuat dari aturan sederhana (bukan AI) untuk membantu membaca hasil. Anggap sebagai
            petunjuk belajar, bukan kesimpulan pasti.
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {keterangan.map((k, i) => (
              <li key={k.judul} className={`min-w-0 rounded-2xl p-4 ${aksen[i % aksen.length]}`}>
                <p className="text-sm font-bold">{k.judul}</p>
                <p className="mt-1 text-sm text-ink/80">{k.isi}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-sm text-ink/60">
        Kalkulator bisa dipakai tanpa login. Login hanya untuk menyimpan riwayat hitungan.
      </p>
    </div>
  );
}