"use client";

import { useState } from "react";

const daftar = [
  {
    kategori: "Probabilitas",
    materi: [
      { judul: "Konsep dasar: percobaan, ruang sampel, kejadian", level: "SMA" },
      { judul: "Peluang suatu kejadian", level: "SMA" },
      { judul: "Aturan penjumlahan", level: "SMA" },
      { judul: "Peluang bersyarat", level: "SMA" },
      { judul: "Aturan perkalian", level: "SMA" },
      { judul: "Teorema Bayes", level: "Mahasiswa" },
    ],
  },
  {
    kategori: "Statistika Dasar",
    materi: [
      { judul: "Pengertian statistika dan statistik", level: "SMA" },
      { judul: "Jenis data dan skala pengukuran", level: "SMA" },
      { judul: "Ukuran pemusatan", level: "SMA" },
      { judul: "Ukuran penyebaran", level: "Mahasiswa" },
      { judul: "Input data ke SPSS", level: "Mahasiswa" },
    ],
  },
];

const filter = ["Semua", "SMA", "Mahasiswa"];

export default function Materi() {
  const [level, setLevel] = useState("Semua");
  const [cari, setCari] = useState("");

  return (
    <div>
      <h1 className="text-4xl font-bold">Materi</h1>
      <p className="mt-1 text-ink/70">Pilih topik yang mau dipelajari.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari materi..."
          aria-label="Cari materi"
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border-2 border-ink bg-white"
        />
        <div className="flex gap-2">
          {filter.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setLevel(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 border-ink transition ${
                level === f ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {daftar.map((k) => {
          const tampil = k.materi.filter(
            (m) =>
              (level === "Semua" || m.level === level) &&
              m.judul.toLowerCase().includes(cari.toLowerCase())
          );
          if (tampil.length === 0) return null;
          return (
            <section key={k.kategori}>
              <h2 className="text-2xl font-bold mb-4">{k.kategori}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tampil.map((m) => (
                  <article
                    key={m.judul}
                    className="group p-5 bg-white border-2 border-ink rounded-xl shadow-hard hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)] transition"
                  >
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border-2 border-ink ${m.level === "SMA" ? "bg-mint/20" : "bg-brand/15"}`}>
                      {m.level}
                    </span>
                    <h3 className="mt-3 font-bold leading-snug">{m.judul}</h3>
                    <p className="mt-3 text-sm font-semibold group-hover:translate-x-1 transition">Pelajari →</p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}