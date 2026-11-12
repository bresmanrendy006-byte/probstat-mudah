"use client";

// src/components/DaduMain.js
import { useState } from "react";
import Teks from "./Teks";

const muka = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function DaduMain() {
  const [nilai, setNilai] = useState(2);
  const [berputar, setBerputar] = useState(false);
  const [jumlah, setJumlah] = useState(0);

  function lempar() {
    if (berputar) return;
    setBerputar(true);
    let kali = 0;
    const pewaktu = setInterval(() => {
      setNilai(Math.floor(Math.random() * 6));
      kali += 1;
      if (kali >= 10) {
        clearInterval(pewaktu);
        setBerputar(false);
        setJumlah((j) => j + 1);
      }
    }, 70);
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={lempar}
        aria-label="Lempar dadu"
        className={`select-none text-8xl leading-none transition-transform hover:scale-110 active:scale-95 ${
          berputar ? "animate-bounce" : ""
        }`}
      >
        {muka[nilai]}
      </button>
      <p className="mt-2 text-sm font-semibold">
        {berputar ? "Mengocok..." : `Muncul angka ${nilai + 1}`}
      </p>
      <p className="mt-1 text-xs text-ink/60">
        Dilempar {jumlah} kali. Peluang tiap sisi:{" "}
        <Teks>{String.raw`$\dfrac{1}{6}$`}</Teks>
      </p>
      <p className="mt-2 text-xs font-medium text-brand">Klik dadunya!</p>
    </div>
  );
}