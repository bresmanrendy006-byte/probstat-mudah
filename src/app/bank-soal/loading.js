// src/app/bank-soal/loading.js
// Kerangka halaman Bank Soal saat dimuat: meniru judul, kartu filter, dan beberapa kartu soal.

import Skeleton, { KARTU } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat bank soal">
      {/* Judul */}
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-10 w-52" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>

      {/* Kartu filter */}
      <section className={`${KARTU} space-y-4 p-5`}>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-44 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-40 rounded-full" />
        </div>
      </section>

      {/* Ringkasan */}
      <Skeleton className="h-8 w-56 rounded-full" />

      {/* Kartu soal */}
      {[0, 1, 2].map((i) => (
        <section key={i} className={`${KARTU} p-5 sm:p-6`}>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-6 w-4/5" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}