"use client";

import { useState } from "react";

const bagian = [
  { judul: "Peluang Dasar", warna: "from-brand to-ink", video: ["Cara Memakai Website", "Bekal Hitungan", "Konsep Dasar Peluang", "Peluang Suatu Kejadian", "Permutasi dan Kombinasi", "Aturan Penjumlahan", "Aturan Perkalian"] },
  { judul: "Bersyarat, Bayes, dan Dasar Uji", warna: "from-mint to-brand", video: ["Peluang Bersyarat", "Teorema Bayes", "Dasar Uji Hipotesis", "Kesalahan Tipe I, II, dan Power", "Memilih Uji yang Tepat"] },
  { judul: "Distribusi Diskrit", warna: "from-sun to-mint", video: ["Peubah Acak dan Fungsi Peluang", "Distribusi Binomial", "Distribusi Hipergeometrik", "Geometrik dan Binomial Negatif", "Distribusi Poisson"] },
  { judul: "Normal dan Statistika", warna: "from-ink to-brand", video: ["Distribusi Normal dan Skor Z", "Statistika Deskriptif", "Membaca Histogram dan Boxplot", "Distribusi Sampling", "Distribusi t dan Interval Kepercayaan"] },
  { judul: "Uji Beda Rata-Rata", warna: "from-brand to-mint", video: ["One-Sample T Test", "Independent-Samples T Test", "Paired-Samples T Test", "One-Way ANOVA", "Input Data dan Membaca Output SPSS"] },
];

export default function Video() {
  const [aktif, setAktif] = useState(null);
  const total = bagian.reduce((a, b) => a + b.video.length, 0);

  return (
    <div>
      <h1 className="text-4xl font-bold">Video</h1>
      <p className="mt-1 text-ink/70">{total} video dalam {bagian.length} bagian.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAktif(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 border-ink transition ${aktif === null ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"}`}
        >
          Semua
        </button>
        {bagian.map((b, i) => (
          <button
            key={b.judul}
            type="button"
            onClick={() => setAktif(i)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 border-ink transition ${aktif === i ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"}`}
          >
            {i + 1}. {b.judul}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {bagian.map((b, bi) =>
          aktif !== null && aktif !== bi ? null : (
            <section key={b.judul}>
              <h2 className="text-2xl font-bold">
                {bi + 1}. {b.judul}
                <span className="ml-2 text-sm font-medium text-ink/60">{b.video.length} video</span>
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {b.video.map((judul, i) => (
                  <article key={judul} className="group">
                    <div className={`relative aspect-video rounded-xl border-2 border-ink shadow-hard bg-linear-to-br ${b.warna} grid place-items-center overflow-hidden group-hover:-translate-y-1 transition`}>
                      <span className="grid place-items-center size-14 rounded-full bg-white border-2 border-ink group-hover:scale-110 transition">▶</span>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white border-2 border-ink text-xs font-bold">
                        {bi + 1}.{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold leading-snug">{judul}</h3>
                  </article>
                ))}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}