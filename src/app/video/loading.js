// src/app/video/loading.js
// Skeleton halaman Video: judul, chip bagian, lalu dua bagian berisi kartu video 16:9.

import Skeleton from "@/components/Skeleton";

function KartuVideo() {
  return (
    <div>
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="mt-3 h-5 w-4/5" />
    </div>
  );
}

function Bagian({ judul, jumlah }) {
  return (
    <section>
      <Skeleton className={`h-8 ${judul}`} />
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: jumlah }, (_, n) => (
          <KartuVideo key={n} />
        ))}
      </div>
    </section>
  );
}

export default function LoadingVideo() {
  return (
    <div role="status" aria-label="Memuat video">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="mt-2 h-6 w-56 max-w-full" />

      {/* Chip: Semua + 5 bagian */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-44 rounded-full" />
        <Skeleton className="h-10 w-64 max-w-full rounded-full" />
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-10 w-56 max-w-full rounded-full" />
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      <div className="mt-10 space-y-12">
        <Bagian judul="w-56" jumlah={6} />
        <Bagian judul="w-72 max-w-full" jumlah={3} />
      </div>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}