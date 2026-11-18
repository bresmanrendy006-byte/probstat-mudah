"use client";

// src/components/DaftarMateri.js
// Tampilan daftar materi (pencarian + filter + penanda selesai/tersimpan).
// Datanya dikirim dari app/materi/page.js. Penanda hanya muncul bila pengguna login.

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuMiring from "@/components/KartuMiring";
import Muncul from "@/components/Muncul";
import { createClient } from "@/lib/supabase/client";

const filter = ["Semua", "SMA", "Mahasiswa"];

function Label({ tingkat }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
        tingkat === "SMA" ? "bg-mint/40" : "bg-lavender"
      }`}
    >
      {tingkat}
    </span>
  );
}

// Penanda di pojok kartu: centang hijau (selesai) dan/atau penanda kuning (tersimpan).
function Penanda({ selesai, tersimpan }) {
  if (!selesai && !tersimpan) return null;
  return (
    <span className="flex items-center gap-1.5">
      {tersimpan && (
        <span title="Tersimpan" className="grid size-7 place-items-center rounded-full bg-sun shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-3.5"
          >
            <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
          </svg>
          <span className="sr-only">Tersimpan</span>
        </span>
      )}
      {selesai && (
        <span title="Selesai" className="grid size-7 place-items-center rounded-full bg-mint shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-3.5"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          <span className="sr-only">Selesai</span>
        </span>
      )}
    </span>
  );
}

export default function DaftarMateri({ daftar }) {
  const [level, setLevel] = useState("Semua");
  const [cari, setCari] = useState("");

  // Data pengguna (kosong bila belum login)
  const [login, setLogin] = useState(false);
  const [selesai, setSelesai] = useState(() => new Set());
  const [tersimpan, setTersimpan] = useState(() => new Set());

  // Saat muncul: cek login, lalu baca progres dan bookmark milik pengguna.
  useEffect(() => {
    let dibatalkan = false;

    async function muat() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        const id = data?.claims?.sub;
        if (!id) return;

        // Filter user_id wajib: admin boleh membaca data semua pengguna.
        const [resProgres, resBookmark] = await Promise.all([
          supabase.from("progres").select("slug").eq("user_id", id),
          supabase.from("bookmark").select("slug").eq("user_id", id),
        ]);
        if (resProgres.error) throw resProgres.error;
        if (resBookmark.error) throw resBookmark.error;

        if (dibatalkan) return;
        setSelesai(new Set(resProgres.data.map((b) => b.slug)));
        setTersimpan(new Set(resBookmark.data.map((b) => b.slug)));
        setLogin(true);
      } catch (err) {
        // Gagal membaca: daftar tetap tampil normal, hanya tanpa penanda.
        console.error("Gagal membaca progres/bookmark untuk daftar materi:", err);
      }
    }

    muat();
    return () => {
      dibatalkan = true;
    };
  }, []);

  const kata = cari.trim().toLowerCase();

  const hasil = daftar
    .map((k) => ({
      ...k,
      materi: k.materi.filter(
        (m) =>
          (level === "Semua" || m.tingkat === level) &&
          m.judul.toLowerCase().includes(kata)
      ),
    }))
    .filter((k) => k.materi.length > 0);

  const jumlahTampil = hasil.reduce((n, k) => n + k.materi.length, 0);
  const sedangMenyaring = level !== "Semua" || kata !== "";

  function reset() {
    setCari("");
    setLevel("Semua");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Materi</h1>
      <p className="mt-1 text-ink/70">Pilih topik yang mau dipelajari.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/50"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari materi..."
            aria-label="Cari materi"
            className="w-full rounded-full border border-brand/20 bg-white py-3 pl-11 pr-20 shadow-sm placeholder:text-ink/40"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-lavender px-3 py-1 text-xs font-semibold transition hover:bg-sun"
            >
              Hapus
            </button>
          )}
        </div>

        <div role="group" aria-label="Filter tingkat" className="flex flex-wrap gap-2">
          {filter.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setLevel(f)}
              aria-pressed={level === f}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                level === f
                  ? "bg-brand text-white shadow-sm"
                  : "border border-brand/20 bg-white hover:bg-sun/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-ink/60">
        {sedangMenyaring
          ? `Menampilkan ${jumlahTampil} materi`
          : login
            ? "Centang hijau = sudah selesai, penanda kuning = tersimpan."
            : ""}
      </p>

      <div className="mt-4 space-y-10">
        {hasil.length === 0 && (
          <div className="rounded-3xl border border-dashed border-brand/25 bg-white/60 p-8 text-center">
            <p className="text-ink/70">
              Tidak ada materi yang cocok. Coba kata kunci lain atau ubah filter.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-full bg-lavender px-5 py-2 text-sm font-semibold transition hover:bg-sun"
            >
              Reset pencarian
            </button>
          </div>
        )}

        {hasil.map((k) => {
          // Progres bab dihitung dari SEMUA materi bab itu (bukan hasil filter).
          const dariDaftar = daftar.find((d) => d.kategori === k.kategori);
          const tersedia = (dariDaftar ? dariDaftar.materi : k.materi).filter((m) => m.isi);
          const jumlahSelesai = tersedia.filter((m) => selesai.has(m.slug)).length;
          const persen = tersedia.length
            ? Math.round((jumlahSelesai / tersedia.length) * 100)
            : 0;

          return (
            <section key={k.kategori}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <h2 className="text-2xl font-bold">{k.kategori}</h2>

                {login && tersedia.length > 0 && (
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-ink/70">
                      {jumlahSelesai} dari {tersedia.length} selesai
                    </p>
                    <div
                      role="progressbar"
                      aria-label={`Progres ${k.kategori}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={persen}
                      className="h-2.5 w-28 overflow-hidden rounded-full bg-lavender"
                    >
                      <div
                        className="h-full rounded-full bg-linear-to-r from-mint to-[#4fb8a3] transition-all motion-reduce:transition-none"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {k.materi.map((m, i) => (
                  <Muncul key={m.slug} delay={(i % 3) * 100}>
                    {m.isi ? (
                      <Link href={`/materi/${m.slug}`} className="block h-full rounded-3xl">
                        <KartuMiring className="h-full">
                          <div className="flex items-start justify-between gap-2">
                            <Label tingkat={m.tingkat} />
                            <Penanda
                              selesai={selesai.has(m.slug)}
                              tersimpan={tersimpan.has(m.slug)}
                            />
                          </div>
                          <h3 className="mt-3 font-bold leading-snug">{m.judul}</h3>
                          <p className="mt-3 text-sm font-semibold text-brand transition-transform duration-200 group-hover:translate-x-1">
                            Pelajari →
                          </p>
                        </KartuMiring>
                      </Link>
                    ) : (
                      <article className="h-full rounded-3xl border border-dashed border-brand/25 bg-white/60 p-5 opacity-80">
                        <Label tingkat={m.tingkat} />
                        <h3 className="mt-3 font-bold leading-snug">{m.judul}</h3>
                        <p className="mt-3 text-sm font-semibold text-ink/60">Segera hadir</p>
                      </article>
                    )}
                  </Muncul>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}