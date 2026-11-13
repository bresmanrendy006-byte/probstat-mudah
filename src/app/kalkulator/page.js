"use client";

import { useState } from "react";
import { prosesDasar, prosesPeluang, prosesStatistika } from "@/lib/proses";
import Teks from "@/components/Teks";

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
    contoh: "Mean, median, modus, varians, simpangan baku",
    isiContoh: "70, 85, 90, 65, 85, 100, 78",
    chip: ["70, 85, 90, 65, 85, 100, 78", "2, 4, 4, 4, 5, 5, 7, 9"],
    proses: prosesStatistika,
  },
];

const kartu = "bg-white border-2 border-ink rounded-xl shadow-hard";

export default function Kalkulator() {
  const [aktif, setAktif] = useState(2);
  const [teks, setTeks] = useState("");
  const [hasil, setHasil] = useState(null);
  const [versi, setVersi] = useState(0); // naik tiap kali menghitung, supaya animasi diputar ulang
  const m = mode[aktif];

  function pilihMode(i) {
    setAktif(i);
    setTeks("");
    setHasil(null);
  }

  function hitung(isi) {
    setHasil(m.proses(isi));
    setVersi((v) => v + 1);
  }

  function pakaiContoh(isi) {
    setTeks(isi);
    hitung(isi);
  }

  function hapus() {
    setTeks("");
    setHasil(null);
  }

  function saatTekan(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      hitung(teks);
    }
  }

  // Penomoran langkah: mulai dari 1 lagi setiap ada judul kelompok
  let nomor = 0;

  return (
    <div className="animate-rise">
      <h1 className="text-4xl font-bold">Kalkulator</h1>
      <p className="mt-1 text-ink/70">Masukkan data, lihat hasil dan langkahnya.</p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Jenis hitungan">
        {mode.map((x, i) => (
          <button
            key={x.nama}
            type="button"
            role="tab"
            aria-selected={aktif === i}
            onClick={() => pilihMode(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border-2 border-ink transition ${
              aktif === i ? "bg-sun shadow-hard" : "bg-white hover:-translate-y-0.5 hover:bg-ink/5"
            }`}
          >
            {x.nama}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className={`${kartu} p-5`}>
          <label htmlFor="data" className="font-bold">Masukkan data</label>
          <p className="text-sm text-ink/60">{m.contoh}</p>
          <textarea
            id="data"
            rows={5}
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            onKeyDown={saatTekan}
            placeholder={m.hint}
            className="mt-3 w-full rounded-xl border-2 border-ink bg-paper p-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-sun"
          />

          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Contoh cepat</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {m.chip.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => pakaiContoh(c)}
                  className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-sun"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => hitung(teks)}
              className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold border-2 border-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition"
            >
              Hitung
            </button>
            <button
              type="button"
              onClick={() => pakaiContoh(m.isiContoh)}
              className="px-5 py-2.5 rounded-xl bg-white font-semibold border-2 border-ink hover:bg-sun transition"
            >
              Coba contoh
            </button>
            <button
              type="button"
              onClick={hapus}
              disabled={!teks && !hasil}
              className="px-5 py-2.5 rounded-xl bg-white font-semibold border-2 border-ink transition hover:border-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink disabled:hover:bg-white disabled:hover:text-ink"
            >
              Hapus
            </button>
          </div>
          <p className="mt-2 text-xs text-ink/50">Tip: tekan Ctrl + Enter untuk menghitung.</p>
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Hasil</h2>

          {!hasil && (
            <p className="mt-3 text-sm text-ink/60">
              Belum ada hasil. Isi data lalu tekan Hitung, atau pilih salah satu contoh cepat.
            </p>
          )}

          {hasil?.galat && (
            <p
              key={versi}
              role="alert"
              className="mt-3 animate-rise rounded-lg border-2 border-red-600 bg-red-50 p-3 text-sm font-medium text-red-700"
            >
              {hasil.galat}
            </p>
          )}

          {hasil?.ringkasan && (
            <dl key={versi} className="mt-3 grid animate-rise grid-cols-2 gap-3 text-sm">
              {hasil.ringkasan.map((h) => (
                <div
                  key={h.label}
                  className={`min-w-0 p-3 rounded-lg border-2 border-ink/20 bg-paper transition hover:border-ink ${
                    hasil.ringkasan.length === 1 ? "col-span-2" : ""
                  }`}
                >
                  <dt className="text-ink/60">
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
        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Langkah penyelesaian</h2>

          {!hasil?.langkah && (
            <p className="mt-3 text-sm text-ink/60">
              Langkah muncul setelah kamu menekan Hitung.
            </p>
          )}

          {hasil?.langkah && (
            <div key={versi} className="mt-3 animate-rise space-y-3 text-sm text-ink/70">
              {hasil.langkah.map((l, i) => {
                if (l.startsWith("#")) {
                  nomor = 0;
                  return (
                    <p key={i} className="pt-2 font-bold text-ink">
                      {l.slice(1).trim()}
                    </p>
                  );
                }
                nomor += 1;
                return (
                  <div key={i} className="flex gap-2">
                    <span className="font-bold text-ink">{nomor}.</span>
                    <div className="min-w-0 overflow-x-auto overflow-y-hidden py-0.5">
                      <Teks>{l}</Teks>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Grafik</h2>
          <div className="mt-3 grid h-40 place-items-center rounded-xl border-2 border-dashed border-ink/30 text-center text-sm text-ink/50">
            Histogram dan boxplot segera hadir
          </div>
        </section>
      </div>

      <p className="mt-6 text-sm text-ink/60">
        Kalkulator bisa dipakai tanpa login. Login hanya untuk menyimpan riwayat hitungan.
      </p>
    </div>
  );
}