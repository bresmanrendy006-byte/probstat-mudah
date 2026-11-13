"use client";

// src/components/Navbar.js
// Navbar pil melayang dengan efek kaca. Mengecil saat halaman digulir.
// Di layar < 1024px, menu berubah menjadi kartu yang turun di bawah pil.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TombolAkun from "@/components/TombolAkun";

const menu = [
  { nama: "Beranda", href: "/" },
  { nama: "Materi", href: "/materi" },
  { nama: "Video", href: "/video" },
  { nama: "Kalkulator", href: "/kalkulator" },
  { nama: "Dashboard", href: "/dashboard" },
];

// Beranda hanya aktif di "/"; menu lain aktif juga di halaman turunannya
// (mis. /materi/konsep-dasar-peluang menandai "Materi").
function cekAktif(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function IkonMenu({ buka }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-5"
    >
      {buka ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);
  const [kecil, setKecil] = useState(false); // true setelah halaman digulir

  useEffect(() => {
    function cek() {
      setKecil(window.scrollY > 12);
    }
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => window.removeEventListener("scroll", cek);
  }, []);

  // Tombol Esc menutup menu di layar kecil.
  useEffect(() => {
    if (!buka) return;
    function saatTekan(e) {
      if (e.key === "Escape") setBuka(false);
    }
    document.addEventListener("keydown", saatTekan);
    return () => document.removeEventListener("keydown", saatTekan);
  }, [buka]);

  return (
    // pointer-events-none: area kosong di kiri/kanan pil tidak menghalangi klik ke halaman
    <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Menu utama"
        className={`pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/80 ring-1 ring-brand/10 backdrop-blur-xl transition-all duration-300 ${
          kecil
            ? "bg-white/90 px-4 py-1.5 shadow-[0_14px_34px_-14px_rgba(43,45,91,0.4)]"
            : "bg-white/70 px-5 py-2.5 shadow-[0_8px_24px_-14px_rgba(43,45,91,0.25)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setBuka(false)}
          className="group flex items-center gap-2.5 rounded-full font-display text-xl font-bold"
        >
          <span
            className={`grid place-items-center rounded-full bg-linear-to-br from-brand to-[#9b8cf0] text-white shadow-md transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 ${
              kecil ? "size-8" : "size-9"
            }`}
          >
            σ
          </span>
          <span>
            ProbStat <span className="text-brand">Mudah</span>
          </span>
        </Link>

        {/* Tombol menu (hanya di layar kecil) */}
        <button
          type="button"
          onClick={() => setBuka(!buka)}
          aria-expanded={buka}
          aria-controls="menu-utama"
          aria-label={buka ? "Tutup menu" : "Buka menu"}
          className="grid size-10 place-items-center rounded-full bg-lavender transition hover:bg-sun lg:hidden"
        >
          <IkonMenu buka={buka} />
        </button>

        {/* Daftar menu: baris di layar lebar, kartu turun di layar kecil */}
        <ul
          id="menu-utama"
          className={`${
            buka ? "flex" : "hidden lg:flex"
          } absolute left-0 right-0 top-full mt-2 flex-col gap-1 rounded-3xl border border-brand/15 bg-white p-3 shadow-[0_20px_40px_-16px_rgba(43,45,91,0.35)] lg:static lg:mt-0 lg:flex-row lg:items-center lg:gap-1 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {menu.map((m) => {
            const aktif = cekAktif(pathname, m.href);
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  onClick={() => setBuka(false)}
                  aria-current={aktif ? "page" : undefined}
                  className={`block rounded-full px-4 py-2 text-sm font-semibold transition ${
                    aktif
                      ? "bg-brand text-white shadow-sm"
                      : "hover:bg-lavender"
                  }`}
                >
                  {m.nama}
                </Link>
              </li>
            );
          })}
          <li className="mt-1 border-t border-brand/10 pt-3 lg:ml-2 lg:mt-0 lg:border-0 lg:pt-0">
            <TombolAkun />
          </li>
        </ul>
      </nav>
    </header>
  );
}