"use client";

// src/components/ProgresScroll.js
import { useEffect, useRef } from "react";

export default function ProgresScroll() {
  const bar = useRef(null);

  useEffect(() => {
    function ubah() {
      const h = document.documentElement;
      const maks = h.scrollHeight - h.clientHeight;
      const p = maks > 0 ? h.scrollTop / maks : 0;
      if (bar.current) bar.current.style.width = `${p * 100}%`;
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
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1.5">
      <div
        ref={bar}
        className="h-full w-0 bg-gradient-to-r from-brand via-mint to-sun"
      />
    </div>
  );
}