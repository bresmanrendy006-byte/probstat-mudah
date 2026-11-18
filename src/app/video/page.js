"use client";

// src/app/video/page.js
// Halaman Video: filter per bagian. Kartu dengan ID YouTube bisa diputar di tempat (klik gambar
// sampulnya); kartu tanpa ID tampil "Segera hadir". Datanya ada di src/data/video.js.

import { useState } from "react";
import Link from "next/link";
import { bagianVideo } from "@/data/video";

function IkonPutar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5 size-6">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function IkonJam() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function KartuVideo({ v, nomor, warna, sedangDiputar, putar }) {
  const ada = Boolean(v.id);

  return (
    <article>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-brand/10 shadow-hard">
        {!ada && (
          <div
            className={`grid size-full place-items-center bg-linear-to-br ${warna} text-ink/70`}
          >
            <div className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/70">
                <IkonJam />
              </span>
              <p className="mt-2 text-sm font-bold">Segera hadir</p>
            </div>
          </div>
        )}

        {ada && sedangDiputar && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={`Video ${v.judul}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full"
          />
        )}

        {ada && !sedangDiputar && (
          <button
            type="button"
            onClick={putar}
            aria-label={`Putar video ${v.judul}`}
            className="group relative block size-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="size-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink/10 transition group-hover:bg-ink/25" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-white/95 text-brand shadow-lg transition group-hover:scale-110">
                <IkonPutar />
              </span>
            </span>
          </button>
        )}

        {!sedangDiputar && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold shadow-sm">
            {nomor}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-bold leading-snug">{v.judul}</h3>
      {v.slug && ada && (
        <Link
          href={`/materi/${v.slug}`}
          className="mt-1 inline-block rounded-full text-sm font-semibold text-brand hover:underline"
        >
          Baca materinya →
        </Link>
      )}
    </article>
  );
}

export default function Video() {
  const [aktif, setAktif] = useState(null); // null = semua bagian
  const [diputar, setDiputar] = useState(null); // "indeksBagian-indeksVideo"

  const total = bagianVideo.reduce((a, b) => a + b.video.length, 0);
  const tersedia = bagianVideo.reduce((a, b) => a + b.video.filter((v) => v.id).length, 0);

  return (
    <div>
      <h1 className="text-4xl font-bold">Video</h1>
      <p className="mt-1 text-ink/70">
        {total} video dalam {bagianVideo.length} bagian.{" "}
        <span className="font-semibold text-brand">{tersedia} sudah tersedia</span>, sisanya segera
        hadir.
      </p>

      <div role="group" aria-label="Filter bagian" className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAktif(null)}
          aria-pressed={aktif === null}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            aktif === null
              ? "bg-brand text-white shadow-sm"
              : "border border-brand/20 bg-white hover:bg-sun/50"
          }`}
        >
          Semua
        </button>
        {bagianVideo.map((b, i) => (
          <button
            key={b.judul}
            type="button"
            onClick={() => setAktif(i)}
            aria-pressed={aktif === i}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              aktif === i
                ? "bg-brand text-white shadow-sm"
                : "border border-brand/20 bg-white hover:bg-sun/50"
            }`}
          >
            {i + 1}. {b.judul}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {bagianVideo.map((b, bi) => {
          if (aktif !== null && aktif !== bi) return null;
          const siap = b.video.filter((v) => v.id).length;

          return (
            <section key={b.judul}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-2xl font-bold">
                  {bi + 1}. {b.judul}
                </h2>
                <span className="rounded-full bg-lavender px-3 py-0.5 text-xs font-bold">
                  {siap} dari {b.video.length} tersedia
                </span>
              </div>

              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {b.video.map((v, i) => {
                  const kunci = `${bi}-${i}`;
                  return (
                    <KartuVideo
                      key={kunci}
                      v={v}
                      nomor={`${bi + 1}.${i + 1}`}
                      warna={b.warna}
                      sedangDiputar={diputar === kunci}
                      putar={() => setDiputar(kunci)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}