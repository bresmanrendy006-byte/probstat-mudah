// src/app/materi/[slug]/page.js
// Halaman isi satu materi: video, pengertian, rumus, contoh soal.

import Link from "next/link";
import { notFound } from "next/navigation";
import { cariMateri } from "@/data/materi";
import Teks from "@/components/Teks";
import ContohSoal from "@/components/ContohSoal";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = cariMateri(slug);
  return { title: m ? `${m.judul} | ProbStat Mudah` : "Materi | ProbStat Mudah" };
}

export default async function IsiMateri({ params }) {
  const { slug } = await params; // di Next.js 16, params harus di-await
  const m = cariMateri(slug);
  if (!m) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/materi"
        className="group inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-hard transition hover:-translate-y-0.5 hover:bg-sun active:translate-y-0"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          ←
        </span>
        Kembali ke daftar materi
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border-2 border-ink bg-white px-3 py-0.5 text-xs font-bold">
          {m.kategori}
        </span>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-xs font-bold">
          {m.tingkat}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-bold">{m.judul}</h1>

      {/* Video (hanya tampil jika ada) */}
      {m.video?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Video</h2>
          <div className="mt-3 space-y-4">
            {m.video.map((id) => (
              <div
                key={id}
                className="aspect-video overflow-hidden rounded-2xl border-2 border-ink shadow-hard"
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={`Video ${m.judul}`}
                  allowFullScreen
                  className="size-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pengertian */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Pengertian</h2>
        <div className="mt-3 space-y-3 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard">
          {m.pengertian.map((p, i) => (
            <p key={i} className="leading-relaxed">
              <Teks>{p}</Teks>
            </p>
          ))}
        </div>
      </section>

      {/* Rumus */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Rumus</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {m.rumus.map((r) => (
            <div
              key={r.nama}
              className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard"
            >
              <p className="text-sm font-bold text-ink/70">{r.nama}</p>
              <div className="mt-2 overflow-x-auto overflow-y-hidden pb-1 text-lg">
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

      {/* Contoh soal */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Contoh soal dan pembahasan</h2>
        <div className="mt-3 space-y-5">
          {m.contoh.map((c, i) => (
            <ContohSoal key={i} nomor={i + 1} data={c} />
          ))}
        </div>
      </section>

      <div className="mt-10 rounded-2xl border-2 border-ink bg-ink p-6 text-white">
        <p className="font-bold">Mau coba hitung sendiri?</p>
        <Link
          href="/kalkulator"
          className="mt-3 inline-block rounded-xl border-2 border-white bg-sun px-5 py-2.5 font-semibold text-ink transition hover:-translate-y-0.5"
        >
          Buka Kalkulator
        </Link>
      </div>
    </div>
  );
}