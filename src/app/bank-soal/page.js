// src/app/bank-soal/page.js
// Server component: menyiapkan filter (kategori dan materi) dan semua soal untuk komponen klien.

import { ambilDaftar } from "@/data/daftarBab";
import { bankSoal } from "@/data/soal";
import BankSoal from "@/components/BankSoal";

export const metadata = { title: "Bank Soal | ProbStat Mudah" };

export default function BankSoalHalaman() {
  // Hanya slug dan judul yang dikirim ke klien (isi materi tidak perlu)
  const daftar = ambilDaftar().map((k) => ({
    kategori: k.kategori,
    materi: k.materi.map((m) => ({ slug: m.slug, judul: m.judul })),
  }));
  return <BankSoal daftar={daftar} soal={bankSoal} />;
}