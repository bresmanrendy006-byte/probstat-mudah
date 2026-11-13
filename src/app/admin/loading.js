// src/app/admin/loading.js
// Skeleton Ringkasan admin (gaya datar slate, sesuai admin/page.js).
// Sidebar tidak perlu skeleton karena admin/layout.js tetap tampil.

import Skeleton from "@/components/Skeleton";

const panel = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const abu = "bg-slate-200";

export default function LoadingAdmin() {
  return (
    <div role="status" aria-label="Memuat ringkasan admin" className="space-y-6">
      {/* Judul */}
      <header>
        <Skeleton className={`h-4 w-24 ${abu}`} />
        <Skeleton className={`mt-2 h-9 w-72 max-w-full ${abu}`} />
        <Skeleton className={`mt-2 h-4 w-80 max-w-full ${abu}`} />
      </header>

      {/* 4 kartu statistik dengan garis aksen di atas */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`${panel} relative overflow-hidden p-5`}>
            <span className="absolute inset-x-0 top-0 h-1.5 bg-slate-200" />
            <Skeleton className={`h-10 w-16 ${abu}`} />
            <Skeleton className={`mt-2 h-4 w-28 ${abu}`} />
          </div>
        ))}
      </section>

      {/* Tabel pengguna */}
      <section className={`${panel} p-5`}>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className={`h-6 w-40 ${abu}`} />
          <Skeleton className={`h-6 w-16 rounded-full ${abu}`} />
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[680px]">
            {/* Kepala kolom */}
            <div className="flex gap-4 border-b border-slate-200 pb-2">
              {["w-28", "w-16", "w-32", "w-20", "w-24", "w-20"].map((w, i) => (
                <Skeleton key={i} className={`h-3 ${w} ${abu}`} />
              ))}
            </div>

            {/* Baris */}
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex items-center gap-4 border-b border-slate-100 py-3">
                <Skeleton className={`h-5 w-28 ${abu}`} />
                <Skeleton className={`h-5 w-16 rounded-full ${abu}`} />
                <Skeleton className={`h-2 w-32 rounded-full ${abu}`} />
                <Skeleton className={`h-5 w-20 ${abu}`} />
                <Skeleton className={`h-5 w-24 ${abu}`} />
                <Skeleton className={`h-5 w-20 ${abu}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <span className="sr-only">Memuat...</span>
    </div>
  );
}