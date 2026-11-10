// src/components/Skeleton.js
// Kotak abu-abu berkedip sebagai pengganti konten yang sedang dimuat.
// Atur ukurannya lewat className, contoh: <Skeleton className="h-6 w-40" />

export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-ink/10 ${className}`}
    />
  );
}