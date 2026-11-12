// src/app/materi/[slug]/loading.js
// Skeleton yang meniru halaman isi bab: tautan kembali, label, judul, pengertian, 2 rumus, contoh soal.

import Skeleton from "@/components/Skeleton";

const kartu = "rounded-2xl border-2 border-ink bg-white p-5 shadow-hard";

export default function LoadingIsiMateri() {
  return (
    <div role="status" aria-label="Memuat materi" className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-52" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-10 w-3/4" />

      <Skeleton className="mt-8 h-8 w-40" />
      <div className={`mt-3 space-y-3 ${kartu}`}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="mt-8 h-8 w-28" />
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className={kartu}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-12 w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-8 h-8 w-72 max-w-full" />
      <div className="mt-3 space-y-5">
        {[1, 2].map((n) => (
          <div key={n} className={kartu}>
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

      <span className="sr-only">Memuat...</span>
    </div>
  );
}