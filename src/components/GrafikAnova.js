"use client";

// src/components/GrafikAnova.js
// Boxplot tiap kelompok berdampingan (SVG), dengan penanda rata-rata.

const INK = "#2b2d5b";
const BRAND = "#5b5ed6";
const SUN = "#ffd166";
const LAVENDER = "#e4e4fb";
const ROSE = "#ffc6d9";
const WARNA = ["#6fd1bb", "#c9c9f2", "#ffc9a8", "#ffc6d9", "#ffe19a"];

function rapi(x, d = 2) {
  const k = 10 ** d;
  return String(Math.round(x * k) / k);
}

function tandai(lo, hi, banyak = 5) {
  return Array.from({ length: banyak }, (_, i) => lo + ((hi - lo) * i) / (banyak - 1));
}

export default function GrafikAnova({ grafik }) {
  const { kelompok } = grafik;

  const semua = kelompok.flatMap((g) => g.data);
  const lo = Math.min(...semua);
  const hi = Math.max(...semua);
  const pad = (hi - lo) * 0.08 || 1;
  const y0 = lo - pad;
  const y1 = hi + pad;

  const W = 420;
  const H = 280;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 42;

  const sy = (v) => H - padB - ((v - y0) / (y1 - y0)) * (H - padT - padB);
  const slot = (W - padL - padR) / kelompok.length;
  const cx = (i) => padL + slot * (i + 0.5);
  const lebar = Math.min(56, slot * 0.55);
  const tickY = tandai(y0, y1);

  return (
    <div className="mt-4">
      <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">
        Boxplot per kelompok
      </p>
      <div className="mt-3 overflow-x-auto overflow-y-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[320px]"
          role="img"
          aria-label={`Boxplot ${kelompok.length} kelompok. ${kelompok
            .map((g) => `Kelompok ${g.nama}: median ${rapi(g.q2)}, rata-rata ${rapi(g.mean)}`)
            .join(". ")}.`}
        >
          {/* garis bantu dan sumbu Y */}
          {tickY.map((v, i) => (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={sy(v)} y2={sy(v)} stroke={LAVENDER} strokeWidth="1.5" />
              <line x1={padL - 5} x2={padL} y1={sy(v)} y2={sy(v)} stroke={INK} strokeWidth="1.5" />
              <text x={padL - 9} y={sy(v) + 4} textAnchor="end" fontSize="11" fill={INK}>
                {rapi(v)}
              </text>
            </g>
          ))}
          <line x1={padL} x2={padL} y1={padT} y2={H - padB} stroke={INK} strokeWidth="1.5" />
          <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke={INK} strokeWidth="1.5" />

          {kelompok.map((g, i) => {
            const x = cx(i);
            const kiri = x - lebar / 2;
            const kanan = x + lebar / 2;
            const tinggiKotak = Math.max(sy(g.q1) - sy(g.q3), 2);
            const m = sy(g.mean);
            return (
              <g key={g.nama}>
                {/* kumis */}
                <line x1={x} x2={x} y1={sy(g.kumisAtas)} y2={sy(g.q3)} stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1={x} x2={x} y1={sy(g.q1)} y2={sy(g.kumisBawah)} stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1={x - lebar / 4} x2={x + lebar / 4} y1={sy(g.kumisAtas)} y2={sy(g.kumisAtas)} stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1={x - lebar / 4} x2={x + lebar / 4} y1={sy(g.kumisBawah)} y2={sy(g.kumisBawah)} stroke={INK} strokeWidth="2" strokeLinecap="round" />

                {/* kotak */}
                <rect
                  x={kiri}
                  y={sy(g.q3)}
                  width={lebar}
                  height={tinggiKotak}
                  rx="6"
                  fill={WARNA[i % WARNA.length]}
                  fillOpacity="0.75"
                  stroke={INK}
                  strokeWidth="2"
                />

                {/* median */}
                <line x1={kiri} x2={kanan} y1={sy(g.q2)} y2={sy(g.q2)} stroke={BRAND} strokeWidth="3.5" strokeLinecap="round" />

                {/* pencilan */}
                {g.pencilan.map((p, j) => (
                  <circle key={j} cx={x} cy={sy(p)} r="4.5" fill={ROSE} stroke={INK} strokeWidth="1.8" />
                ))}

                {/* rata-rata (belah ketupat) */}
                <polygon
                  points={`${x},${m - 6} ${x + 6},${m} ${x},${m + 6} ${x - 6},${m}`}
                  fill={SUN}
                  stroke={INK}
                  strokeWidth="1.8"
                >
                  <title>{`Rata-rata ${g.nama}: ${rapi(g.mean)}`}</title>
                </polygon>

                <text x={x} y={H - padB + 19} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>
                  {g.nama}
                </text>
              </g>
            );
          })}

          <text x={(padL + W - padR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>
            Kelompok
          </text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink/60">
        Kotak: Q<sub>1</sub> sampai Q<sub>3</sub>. Garis ungu: median. Belah ketupat kuning: rata-rata.
        Titik merah muda: pencilan. Makin sedikit kotak yang saling tumpang tindih secara vertikal, makin
        besar kemungkinan rata-rata kelompok berbeda.
      </p>
    </div>
  );
}