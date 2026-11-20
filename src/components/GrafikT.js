"use client";

// src/components/GrafikT.js
// Kurva distribusi t (SVG): daerah penolakan diarsir, garis tegak = nilai t hitung.

import { kerapatanT } from "@/lib/uji";

const INK = "#2b2d5b";
const BRAND = "#5b5ed6";
const ROSE = "#ff8fb4";

function rapi(x, d = 2) {
  const k = 10 ** d;
  return String(Math.round(x * k) / k);
}

export default function GrafikT({ grafik }) {
  const { df, t, tKritis, alpha } = grafik;

  const R = Math.max(4, Math.abs(t) + 0.8); // rentang sumbu: -R sampai R
  const W = 420;
  const H = 200;
  const pad = 24;
  const dasar = 160;
  const tinggi = 115;

  const puncak = kerapatanT(0, df);
  const sx = (v) => pad + ((v + R) / (2 * R)) * (W - 2 * pad);
  const sy = (y) => dasar - (y / puncak) * tinggi;

  const N = 160;
  const kurva = Array.from({ length: N + 1 }, (_, i) => {
    const v = -R + (2 * R * i) / N;
    return `${i ? "L" : "M"}${sx(v).toFixed(1)} ${sy(kerapatanT(v, df)).toFixed(1)}`;
  }).join(" ");

  function daerah(a, b) {
    const M = 60;
    const pts = Array.from({ length: M + 1 }, (_, i) => {
      const v = a + ((b - a) * i) / M;
      return `L${sx(v).toFixed(1)} ${sy(kerapatanT(v, df)).toFixed(1)}`;
    }).join(" ");
    return `M${sx(a).toFixed(1)} ${dasar} ${pts} L${sx(b).toFixed(1)} ${dasar} Z`;
  }

  const adaDaerah = tKritis < R;
  const langkahTick = R <= 5 ? 1 : R <= 10 ? 2 : 5;
  const batas = Math.floor(R / langkahTick) * langkahTick;
  const tick = [];
  for (let v = -batas; v <= batas; v += langkahTick) tick.push(v);

  const posT = sx(t);
  const geserKanan = t > 0;

  return (
    <div className="mt-4">
      <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">
        Kurva distribusi t (db = {rapi(df)})
      </p>
      <div className="mt-3 overflow-x-auto overflow-y-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[320px]"
          role="img"
          aria-label={`Kurva distribusi t dengan derajat bebas ${rapi(df)}. Nilai t hitung ${rapi(t)}. Nilai kritis plus minus ${rapi(tKritis)}. Daerah penolakan diarsir.`}
        >
          {adaDaerah && (
            <>
              <path d={daerah(-R, -tKritis)} fill={ROSE} fillOpacity="0.55" />
              <path d={daerah(tKritis, R)} fill={ROSE} fillOpacity="0.55" />
            </>
          )}
          <path d={kurva} fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinejoin="round" />
          <line x1={pad} x2={W - pad} y1={dasar} y2={dasar} stroke={INK} strokeWidth="1.5" />

          {/* garis nilai t hitung */}
          <line x1={posT} x2={posT} y1={26} y2={dasar} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <text
            x={posT + (geserKanan ? -6 : 6)}
            y={20}
            textAnchor={geserKanan ? "end" : "start"}
            fontSize="12"
            fontWeight="700"
            fill={INK}
          >
            t = {rapi(t)}
          </text>

          {tick.map((v, i) => (
            <g key={i}>
              <line x1={sx(v)} x2={sx(v)} y1={dasar} y2={dasar + 5} stroke={INK} strokeWidth="1.5" />
              <text x={sx(v)} y={dasar + 20} textAnchor="middle" fontSize="11" fill={INK}>
                {v}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink/60">
        Garis tegak: nilai t hitung. Daerah merah muda: daerah penolakan H<sub>0</sub> (di luar ±
        {rapi(tKritis, 3)}, total peluang α = {rapi(alpha)}). Bila garis jatuh di daerah merah muda,
        H<sub>0</sub> ditolak.
        {!adaDaerah && " Nilai kritis di luar rentang gambar, jadi daerah penolakan tidak terlihat."}
      </p>
    </div>
  );
}