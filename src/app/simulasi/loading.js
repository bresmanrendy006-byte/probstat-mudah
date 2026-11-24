// src/app/simulasi/loading.js
import Skeleton, { KARTU } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat simulasi">
      <div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-64" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <section key={i} className={`${KARTU} p-6`}>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-5 h-10 w-48 rounded-full" />
            <Skeleton className="mt-5 h-16 w-full rounded-2xl" />
          </section>
        ))}
      </div>
    </div>
  );
}