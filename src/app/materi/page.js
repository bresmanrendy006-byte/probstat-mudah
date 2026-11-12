// src/app/materi/page.js
// Server component: menyusun daftar dari data, lalu menyerahkannya ke komponen klien.

import { ambilDaftar } from "@/data/daftarBab";
import DaftarMateri from "@/components/DaftarMateri";

export const metadata = { title: "Materi | ProbStat Mudah" };

export default function Materi() {
  return <DaftarMateri daftar={ambilDaftar()} />;
}