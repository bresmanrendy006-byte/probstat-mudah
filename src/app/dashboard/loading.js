// src/app/dashboard/loading.js
// Skeleton Dashboard: sapaan, kartu progres (cincin), 2 kartu kategori, skor kuis + tersimpan.

import Skeleton from "@/components/Skeleton";

// Sama dengan kelas "kartu" di dashboard/page.js
const kartu = "rounded-xl border-2 border-ink bg-white shadow-hard";

export default function LoadingDashboard() {
  return (
    <div role="status" aria-label="Memuat dashboard" className="space-y-8">
      {/* Sapaan */}
      <div>
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="mt-3 h-5 w-52 max-w-full" />
      </div>

      {/* Progres keseluruhan */}
      <section className={`${kartu} flex flex-wrap items-center gap-8 p-6`}>
        <Skeleton className="size-36 rounded-full" />
        <div>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-8 w-64 max-w-full" />
          <Skeleton className="mt-4 h-10 w-72 max-w-full" />
        </div>
      </section>

      {/* Progres per kategori */}
      <section className="grid gap-5 md:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className={`${kartu} p-5`}>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-24" />
            <Skeleton className="mt-3 h-3 w-full rounded-full" />
          </div>
        ))}
      </section>

      {/* Skor kuis + materi tersimpan */}
      <div className="grid gap-5 md:grid-cols-2">
        <section className={`${kartu} p-5`}>
          <Skeleton className="mb-3 h-6 w-40" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-40 max-w-[70%]" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="mt-2 h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </section>

        <section className={`${kartu} p-5`}>
          <Skeleton className="mb-3 h-6 w-40" />
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 w-full" />
            ))}
          </div>
        </section>
      </div>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}