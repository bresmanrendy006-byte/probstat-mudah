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
    proses: prosesDasar,
  },
  {
    nama: "Peluang",
    hint: "Contoh: n = 10, r = 3",
    contoh: "Faktorial, permutasi, dan kombinasi",
    isiContoh: "n = 10, r = 3",
    proses: prosesPeluang,
  },
  {
    nama: "Statistika",
    hint: "Contoh: 70, 85, 90, 65, 85, 100, 78",
    contoh: "Mean, median, modus, varians, simpangan baku",
    isiContoh: "70, 85, 90, 65, 85, 100, 78",
    proses: prosesStatistika,
  },
];

const kartu = "bg-white border-2 border-ink rounded-xl shadow-hard";

export default function Kalkulator() {
  const [aktif, setAktif] = useState(2);
  const [teks, setTeks] = useState("");
  const [hasil, setHasil] = useState(null);
  const m = mode[aktif];

  function pilihMode(i) {
    setAktif(i);
    setTeks("");
    setHasil(null);
  }

  function hitung(isi) {
    setHasil(m.proses(isi));
  }

  function cobaContoh() {
    setTeks(m.isiContoh);
    hitung(m.isiContoh);
  }

  // Penomoran langkah: mulai dari 1 lagi setiap ada judul kelompok
  let nomor = 0;

  return (
    <div>
      <h1 className="text-4xl font-bold">Kalkulator</h1>
      <p className="mt-1 text-ink/70">Masukkan data, lihat hasil dan langkahnya.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {mode.map((x, i) => (
          <button
            key={x.nama}
            type="button"
            onClick={() => pilihMode(i)}
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
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            placeholder={m.hint}
            className="mt-3 w-full rounded-xl border-2 border-ink p-3 text-sm bg-paper"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => hitung(teks)}
              className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold border-2 border-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition"
            >
              Hitung
            </button>
            <button
              type="button"
              onClick={cobaContoh}
              className="px-5 py-2.5 rounded-xl bg-white font-semibold border-2 border-ink hover:bg-sun transition"
            >
              Coba contoh
            </button>
          </div>
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold">Hasil</h2>

          {!hasil && (
            <p className="mt-3 text-sm text-ink/60">
              Belum ada hasil. Isi data lalu tekan Hitung.
            </p>
          )}

          {hasil?.galat && (
            <p
              role="alert"
              className="mt-3 rounded-lg border-2 border-red-600 bg-red-50 p-3 text-sm font-medium text-red-700"
            >
              {hasil.galat}
            </p>
          )}

          {hasil?.ringkasan && (
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {hasil.ringkasan.map((h) => (
                <div
                  key={h.label}
                  className={`min-w-0 p-3 rounded-lg border-2 border-ink/20 bg-paper ${
                    hasil.ringkasan.length === 1 ? "col-span-2" : ""
                  }`}
                >
                  <dt className="text-ink/60">
                    <Teks>{h.label}</Teks>
                  </dt>
                  <dd className="mt-1 overflow-x-auto font-display text-xl font-bold">
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
            <div className="mt-3 space-y-3 text-sm text-ink/70">
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
                    <div className="min-w-0 overflow-x-auto">
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