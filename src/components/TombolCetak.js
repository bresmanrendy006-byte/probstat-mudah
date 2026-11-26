"use client";

// src/components/TombolCetak.js
// Membuka jendela cetak browser. Dari sana pilih "Simpan sebagai PDF".

export default function TombolCetak() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5"
    >
      Cetak / Simpan PDF
    </button>
  );
}