// src/components/Skeleton.js
// Kotak pastel berkilau sebagai pengganti konten yang sedang dimuat.
// Atur ukurannya lewat className, contoh: <Skeleton className="h-6 w-40" />
// Di atas latar gelap, tambahkan prop gelap: <Skeleton gelap className="h-6 w-40" />

// Gaya kartu yang sama dengan kartu di halaman asli (dipakai file loading.js).
export const KARTU = "rounded-2xl border-2 border-ink bg-white shadow-hard";

export default function Skeleton({ className = "", gelap = false }) {
  // Bila className sudah menentukan sudut (mis. rounded-full), jangan tambah rounded-xl
  // supaya keduanya tidak saling bertabrakan.
  const bentuk = className.includes("rounded") ? "" : "rounded-xl";

  return (
    <div
      aria-hidden="true"
      className={`skeleton ${gelap ? "skeleton-gelap" : ""} ${bentuk} ${className}`}
    />
  );
}