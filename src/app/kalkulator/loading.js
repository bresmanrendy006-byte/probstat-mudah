// src/app/kalkulator/loading.js
// Skeleton Kalkulator: judul, 3 tombol mode, kartu input + hasil, kartu langkah + grafik.

import Skeleton from "@/components/Skeleton";

const kartu = "rounded-xl border-2 border-ink bg-white p-5 shadow-hard";

export default function LoadingKalkulator() {
  return (
    <div role="status" aria-label="Memuat kalkulator">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-3 h-5 w-72 max-w-full" />

      {/* Tombol mode */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      {/* Input + Hasil */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className={kartu}>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-56 max-w-full" />
          <Skeleton className="mt-3 h-32 w-full" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-11 w-24" />
            <Skeleton className="h-11 w-32" />
          </div>
        </section>

        <section className={kartu}>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="mt-3 h-4 w-3/4" />
        </section>
      </div>

      {/* Langkah + Grafik */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className={kartu}>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-3 h-4 w-2/3" />
        </section>

        <section className={kartu}>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-3 h-40 w-full" />
        </section>
      </div>

      <Skeleton className="mt-6 h-4 w-full max-w-xl" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}