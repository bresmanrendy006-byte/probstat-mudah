// src/app/glosarium/page.js
// Server component: menyiapkan data istilah dan judul materi untuk komponen klien.

import { ambilDaftar } from "@/data/daftarBab";
import { glosarium } from "@/data/glosarium";
import Glosarium from "@/components/Glosarium";

export const metadata = { title: "Glosarium | ProbStat Mudah" };

export default function GlosariumHalaman() {
  const semua = ambilDaftar().flatMap((k) => k.materi);
  const judul = Object.fromEntries(semua.map((m) => [m.slug, m.judul]));
  const kategori = ambilDaftar().map((k) => k.kategori);
  const urut = [...glosarium].sort((a, b) =>
    a.istilah.replace(/[^\p{L}\p{N}]/gu, "").localeCompare(b.istilah.replace(/[^\p{L}\p{N}]/gu, ""), "id")
  );
  return <Glosarium istilah={urut} judul={judul} kategori={kategori} />;
}