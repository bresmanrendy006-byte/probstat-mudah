// src/app/cheat-sheet/[slug]/page.js
// Satu lembar cheat sheet untuk satu materi. Rapi saat dicetak.

import Link from "next/link";
import { notFound } from "next/navigation";
import { cariMateri } from "@/data/materi";
import Teks from "@/components/Teks";
import TombolCetak from "@/components/TombolCetak";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = cariMateri(slug);
  return {
    title: m ? `Cheat Sheet ${m.judul} | ProbStat Mudah` : "Cheat Sheet | ProbStat Mudah",
  };
}

export default async function LembarCheatSheet({ params }) {
  const { slug } = await params; // di Next.js 16, params harus di-await
  const m = cariMateri(slug);
  if (!m) notFound();

  const adaRumus = m.rumus?.length > 0;
  // Bila materi tidak punya rumus, tampilkan seluruh pengertian sebagai ringkasan.
  const intisari = adaRumus ? m.pengertian.slice(0, 1) : m.pengertian;

  return (
    <div className="mx-auto max-w-3xl animate-rise print:max-w-none print:animate-none">
      {/* Tombol: tidak ikut tercetak */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/cheat-sheet"
          className="group inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-sun/50"
        >
          <span aria-hidden="true">←</span>
          Semua cheat sheet
        </Link>
        <TombolCetak />
      </div>

      <article className="mt-5 rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8 print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <p className="text-xs font-bold uppercase tracking-wide text-brand">
          Cheat sheet · {m.kategori} · {m.tingkat}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{m.judul}</h1>

        <section className="mt-6">
          <h2 className="text-lg font-bold">Intisari</h2>
          <div className="mt-2 space-y-2 leading-relaxed">
            {intisari.map((p, i) => (
              <p key={i}>
                <Teks>{p}</Teks>
              </p>
            ))}
          </div>
        </section>

        {adaRumus && (
          <section className="mt-6">
            <h2 className="text-lg font-bold">Rumus penting</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 print:grid-cols-2">
              {m.rumus.map((r) => (
                <div
                  key={r.nama}
                  className="rounded-2xl border border-brand/10 bg-paper p-4 print:break-inside-avoid"
                >
                  <p className="inline-block rounded-full bg-lavender px-3 py-0.5 text-xs font-bold">
                    {r.nama}
                  </p>
                  <div className="mt-3 overflow-x-auto overflow-y-hidden py-1 text-lg print:overflow-visible">
                    <Teks besar>{`$${r.tex}$`}</Teks>
                  </div>
                  {r.ket && (
                    <p className="mt-2 text-sm text-ink/70">
                      <Teks>{r.ket}</Teks>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="mt-8 border-t border-brand/10 pt-3 text-xs text-ink/50">
          ProbStat Mudah · probstat-mudah.vercel.app
        </p>
      </article>
    </div>
  );
}