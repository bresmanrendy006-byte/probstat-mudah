"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { nama: "Beranda", href: "/" },
  { nama: "Materi", href: "/materi" },
  { nama: "Video", href: "/video" },
  { nama: "Kalkulator", href: "/kalkulator" },
  { nama: "Dashboard", href: "/dashboard" },
];

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

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-ink backdrop-blur transition-all duration-300 ${
        kecil
          ? "bg-white/95 shadow-[0_4px_0_0_rgba(31,35,80,0.12)]"
          : "bg-white/80"
      }`}
    >
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between px-4 transition-all duration-300 ${
          kecil ? "py-1.5" : "py-3"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2 font-display text-xl font-bold">
          <span
            className={`grid place-items-center rounded-lg bg-brand text-white border-2 border-ink shadow-hard transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 ${
              kecil ? "size-8" : "size-9"
            }`}
          >
            σ
          </span>
          ProbStat Mudah
        </Link>

        <button
          type="button"
          onClick={() => setBuka(!buka)}
          className="md:hidden px-3 py-2 border-2 border-ink rounded-lg font-semibold"
          aria-expanded={buka}
        >
          {buka ? "Tutup" : "Menu"}
        </button>

        <ul
          className={`${buka ? "flex" : "hidden"} md:flex absolute md:static top-full left-0 right-0 flex-col md:flex-row items-stretch md:items-center gap-1 bg-white md:bg-transparent border-b-2 md:border-0 border-ink p-4 md:p-0`}
        >
          {menu.map((m) => {
            const aktif = pathname === m.href;
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  onClick={() => setBuka(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition hover:-translate-y-0.5 ${
                    aktif ? "bg-sun" : "hover:bg-ink/5"
                  }`}
                >
                  {m.nama}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/login"
              onClick={() => setBuka(false)}
              className="block md:ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white border-2 border-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}