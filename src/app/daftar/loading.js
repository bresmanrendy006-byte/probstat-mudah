// src/app/daftar/loading.js
// Skeleton Daftar: sama dengan form asli (4 kolom, syarat sandi, centang, tombol, tautan).

import Skeleton from "@/components/Skeleton";

function KolomSkeleton({ label = "w-24", tombol = false, syarat = false }) {
  return (
    <div>
      <Skeleton className={`h-5 ${label}`} />
      <div className="mt-1 flex gap-2">
        <Skeleton className="h-11 w-full" />
        {tombol && <Skeleton className="h-11 w-20 shrink-0" />}
      </div>
      {syarat && (
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      )}
    </div>
  );
}

export default function LoadingDaftar() {
  return (
    <div role="status" aria-label="Memuat formulir" className="mx-auto max-w-md">
      <Skeleton className="h-10 w-36" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-3/4" />

      <div className="mt-6 space-y-4 rounded-xl border-2 border-ink bg-white p-5 shadow-hard">
        <KolomSkeleton label="w-14" />
        <KolomSkeleton label="w-16" />
        <KolomSkeleton label="w-28" tombol syarat />
        <KolomSkeleton label="w-40" />

        <div className="flex items-start gap-2">
          <Skeleton className="mt-0.5 size-4 shrink-0" />
          <Skeleton className="h-4 w-full" />
        </div>

        <Skeleton className="h-11 w-full" />
      </div>

      <Skeleton className="mx-auto mt-5 h-4 w-56" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}   