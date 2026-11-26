// src/app/cheat-sheet/page.js
// Daftar cheat sheet: satu kartu per materi, dikelompokkan per kategori.

import Link from "next/link";
import { ambilDaftar } from "@/data/daftarBab";
import { cariMateri } from "@/data/materi";

export const metadata = { title: "Cheat Sheet | ProbStat Mudah" };

const warnaTingkat = { SMA: "bg-mint/40", Mahasiswa: "bg-lavender" };

export default function DaftarCheatSheet() {
  const daftar = ambilDaftar();

  return (
    <div className="mx-auto max-w-5xl animate-rise">
      <h1 className="text-4xl font-bold">Cheat Sheet</h1>
      <p className="mt-2 max-w-2xl text-ink/70">
        Lembar ringkasan rumus per materi. Pilih materi yang kamu butuhkan, lalu cetak atau simpan
        sebagai PDF.
      </p>

      {daftar.map((k) => (
        <section key={k.kategori} className="mt-10">
          <h2 className="text-2xl font-bold">{k.kategori}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {k.materi
              .filter((x) => x.isi)
              .map((x) => {
                const m = cariMateri(x.slug);
                const jumlah = m?.rumus?.length ?? 0;
                return (
                  <Link
                    key={x.slug}
                    href={`/cheat-sheet/${x.slug}`}
                    className="rounded-3xl border border-brand/10 bg-white p-5 shadow-hard transition hover:-translate-y-0.5 hover:bg-lavender/50"
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${warnaTingkat[x.tingkat] ?? "bg-sun"}`}
                    >
                      {x.tingkat}
                    </span>
                    <p className="mt-3 font-bold leading-snug">{x.judul}</p>
                    <p className="mt-1 text-sm text-ink/60">
                      {jumlah > 0 ? `${jumlah} rumus` : "Ringkasan konsep"}
                    </p>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}