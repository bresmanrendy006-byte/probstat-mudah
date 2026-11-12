// src/data/daftarBab.js
// Hanya menyimpan URUTAN materi. Judul, tingkat, dan status "isi" diambil otomatis dari materi.js.
//
// - Materi yang sudah ditulis di materi.js: cukup tulis slug-nya (string).
// - Materi yang belum ditulis: tulis objek { slug, judul, tingkat } -> tampil "Segera hadir".
// Kalau nanti materinya sudah ditulis di materi.js, ubah objeknya jadi slug saja.

import { cariMateri } from "./materi";

const susunan = [
  {
    kategori: "Probabilitas",
    materi: [
      "konsep-dasar-peluang",
      "peluang-suatu-kejadian",
      "aturan-penjumlahan",
      "peluang-bersyarat",
      "aturan-perkalian",
      { slug: "teorema-bayes", judul: "Teorema Bayes", tingkat: "Mahasiswa" },
    ],
  },
  {
    kategori: "Statistika Dasar",
    materi: [
      { slug: "pengertian-statistika", judul: "Pengertian statistika dan statistik", tingkat: "SMA" },
      { slug: "jenis-data-dan-skala", judul: "Jenis data dan skala pengukuran", tingkat: "SMA" },
      { slug: "ukuran-pemusatan", judul: "Ukuran pemusatan", tingkat: "SMA" },
      { slug: "ukuran-penyebaran", judul: "Ukuran penyebaran", tingkat: "Mahasiswa" },
      { slug: "input-data-spss", judul: "Input data ke SPSS", tingkat: "Mahasiswa" },
    ],
  },
];

export function ambilDaftar() {
  return susunan.map((k) => ({
    kategori: k.kategori,
    materi: k.materi.map((item) => {
      const slug = typeof item === "string" ? item : item.slug;
      const m = cariMateri(slug);
      if (m) return { slug, judul: m.judul, tingkat: m.tingkat, isi: true };
      // slug string tapi tidak ketemu di materi.js: kemungkinan salah ketik, judulnya jadi slug
      if (typeof item === "string") return { slug, judul: slug, tingkat: "SMA", isi: false };
      return { ...item, isi: false };
    }),
  }));
}