"use client";

// src/components/TombolSelesaiVideo.js
// Tombol kecil untuk menandai / membatalkan materi selesai dari halaman /video.

export default function TombolSelesaiVideo({ selesai, sibuk, onKlik }) {
  return (
    <button
      type="button"
      onClick={onKlik}
      disabled={sibuk}
      aria-pressed={selesai}
      className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        selesai
          ? "bg-mint/40 hover:bg-mint/60"
          : "border border-brand/20 bg-white hover:bg-sun/50"
      }`}
    >
      <span aria-hidden="true">{selesai ? "✓" : "○"}</span>
      {sibuk ? "Menyimpan..." : selesai ? "Materi selesai" : "Tandai materi selesai"}
    </button>
  );
}