// src/app/glosarium/loading.js
// Kerangka halaman Glosarium saat dimuat.

import Skeleton, { KARTU } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat glosarium">
      <div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-44" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <section className={`${KARTU} space-y-4 p-5`}>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <section key={i} className={`${KARTU} p-5`}>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </section>
        ))}
      </div>
    </div>
  );
}