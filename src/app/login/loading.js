// src/app/login/loading.js
// Skeleton Login: logo, judul, subjudul, pilihan Masuk/Daftar, 2 kolom, tombol, kalimat kecil.

import Skeleton, { KARTU } from "@/components/Skeleton";

export default function LoadingLogin() {
  return (
    <div role="status" aria-label="Memuat halaman masuk" className="mx-auto mt-4 max-w-md">
      <div className={`${KARTU} p-6 sm:p-8`}>
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="mt-4 h-9 w-28" />
        <Skeleton className="mt-2 h-5 w-3/4" />

        {/* Pilihan Masuk / Daftar */}
        <Skeleton className="mt-5 h-11 w-full rounded-full" />

        <div className="mt-5 space-y-5">
          <div>
            <Skeleton className="h-5 w-12" />
            <Skeleton className="mt-1.5 h-[50px] w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-1.5 h-[50px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>

      <Skeleton className="mx-auto mt-4 h-5 w-4/5" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}