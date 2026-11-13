"use client";

// src/components/DaduMain.js
// Dadu interaktif: klik untuk melempar. Menampilkan hasil, jumlah lemparan, dan 8 hasil terakhir.

import { useEffect, useRef, useState } from "react";
import Teks from "./Teks";

// Sel mana saja (0-8) di kotak 3x3 yang berisi titik, untuk tiap angka dadu.
const TITIK = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Dadu({ angka }) {
  return (
    <div aria-hidden="true" className="grid size-full grid-cols-3 grid-rows-3 p-4">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`m-auto size-4 rounded-full ${
            TITIK[angka].includes(i) ? "bg-ink shadow-inner" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

export default function DaduMain() {
  const [nilai, setNilai] = useState(3); // angka dadu 1-6
  const [berputar, setBerputar] = useState(false);
  const [jumlah, setJumlah] = useState(0);
  const [riwayat, setRiwayat] = useState([]); // hasil terbaru di depan
  const pewaktu = useRef(null);

  // Hentikan pengocokan bila komponen hilang dari layar.
  useEffect(() => () => clearInterval(pewaktu.current), []);

  function lempar() {
    if (berputar) return;
    setBerputar(true);
    let kali = 0;
    let akhir = nilai;
    pewaktu.current = setInterval(() => {
      akhir = Math.floor(Math.random() * 6) + 1;
      setNilai(akhir);
      kali += 1;
      if (kali >= 10) {
        clearInterval(pewaktu.current);
        setBerputar(false);
        setJumlah((j) => j + 1);
        setRiwayat((r) => [akhir, ...r].slice(0, 8));
      }
    }, 70);
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={lempar}
        aria-label="Lempar dadu"
        className={`mx-auto block size-28 select-none rounded-3xl border border-brand/20 bg-linear-to-br from-white to-lavender shadow-[0_14px_28px_-12px_rgba(43,45,91,0.45)] transition hover:scale-105 active:scale-95 ${
          berputar ? "animate-bounce" : ""
        }`}
      >
        <Dadu angka={nilai} />
      </button>

      <p aria-live="polite" className="mt-4 font-display text-lg font-bold">
        {berputar ? "Mengocok..." : `Muncul angka ${nilai}`}
      </p>
      <p className="mt-1 text-xs text-ink/70">
        Dilempar {jumlah} kali. Peluang tiap sisi:{" "}
        <Teks>{String.raw`$\dfrac{1}{6}$`}</Teks>
      </p>

      {riwayat.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs font-semibold text-ink/60">Hasil:</span>
          {riwayat.map((n, i) => (
            <span
              key={i}
              className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                i === 0 ? "bg-brand text-white" : "bg-lavender"
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold text-brand">Klik dadunya!</p>
      )}
    </div>
  );
}