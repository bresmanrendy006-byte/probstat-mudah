"use client";

// src/components/KartuMiring.js
// Kartu yang sedikit miring mengikuti kursor (hanya mouse) + kilau lembut di bawah kursor.
// Dipakai di Beranda dan daftar materi. Efek miring mati bila pengguna memilih reduced-motion.

import { useRef } from "react";

export default function KartuMiring({ children, className = "", maks = 8 }) {
  const ref = useRef(null);

  function gerak(e) {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * maks}deg) rotateY(${x * maks}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }

  function keluar() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={gerak}
      onPointerLeave={keluar}
      className={`group relative overflow-hidden rounded-3xl border border-brand/10 bg-white p-5 shadow-hard transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-[0_22px_44px_-16px_rgba(43,45,91,0.4)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,201,168,0.45), transparent 55%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}