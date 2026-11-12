"use client";

// src/components/DaftarMateri.js
// Tampilan daftar materi (pencarian + filter). Datanya dikirim dari app/materi/page.js.

import { useState } from "react";
import Link from "next/link";
import KartuMiring from "@/components/KartuMiring";
import Muncul from "@/components/Muncul";

const filter = ["Semua", "SMA", "Mahasiswa"];

function Label({ tingkat }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink px-2.5 py-1 text-xs font-semibold ${
        tingkat === "SMA" ? "bg-mint/20" : "bg-brand/15"
      }`}
    >
      {tingkat}
    </span>
  );
}

export default function DaftarMateri({ daftar }) {
  const [level, setLevel] = useState("Semua");
  const [cari, setCari] = useState("");

  const hasil = daftar
    .map((k) => ({
      ...k,
      materi: k.materi.filter(
        (m) =>
          (level === "Semua" || m.tingkat === level) &&
          m.judul.toLowerCase().includes(cari.trim().toLowerCase())
      ),
    }))
    .filter((k) => k.materi.length > 0);

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
          className="min-w-48 flex-1 rounded-xl border-2 border-ink bg-white px-4 py-2.5"
        />
        <div className="flex gap-2">
          {filter.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setLevel(f)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${
                level === f ? "bg-sun shadow-hard" : "bg-white hover:bg-ink/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {hasil.length === 0 && (
          <p className="rounded-xl border-2 border-dashed border-ink/30 p-6 text-center text-ink/60">
            Tidak ada materi yang cocok. Coba kata kunci lain atau ubah filter.
          </p>
        )}

        {hasil.map((k) => (
          <section key={k.kategori}>
            <h2 className="mb-4 text-2xl font-bold">{k.kategori}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {k.materi.map((m, i) => (
                <Muncul key={m.slug} delay={(i % 3) * 100}>
                  {m.isi ? (
                    <Link href={`/materi/${m.slug}`} className="block h-full">
                      <KartuMiring className="h-full">
                        <Label tingkat={m.tingkat} />
                        <h3 className="mt-3 font-bold leading-snug">{m.judul}</h3>
                        <p className="mt-3 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1">
                          Pelajari →
                        </p>
                      </KartuMiring>
                    </Link>
                  ) : (
                    <article className="h-full rounded-2xl border-2 border-ink/40 bg-white/70 p-5 opacity-70">
                      <Label tingkat={m.tingkat} />
                      <h3 className="mt-3 font-bold leading-snug">{m.judul}</h3>
                      <p className="mt-3 text-sm font-semibold text-ink/60">Segera hadir</p>
                    </article>
                  )}
                </Muncul>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}