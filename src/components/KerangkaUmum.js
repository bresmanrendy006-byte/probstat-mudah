"use client";

// src/components/KerangkaUmum.js
// Membungkus tampilan situs umum (navbar, latar, footer).
// Di halaman /admin, semuanya disembunyikan karena admin punya tampilan sendiri.

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import LatarBelakang from "@/components/LatarBelakang";
import ProgresScroll from "@/components/ProgresScroll";

const tautanFooter = [
  { href: "/", nama: "Beranda" },
  { href: "/materi", nama: "Materi" },
  { href: "/bank-soal", nama: "Bank Soal" },
  { href: "/glosarium", nama: "Glosarium" },
  { href: "/simulasi", nama: "Simulasi" },
  { href: "/video", nama: "Video" },
  { href: "/kalkulator", nama: "Kalkulator" },
];

const tautanLegal = [
  { href: "/privasi", nama: "Kebijakan Privasi" },
  { href: "/syarat", nama: "Syarat Layanan" },
];

export default function KerangkaUmum({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Tampil hanya saat ditekan Tab: lompat langsung ke isi halaman */}
      <a
        href="#konten"
        className="sr-only rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]"
      >
        Lewati ke konten
      </a>

      <LatarBelakang />
      <ProgresScroll />
      <Navbar />

      <main
        id="konten"
        className="mx-auto w-full max-w-6xl flex-1 overflow-x-clip px-4 py-10"
      >
        {children}
      </main>

      <footer className="border-t border-brand/15 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold">
              ProbStat <span className="text-brand">Mudah</span>
            </p>
            <p className="mt-0.5 text-sm text-ink/70">
              Belajar peluang dan statistika dengan santai.
            </p>
          </div>

          <nav aria-label="Tautan footer" className="flex flex-wrap gap-2">
            {tautanFooter.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-full bg-lavender px-3.5 py-1.5 text-sm font-semibold transition hover:bg-sun"
              >
                {t.nama}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 border-t border-brand/10 px-4 py-3 text-xs text-ink/60">
          <nav aria-label="Tautan legal" className="flex flex-wrap gap-x-5 gap-y-1">
            {tautanLegal.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="font-semibold underline-offset-2 transition hover:text-brand hover:underline"
              >
                {t.nama}
              </Link>
            ))}
          </nav>
          <span>© 2026 ProbStat Mudah</span>
        </div>
      </footer>
    </div>
  );
}