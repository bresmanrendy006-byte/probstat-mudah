// src/app/loading.js
// Skeleton Beranda: urutan dan bentuknya sama dengan page.js (hero, 3 kartu fitur, kotak gelap).

import Skeleton from "@/components/Skeleton";

export default function LoadingBeranda() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman"
      className="space-y-16"
    >
      {/* Hero */}
      <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <div>
          <Skeleton className="h-8 w-60 rounded-full" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-12 w-full md:h-14" />
            <Skeleton className="h-12 w-5/6 md:h-14" />
            <Skeleton className="h-12 w-2/3 md:h-14" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-full max-w-lg" />
            <Skeleton className="h-5 w-4/5 max-w-lg" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-40" />
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-14 w-28" />
            ))}
          </div>
        </div>

        {/* Kartu dadu */}
        <div className="mx-auto w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-8 shadow-hard">
          <Skeleton className="mx-auto h-5 w-40" />
          <Skeleton className="mx-auto mt-4 size-24" />
          <Skeleton className="mx-auto mt-3 h-4 w-32" />
          <Skeleton className="mx-auto mt-2 h-3 w-48" />
        </div>
      </section>

      {/* Tiga kartu fitur */}
      <section>
        <Skeleton className="h-9 w-72" />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard"
            >
              <Skeleton className="size-10" />
              <Skeleton className="mt-4 h-6 w-1/2" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-4 h-4 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Kotak gelap "Mulai dari mana?" */}
      <section className="rounded-2xl border-2 border-ink bg-ink p-8">
        <div className="h-7 w-48 animate-pulse rounded-xl bg-white/25" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-xl bg-white p-5">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}