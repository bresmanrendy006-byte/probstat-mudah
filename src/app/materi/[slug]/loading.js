// src/app/materi/[slug]/loading.js
// Skeleton halaman isi bab: tombol kembali, label, judul, kartu aksi, menu loncat,
// pengertian, rumus, contoh soal, navigasi sebelum/berikutnya, dan kotak kalkulator.

import Skeleton, { KARTU } from "@/components/Skeleton";

export default function LoadingIsiMateri() {
  return (
    <div role="status" aria-label="Memuat materi" className="mx-auto max-w-3xl">
      <Skeleton className="h-10 w-60 max-w-full" />

      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-10 w-3/4" />

      {/* Kartu aksi (Tandai selesai + Simpan), tingginya sama dengan AksiMateri */}
      <Skeleton className="mt-5 h-[116px] w-full rounded-2xl sm:h-[104px]" />

      {/* Menu loncat */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-14 rounded-full" />
      </div>

      {/* Pengertian */}
      <Skeleton className="mt-8 h-8 w-40" />
      <div className={`${KARTU} mt-3 space-y-3 p-5`}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Rumus */}
      <Skeleton className="mt-8 h-8 w-28" />
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className={`${KARTU} p-5`}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-12 w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Contoh soal */}
      <Skeleton className="mt-8 h-8 w-72 max-w-full" />
      <div className="mt-3 space-y-5">
        {[1, 2].map((n) => (
          <div key={n} className={`${KARTU} p-5`}>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="mt-3 h-6 w-full" />
            <Skeleton className="mt-4 h-4 w-20" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-4 h-4 w-20" />
            <Skeleton className="mt-2 h-10 w-full" />
            <Skeleton className="mt-4 h-4 w-36" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-4 h-14 w-full" />
          </div>
        ))}
      </div>

      {/* Sebelumnya / Berikutnya */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className={`${KARTU} p-4`}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-5 w-2/3" />
          </div>
        ))}
      </div>

      {/* Kotak gelap kalkulator */}
      <div className="mt-8 rounded-2xl border-2 border-ink bg-ink p-6">
        <Skeleton gelap className="h-5 w-48" />
        <Skeleton gelap className="mt-3 h-11 w-40" />
      </div>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}