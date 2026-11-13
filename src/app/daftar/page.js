import { redirect } from "next/navigation";

export const metadata = { title: "Daftar | ProbStat Mudah" };

// Pendaftaran asli ada di halaman login (tab Daftar), jadi /daftar langsung diarahkan ke sana.
export default function Daftar() {
  redirect("/login?mode=daftar");
}