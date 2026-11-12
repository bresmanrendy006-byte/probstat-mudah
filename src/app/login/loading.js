// src/app/login/loading.js
// Skeleton Login: strukturnya meniru login/page.js
// (logo, judul, subjudul, 2 kolom, tombol Masuk, pemisah "atau", tombol Google,
//  tautan daftar di dalam kartu, lalu kalimat kecil di bawah kartu).

import Skeleton from "@/components/Skeleton";

export default function LoadingLogin() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman masuk"
      className="mx-auto mt-4 max-w-md"
    >
      <div className="rounded-2xl border-2 border-ink bg-white p-7 shadow-hard">
        {/* Logo, judul, subjudul */}
        <Skeleton className="size-11" />
        <Skeleton className="mt-4 h-9 w-28" />
        <Skeleton className="mt-2 h-4 w-3/4" />

        <div className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-1 h-[46px] w-full" />
          </div>

          {/* Kata sandi */}
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-1 h-[46px] w-full" />
          </div>

          {/* Tombol Masuk */}
          <Skeleton className="h-12 w-full" />

          {/* Pemisah "atau" */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-px flex-1 rounded-none" />
            <Skeleton className="h-3 w-7" />
            <Skeleton className="h-px flex-1 rounded-none" />
          </div>

          {/* Tombol Google */}
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Tautan daftar (di dalam kartu) */}
        <Skeleton className="mx-auto mt-5 h-4 w-52" />
      </div>

      {/* Kalimat kecil di bawah kartu */}
      <Skeleton className="mx-auto mt-4 h-4 w-4/5" />

      <span className="sr-only">Memuat...</span>
    </div>
  );
}