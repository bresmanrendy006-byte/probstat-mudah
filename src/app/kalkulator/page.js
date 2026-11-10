"use client";

import { useState } from "react";

const mode = [
  { nama: "Dasar", hint: "Contoh: (12 + 8) * 3 / 4", contoh: "Ketik ekspresi, misalnya 2^5 + sqrt(49)" },
  { nama: "Peluang", hint: "Contoh: n = 10, r = 3", contoh: "Faktorial, permutasi, dan kombinasi" },
  { nama: "Statistika", hint: "Contoh: 70, 85, 90, 65, 85, 100, 78", contoh: "Mean, median, modus, varians, simpangan baku" },
];

const kartu = "bg-white border-2 border-ink rounded-xl shadow-hard";

export default function Kalkulator() {
  const [aktif, setAktif] = useState(2);
  const m = mode[aktif];

  return (
    <div>
      <h1 className="text-4xl font-bold">Kalkulator</h1>
      <p className="mt-1 text-ink/70">Masukkan data, lihat hasil dan langkahnya.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {mode.map((x, i) => (
          <button
            key={x.nama}
            type="button"
            onClick={() => setAktif(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border-2 border-ink transition ${
              aktif === i ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"
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
            placeholder={m.hint}
            className="mt-3 w-full rounded-xl border-2 border-ink p-3 text-sm bg-paper"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold border-2 border-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition">
              Hitung
            </button>
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white font-semibold border-2 border-ink hover:bg-sun transition">
              Coba contoh
            </button>
          </div>
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Hasil</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            {["Mean", "Median", "Modus", "Simpangan baku"].map((h) => (
              <div key={h} className="p-3 rounded-lg border-2 border-ink/20 bg-paper">
                <dt className="text-ink/60">{h}</dt>
                <dd className="mt-1 font-display text-xl font-bold">—</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Langkah penyelesaian</h2>
          <ol className="mt-3 space-y-2 text-sm text-ink/70 list-decimal list-inside">
            <li>Urutkan data dari yang terkecil.</li>
            <li>Jumlahkan semua nilai.</li>
            <li>Bagi dengan banyaknya data.</li>
          </ol>
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Grafik</h2>
          <div className="mt-3 h-40 rounded-xl border-2 border-dashed border-ink/30 grid place-items-center text-sm text-ink/50">
            Histogram dan boxplot muncul di sini
          </div>
        </section>
      </div>

      <p className="mt-6 text-sm text-ink/60">
        Kalkulator bisa dipakai tanpa login. Login hanya untuk menyimpan riwayat hitungan.
      </p>
    </div>
  );
}