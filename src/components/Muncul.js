"use client";

// src/components/Muncul.js
// Pakai: <Muncul delay={150}>...isi...</Muncul>  (delay dalam milidetik)
import { useEffect, useRef, useState } from "react";

export default function Muncul({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pengamat = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTampil(true);
          pengamat.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        tampil ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}