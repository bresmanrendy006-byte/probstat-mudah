"use client";

// src/components/KartuMiring.js
import { useRef } from "react";

export default function KartuMiring({ children, className = "", maks = 8 }) {
  const ref = useRef(null);

  function gerak(e) {
    if (e.pointerType !== "mouse") return;
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
      className={`group relative overflow-hidden rounded-2xl border-2 border-ink bg-white p-5 shadow-hard transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(245,184,46,0.28), transparent 55%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}