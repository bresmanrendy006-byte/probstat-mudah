// src/app/loading.js
// Otomatis tampil saat halaman apa pun sedang dimuat.

import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Memuat halaman"
      className="mx-auto max-w-6xl px-4 py-10"
    >
      {/* Judul dan sub-judul */}
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />

      {/* Deretan kartu */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard"
          >
            <Skeleton className="h-32 w-full" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>

      <span className="sr-only">Memuat...</span>
    </main>
  );
}   