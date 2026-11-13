"use client";

// src/components/ProgresScroll.js
// Garis tipis di paling atas layar yang memanjang mengikuti seberapa jauh halaman digulir.

import { useEffect, useRef } from "react";

export default function ProgresScroll() {
  const bar = useRef(null);

  useEffect(() => {
    function ubah() {
      const h = document.documentElement;
      const maks = h.scrollHeight - h.clientHeight;
      const p = maks > 0 ? h.scrollTop / maks : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    }

    ubah();
    window.addEventListener("scroll", ubah, { passive: true });
    window.addEventListener("resize", ubah);
    return () => {
      window.removeEventListener("scroll", ubah);
      window.removeEventListener("resize", ubah);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1">
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 rounded-r-full bg-linear-to-r from-brand via-mint to-peach"
      />
    </div>
  );
}