// src/app/dashboard/page.js
// Dashboard pelajar: progres, skor kuis terbaru per materi, materi tersimpan, dan riwayat hitungan.

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ambilDaftar } from "@/data/daftarBab";
import RiwayatHitungan from "@/components/RiwayatHitungan";

export const metadata = { title: "Dashboard | ProbStat Mudah" };

const NILAI_LULUS = 70;
const kartu = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const warnaBilah = [
  "bg-linear-to-r from-brand to-[#9b8cf0]",
  "bg-linear-to-r from-mint to-[#4fb8a3]",
  "bg-linear-to-r from-peach to-[#ff9f7a]",
];

// Tanggal dibuat di server dengan zona WIB, supaya sama di server dan browser.
function formatTanggal(iso) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

function IkonBookmark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0 text-brand"
    >
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const id = claims.sub;

  // Filter user_id WAJIB: admin boleh membaca data semua pengguna (policy admin),
  // jadi tanpa filter ini dashboard admin akan menampilkan data orang lain.
  // Skor diambil lebih banyak (50) lalu disaring per materi di bawah,
  // supaya mengulang satu kuis tidak menghabiskan jatah materi lain.
  const [profil, progres, skor, bookmark, riwayat] = await Promise.all([
    supabase.from("profiles").select("nama").eq("id", id).maybeSingle(),
    supabase.from("progres").select("slug").eq("user_id", id),
    supabase
      .from("skor_kuis")
      .select("slug, nilai")
      .eq("user_id", id)
      .order("dibuat", { ascending: false })
      .limit(50),
    supabase
      .from("bookmark")
      .select("slug")
      .eq("user_id", id)
      .order("dibuat", { ascending: false }),
    supabase
      .from("riwayat_hitungan")
      .select("id, jenis, hasil, dibuat")
      .eq("user_id", id)
      .order("dibuat", { ascending: false })
      .order("id", { ascending: false })
      .limit(10),
  ]);
  const tabelBelumAda = [profil, progres, skor, bookmark].some((r) => r.error);

  // Riwayat: ambil dua angka hasil pertama untuk ditampilkan di daftar
  const riwayatTampil = (riwayat.data ?? []).map((r) => ({
    id: r.id,
    jenis: r.jenis,
    tanggal: formatTanggal(r.dibuat),
    ringkasan: Array.isArray(r.hasil?.ringkasan) ? r.hasil.ringkasan.slice(0, 2) : [],
  }));

  const nama = profil.data?.nama || claims.email?.split("@")[0] || "Pelajar";
  const daftar = ambilDaftar();
  const semua = daftar.flatMap((k) => k.materi);
  const judulDari = (slug) => semua.find((m) => m.slug === slug)?.judul ?? slug;

  // Satu skor TERBARU per materi.
  // Data sudah urut dari yang terbaru, jadi slug yang pertama ditemui adalah skor terbarunya.
  const terbaruPerMateri = new Map();
  for (const s of skor.data ?? []) {
    if (!terbaruPerMateri.has(s.slug)) terbaruPerMateri.set(s.slug, s);
  }
  const semuaSkorTerbaru = [...terbaruPerMateri.values()];
  const skorTerbaru = semuaSkorTerbaru.slice(0, 5);
  const rataRata = semuaSkorTerbaru.length
    ? Math.round(semuaSkorTerbaru.reduce((a, s) => a + s.nilai, 0) / semuaSkorTerbaru.length)
    : null;

  const selesaiSet = new Set((progres.data ?? []).map((p) => p.slug));
  const perKategori = daftar.map((k) => ({
    nama: k.kategori,
    total: k.materi.length,
    selesai: k.materi.filter((m) => selesaiSet.has(m.slug)).length,
  }));
  const total = semua.length;
  const selesai = perKategori.reduce((a, k) => a + k.selesai, 0);
  const persen = total ? Math.round((selesai / total) * 100) : 0;
  const keliling = 2 * Math.PI * 52;
  const berikut = semua.find((m) => m.isi && !selesaiSet.has(m.slug));
  const tersimpan = bookmark.data ?? [];

  let semangat = "Yuk mulai dari materi pertama. Pelan-pelan saja!";
  if (persen === 100) semangat = "Semua materi selesai. Hebat sekali!";
  else if (persen >= 50) semangat = "Sudah lebih dari separuh jalan, hampir sampai!";
  else if (persen > 0) semangat = "Awal yang bagus, terus lanjutkan!";

  const ringkasan = [
    { angka: tersimpan.length, label: "materi tersimpan", warna: "bg-lavender" },
    { angka: semuaSkorTerbaru.length, label: "kuis dikerjakan", warna: "bg-mint/40" },
    { angka: rataRata ?? "-", label: "rata-rata skor", warna: "bg-peach/50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Dashboard</p>
        <h1 className="mt-1 text-4xl font-bold">Halo, {nama}</h1>
        <p className="mt-1 text-ink/70">{claims.email}</p>
      </div>

      {tabelBelumAda && (
        <p className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          Data belajar belum bisa dibaca. Pastikan file skema.sql sudah dijalankan di Supabase.
        </p>
      )}

      {/* Progres keseluruhan */}
      <section className={`${kartu} flex flex-wrap items-center gap-8 p-6 sm:p-8`}>
        <div className="relative size-40 shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="cincin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5b5ed6" />
                <stop offset="100%" stopColor="#6fd1bb" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-lavender" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              stroke="url(#cincin)"
              strokeDasharray={keliling}
              strokeDashoffset={keliling * (1 - persen / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <p className="font-display text-4xl font-bold">{persen}%</p>
            <p className="text-xs font-semibold text-ink/60">selesai</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink/60">Progres keseluruhan</p>
          <p className="mt-1 text-2xl font-bold">
            {selesai} dari {total} materi selesai
          </p>
          <p className="mt-1 text-sm text-ink/70">{semangat}</p>

          {berikut ? (
            <Link
              href={`/materi/${berikut.slug}`}
              className="mt-4 inline-block rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5"
            >
              {selesai === 0 ? "Mulai belajar" : "Lanjutkan"}: {berikut.judul} →
            </Link>
          ) : (
            <p className="mt-3 inline-block rounded-full bg-mint/40 px-4 py-1.5 text-sm font-bold">
              Semua materi yang tersedia sudah selesai
            </p>
          )}
        </div>
      </section>

      {/* Tiga chip ringkasan */}
      <section aria-label="Ringkasan" className="grid grid-cols-3 gap-3 sm:gap-5">
        {ringkasan.map((r) => (
          <div key={r.label} className={`${kartu} p-4 text-center sm:p-5`}>
            <p
              className={`mx-auto grid size-12 place-items-center rounded-2xl font-display text-2xl font-bold sm:size-14 sm:text-3xl ${r.warna}`}
            >
              {r.angka}
            </p>
            <p className="mt-2 text-xs font-semibold text-ink/70 sm:text-sm">{r.label}</p>
          </div>
        ))}
      </section>

      {/* Progres per kategori */}
      <section className="grid gap-5 md:grid-cols-2">
        {perKategori.map((k, i) => {
          const p = k.total ? Math.round((k.selesai / k.total) * 100) : 0;
          return (
            <div key={k.nama} className={`${kartu} p-5`}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-bold">{k.nama}</h2>
                <span className="rounded-full bg-lavender px-2.5 py-0.5 text-xs font-bold">{p}%</span>
              </div>
              <p className="mt-1 text-sm text-ink/60">
                {k.selesai}/{k.total} materi
              </p>
              <div
                role="progressbar"
                aria-label={`Progres ${k.nama}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={p}
                className="mt-3 h-3 overflow-hidden rounded-full bg-lavender"
              >
                <div
                  className={`h-full rounded-full ${warnaBilah[i % warnaBilah.length]}`}
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Skor kuis terbaru */}
        <section className={`${kartu} p-5`}>
          <h2 className="mb-4 font-bold">Skor kuis terakhir</h2>
          {skorTerbaru.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand/25 p-5 text-center">
              <p className="text-sm text-ink/70">
                Belum ada kuis. Skor akan muncul setelah kamu mengerjakan soal.
              </p>
              <Link
                href="/materi"
                className="mt-3 inline-block rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"
              >
                Pilih materi
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {skorTerbaru.map((s) => {
                const lulus = s.nilai >= NILAI_LULUS;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/materi/${s.slug}#kuis`}
                      className="group block rounded-2xl p-2 -m-2 transition hover:bg-lavender/50"
                    >
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate font-semibold">{judulDari(s.slug)}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              lulus ? "bg-mint/40" : "bg-peach/50"
                            }`}
                          >
                            {lulus ? "Lulus" : "Belum lulus"}
                          </span>
                          <span className="font-display text-lg font-bold">{s.nilai}</span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavender">
                        <div
                          className={`h-full rounded-full ${
                            lulus
                              ? "bg-linear-to-r from-mint to-[#4fb8a3]"
                              : "bg-linear-to-r from-peach to-[#ff9f7a]"
                          }`}
                          style={{ width: `${s.nilai}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Materi tersimpan */}
        <section className={`${kartu} p-5`}>
          <h2 className="mb-4 font-bold">Materi tersimpan</h2>
          {tersimpan.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand/25 p-5 text-center">
              <p className="text-sm text-ink/70">
                Belum ada materi yang disimpan. Tekan tombol Simpan di halaman materi.
              </p>
              <Link
                href="/materi"
                className="mt-3 inline-block rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"
              >
                Jelajahi materi
              </Link>
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {tersimpan.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/materi/${b.slug}`}
                    className="flex items-center gap-3 rounded-full bg-lavender/60 px-4 py-2.5 font-semibold transition hover:bg-sun/60"
                  >
                    <IkonBookmark />
                    <span className="min-w-0 truncate">{judulDari(b.slug)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Riwayat hitungan */}
      <section className={`${kartu} p-5 sm:p-6`}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold">Riwayat hitungan</h2>
          <p className="text-xs text-ink/60">10 terbaru dari maksimal 50 yang tersimpan</p>
        </div>
        {riwayat.error ? (
          <p role="alert" className="rounded-2xl bg-rose/40 px-4 py-3 text-sm font-semibold">
            Riwayat belum bisa dibaca. Coba muat ulang halaman.
          </p>
        ) : (
          <RiwayatHitungan awal={riwayatTampil} userId={id} />
        )}
      </section>
    </div>
  );
}