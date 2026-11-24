"use client";

// src/app/kalkulator/page.js
// Kalkulator 9 mode: Dasar, Peluang, Statistika, Binomial, Poisson, Normal, Uji t, Korelasi, ANOVA.
// Hasil ringkas + langkah penyelesaian + grafik + keterangan otomatis.
// Pengguna yang login bisa menyimpan hasil ke riwayat, dan membuka kembali lewat /kalkulator?riwayat=ID.

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { prosesDasar, prosesPeluang, prosesStatistika } from "@/lib/proses";
import { prosesBinomial, prosesPoisson, prosesNormal } from "@/lib/distribusi";
import { prosesUjiT } from "@/lib/uji";
import { prosesKorelasi } from "@/lib/regresi";
import { prosesAnova } from "@/lib/anova";
import { keteranganStatistika } from "@/lib/keterangan";
import Teks from "@/components/Teks";
import GrafikStatistik from "@/components/GrafikStatistik";
import GrafikDistribusi from "@/components/GrafikDistribusi";
import GrafikT from "@/components/GrafikT";
import GrafikScatter from "@/components/GrafikScatter";
import GrafikAnova from "@/components/GrafikAnova";

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
  {
    nama: "ANOVA",
    anova: true,
    contoh: "Bandingkan rata-rata 2 sampai 5 kelompok sekaligus (ANOVA satu arah).",
  },
];

// Kode untuk alamat /kalkulator?mode=KODE. Urutannya HARUS sama dengan array `mode` di atas.
const kodeMode = [
  "dasar",
  "peluang",
  "statistika",
  "binomial",
  "poisson",
  "normal",
  "uji-t",
  "korelasi",
  "anova",
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

// Mode ANOVA: nama kelompok, batas jumlah kelompok, dan contoh cepat
const NAMA_KELOMPOK = ["A", "B", "C", "D", "E"];
const MIN_KELOMPOK = 2;
const MAKS_KELOMPOK = 5;
const contohAnova = [
  {
    nama: "Ada perbedaan (3 kelompok)",
    grup: ["70, 75, 80, 85, 90", "60, 65, 70, 75, 80", "80, 85, 90, 95, 100"],
  },
  {
    nama: "Tidak ada perbedaan",
    grup: ["1, 2, 3", "2, 3, 4", "3, 4, 5"],
  },
  {
    nama: "Empat kelompok",
    grup: ["5, 6, 7, 8", "6, 7, 8, 9", "9, 10, 11, 12", "4, 5, 6, 7"],
  },
];

const grupKosong = () => ["", "", "", "", ""];

const pilihanAlpha = ["0.01", "0.05", "0.1"];

// Batas ukuran riwayat (database menolak di atas 5000 karakter; dibuat lebih longgar dengan 4000)
const BATAS_INPUT = 4000;

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

// Pilihan taraf signifikansi (dipakai Uji t, Korelasi, dan ANOVA)
function PilihAlpha({ alpha, setAlpha }) {
  return (
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
  );
}

function IsiKalkulator() {
  const params = useSearchParams();
  const riwayatId = /^\d+$/.test(params.get("riwayat") ?? "") ? Number(params.get("riwayat")) : null;

  const indeksAwal = kodeMode.indexOf(params.get("mode") ?? "");
  const [aktif, setAktif] = useState(indeksAwal >= 0 ? indeksAwal : 2);
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

  // Isian mode ANOVA
  const [grup, setGrup] = useState(grupKosong());
  const [jumlahGrup, setJumlahGrup] = useState(3);

  // Riwayat: undefined = belum tahu, null = belum login, string = id pengguna
  const [userId, setUserId] = useState(undefined);
  const [masukan, setMasukan] = useState(null); // input terakhir yang dihitung
  const [statusSimpan, setStatusSimpan] = useState({ jenis: "", teks: "" });
  const [memuat, setMemuat] = useState(riwayatId !== null); // true saat entri riwayat sedang diambil

  const m = mode[aktif];
  const duaKotak = Boolean(m.uji || m.kor);
  const ju = jenisUji.find((j) => j.kode === jenis);

  // Keterangan otomatis: dari hasil uji/korelasi/ANOVA, atau dari data mode Statistika
  const keterangan =
    hasil?.keterangan ??
    (hasil?.data && hasil?.kuartil ? keteranganStatistika(hasil.data, hasil.kuartil) : null);

  const kosong = m.anova
    ? grup.every((g) => !g) && !hasil
    : duaKotak
      ? !dataA && !dataB && !mu0 && !hasil
      : !teks && !hasil;

  // Cek status login (hanya untuk tampilan tombol; pengaman sebenarnya adalah RLS di database).
  // Bila alamat memuat ?riwayat=ID, muat entri itu (hanya milik pengguna ini).
  useEffect(() => {
    let batal = false;
    const supabase = createClient();
    (async () => {
      // getClaims memeriksa tiket login dari cookie, tanpa menunggu server Auth.
      const { data } = await supabase.auth.getClaims();
      if (batal) return;
      const id = data?.claims?.sub ?? null;
      setUserId(id);
      if (id && riwayatId !== null) {
        const { data: baris } = await supabase
          .from("riwayat_hitungan")
          .select("jenis, input")
          .eq("id", riwayatId)
          .eq("user_id", id)
          .maybeSingle();
        if (!batal && baris) pulihkan(baris);
      }
      if (!batal) setMemuat(false);
    })();
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riwayatId]);

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

  // Isi ulang formulir dan hitung lagi dari entri riwayat
  function pulihkan(baris) {
    const i = mode.findIndex((x) => x.nama === baris.jenis);
    if (i < 0) return;
    const md = mode[i];
    const inp = baris.input || {};
    const al = inp.alpha || "0.05";

    setAktif(i);
    setTeks("");
    setDataA("");
    setDataB("");
    setMu0("");
    setGrup(grupKosong());
    setJumlahGrup(3);
    setAlpha(al);

    if (md.uji) {
      setJenis(inp.jenis || "satu");
      setDataA(inp.a || "");
      setDataB(inp.b || "");
      setMu0(inp.mu0 || "");
      setHasil(prosesUjiT({ ...inp, alpha: al }));
    } else if (md.kor) {
      setDataA(inp.a || "");
      setDataB(inp.b || "");
      setHasil(prosesKorelasi({ x: inp.a, y: inp.b, alpha: al }));
    } else if (md.anova) {
      const daftar = Array.isArray(inp.grup) ? inp.grup : [];
      const baru = grupKosong();
      daftar.slice(0, MAKS_KELOMPOK).forEach((g, j) => {
        baru[j] = String(g);
      });
      setGrup(baru);
      setJumlahGrup(Math.max(MIN_KELOMPOK, Math.min(MAKS_KELOMPOK, daftar.length)));
      setHasil(prosesAnova({ kelompok: daftar, alpha: al }));
    } else {
      setTeks(inp.teks || "");
      setHasil(md.proses(inp.teks || ""));
    }
    setMasukan(inp);
    setStatusSimpan({ jenis: "", teks: "" });
    setVersi((v) => v + 1);
  }

  function pilihMode(i) {
    setAktif(i);
    setTeks("");
    setDataA("");
    setDataB("");
    setMu0("");
    setGrup(grupKosong());
    setJumlahGrup(3);
    setHasil(null);
    setMasukan(null);
    setStatusSimpan({ jenis: "", teks: "" });
  }

  function pilihJenis(kode) {
    setJenis(kode);
    setHasil(null);
    setMasukan(null);
  }

  function hitung(isi) {
    setHasil(m.proses(isi));
    setMasukan({ teks: isi });
    setStatusSimpan({ jenis: "", teks: "" });
    setVersi((v) => v + 1);
  }

  function hitungUji(nilai) {
    setHasil(prosesUjiT(nilai));
    setMasukan({ jenis: nilai.jenis, a: nilai.a, b: nilai.b, mu0: nilai.mu0, alpha: nilai.alpha });
    setStatusSimpan({ jenis: "", teks: "" });
    setVersi((v) => v + 1);
  }

  function hitungKor(nilai) {
    setHasil(prosesKorelasi(nilai));
    setMasukan({ a: nilai.x, b: nilai.y, alpha: nilai.alpha });
    setStatusSimpan({ jenis: "", teks: "" });
    setVersi((v) => v + 1);
  }

  function hitungAnova(kelompok) {
    setHasil(prosesAnova({ kelompok, alpha }));
    setMasukan({ grup: kelompok, alpha });
    setStatusSimpan({ jenis: "", teks: "" });
    setVersi((v) => v + 1);
  }

  function jalankan() {
    if (m.uji) hitungUji({ jenis, a: dataA, b: dataB, mu0, alpha });
    else if (m.kor) hitungKor({ x: dataA, y: dataB, alpha });
    else if (m.anova) hitungAnova(grup.slice(0, jumlahGrup));
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

  function pakaiContohAnova(c) {
    const baru = grupKosong();
    c.grup.forEach((g, i) => {
      baru[i] = g;
    });
    setGrup(baru);
    setJumlahGrup(c.grup.length);
    hitungAnova(c.grup);
  }

  function ubahGrup(i, nilai) {
    setGrup((lama) => lama.map((g, j) => (j === i ? nilai : g)));
  }

  function tambahGrup() {
    setJumlahGrup((n) => Math.min(MAKS_KELOMPOK, n + 1));
  }

  function kurangiGrup() {
    if (jumlahGrup <= MIN_KELOMPOK) return;
    // kosongkan kolom yang dihapus supaya datanya tidak ikut terhitung
    setGrup((lama) => lama.map((g, j) => (j === jumlahGrup - 1 ? "" : g)));
    setJumlahGrup((n) => n - 1);
    setHasil(null);
    setMasukan(null);
  }

  function hapus() {
    setTeks("");
    setDataA("");
    setDataB("");
    setMu0("");
    setGrup(grupKosong());
    setHasil(null);
    setMasukan(null);
    setStatusSimpan({ jenis: "", teks: "" });
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
    else if (m.anova) pakaiContohAnova(contohAnova[0]);
    else pakaiContoh(m.isiContoh);
  }

  // Simpan hasil ke riwayat (user_id diisi otomatis oleh database lewat auth.uid())
  async function simpan() {
    if (!userId || !masukan || !hasil?.ringkasan) return;
    if (JSON.stringify(masukan).length > BATAS_INPUT) {
      setStatusSimpan({
        jenis: "galat",
        teks: "Datanya terlalu panjang untuk disimpan ke riwayat (maksimal sekitar 4.000 karakter). Hasil tetap bisa dipakai di sini.",
      });
      return;
    }
    setStatusSimpan({ jenis: "proses", teks: "Menyimpan..." });
    const supabase = createClient();
    const { error } = await supabase.from("riwayat_hitungan").insert({
      jenis: m.nama,
      input: masukan,
      hasil: { ringkasan: hasil.ringkasan },
    });
    if (error) {
      console.warn("Galat simpan riwayat:", error.code);
      setStatusSimpan({ jenis: "galat", teks: "Gagal menyimpan. Coba lagi sebentar lagi." });
    } else {
      setStatusSimpan({
        jenis: "ok",
        teks: "Tersimpan di riwayat. Lihat di Dashboard (maksimal 50 entri terbaru).",
      });
    }
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
          {m.anova ? (
            <>
              <h2 className="text-lg font-bold">Masukkan data</h2>
              <p className="text-sm text-ink/60">{m.contoh}</p>

              {Array.from({ length: jumlahGrup }, (_, i) => (
                <div key={i}>
                  <label htmlFor={`grup-${i}`} className="mt-4 block text-sm font-bold">
                    Kelompok {NAMA_KELOMPOK[i]}
                  </label>
                  <textarea
                    id={`grup-${i}`}
                    rows={2}
                    value={grup[i]}
                    onChange={(e) => ubahGrup(i, e.target.value)}
                    onKeyDown={saatTekan}
                    placeholder="Contoh: 70, 75, 80, 85, 90"
                    className={isian}
                  />
                </div>
              ))}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={tambahGrup}
                  disabled={jumlahGrup >= MAKS_KELOMPOK}
                  className="rounded-full bg-lavender px-4 py-1.5 text-xs font-semibold transition hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lavender"
                >
                  + Tambah kelompok
                </button>
                <button
                  type="button"
                  onClick={kurangiGrup}
                  disabled={jumlahGrup <= MIN_KELOMPOK}
                  className="rounded-full bg-lavender px-4 py-1.5 text-xs font-semibold transition hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lavender"
                >
                  − Kurangi kelompok
                </button>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Contoh cepat</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contohAnova.map((c) => (
                    <button
                      key={c.nama}
                      type="button"
                      onClick={() => pakaiContohAnova(c)}
                      className="rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-sun"
                    >
                      {c.nama}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <PilihAlpha alpha={alpha} setAlpha={setAlpha} />
              </div>
            </>
          ) : duaKotak ? (
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
                <PilihAlpha alpha={alpha} setAlpha={setAlpha} />
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

          {!hasil && memuat && (
            <p role="status" className="mt-3 text-sm font-semibold text-brand">
              Memuat riwayat...
            </p>
          )}

          {!hasil && !memuat && (
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

          {/* Simpan ke riwayat */}
          {hasil?.ringkasan && userId !== undefined && (
            <div className="mt-4 border-t border-brand/10 pt-4">
              {userId ? (
                <>
                  <button
                    type="button"
                    onClick={simpan}
                    disabled={statusSimpan.jenis === "proses" || statusSimpan.jenis === "ok"}
                    className="rounded-full bg-lavender px-5 py-2 text-sm font-semibold transition hover:bg-sun disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-lavender"
                  >
                    {statusSimpan.jenis === "ok" ? "✓ Tersimpan" : "Simpan hasil ke riwayat"}
                  </button>
                  {statusSimpan.teks && (
                    <p
                      role={statusSimpan.jenis === "galat" ? "alert" : "status"}
                      className={`mt-2 rounded-2xl px-4 py-2 text-xs font-semibold ${
                        statusSimpan.jenis === "galat" ? "bg-rose/40" : "bg-mint/30"
                      }`}
                    >
                      {statusSimpan.teks}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-ink/60">
                  <Link href="/login" className="font-semibold text-brand underline underline-offset-2">
                    Masuk
                  </Link>{" "}
                  untuk menyimpan hasil ini ke riwayat hitunganmu.
                </p>
              )}
            </div>
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
          ) : hasil?.grafik?.jenis === "anova" ? (
            <div key={versi} className="animate-rise">
              <GrafikAnova grafik={hasil.grafik} />
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
                      : "Grafik tersedia di mode Statistika, Binomial, Poisson, Normal, Uji t, Korelasi, dan ANOVA."}
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

// useSearchParams harus dibungkus Suspense
export default function Kalkulator() {
  return (
    <Suspense fallback={null}>
      <IsiKalkulator />
    </Suspense>
  );
}