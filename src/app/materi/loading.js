// src/app/materi/loading.js
// Skeleton daftar Materi: judul, kolom cari + 3 tombol filter, 2 kategori berisi kartu bab (6 dan 5).
// Halaman isi bab punya skeleton sendiri di materi/[slug]/loading.js.

import Skeleton from "@/components/Skeleton";

function KartuBab() {
  return (
    <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-20" />
    </div>
  );
}

function Kategori({ judul, jumlah }) {
  return (
    <section>
      <Skeleton className={`mb-4 h-8 ${judul}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: jumlah }, (_, n) => (
          <KartuBab key={n} />
        ))}
      </div>
    </section>
  );
}

export default function LoadingMateri() {
  return (
    <div role="status" aria-label="Memuat materi">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="mt-3 h-5 w-64 max-w-full" />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-[46px] min-w-48 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <Kategori judul="w-40" jumlah={6} />
        <Kategori judul="w-48" jumlah={5} />
      </div>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}