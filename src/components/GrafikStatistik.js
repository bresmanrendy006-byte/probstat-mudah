"use client";

// src/components/GrafikStatistik.js
// Histogram (Chart.js) dan boxplot (SVG) untuk mode Statistika di kalkulator.

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const INK = "#2b2d5b";
const BRAND = "#5b5ed6";
const MINT = "#6fd1bb";
const LAVENDER = "#e4e4fb";
const SUN = "#ffd166";
const ROSE = "#ffc6d9";

function rapi(x) {
  return String(Math.round(x * 100) / 100);
}

// ---------- Histogram ----------

// Sturges: banyak kelas = 1 + log2(n). Minimal 3, maksimal 12.
function buatKelas(data) {
  const n = data.length;
  const lo = Math.min(...data);
  const hi = Math.max(...data);

  if (lo === hi) {
    return { label: [rapi(lo)], jumlah: [n] };
  }

  const k = Math.min(12, Math.max(3, Math.ceil(1 + Math.log2(n))));
  const lebar = (hi - lo) / k;
  const jumlah = Array(k).fill(0);
  for (const x of data) {
    const i = Math.min(k - 1, Math.floor((x - lo) / lebar));
    jumlah[i] += 1;
  }
  const label = jumlah.map((_, i) => `${rapi(lo + i * lebar)}–${rapi(lo + (i + 1) * lebar)}`);
  return { label, jumlah };
}

function Histogram({ data }) {
  const { label, jumlah } = buatKelas(data);
  const kurangiGerak =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dataGrafik = {
    labels: label,
    datasets: [
      {
        label: "Banyak data",
        data: jumlah,
        backgroundColor: MINT,
        hoverBackgroundColor: BRAND,
        borderRadius: 8,
        borderSkipped: false,
        categoryPercentage: 1,
        barPercentage: 0.92,
      },
    ],
  };

  const opsi = {
    responsive: true,
    maintainAspectRatio: false,
    animation: kurangiGerak ? false : undefined,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: INK,
        callbacks: {
          title: (items) => `Kelas ${items[0].label}`,
          label: (item) => `${item.parsed.y} data`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: INK, maxRotation: 45, minRotation: 0, font: { size: 11 } },
        title: { display: true, text: "Interval nilai", color: INK },
      },
      y: {
        beginAtZero: true,
        grid: { color: LAVENDER },
        ticks: { color: INK, precision: 0 },
        title: { display: true, text: "Frekuensi", color: INK },
      },
    },
  };

  return (
    <div
      role="img"
      aria-label={`Histogram dengan ${label.length} kelas. Frekuensi per kelas: ${jumlah.join(", ")}.`}
      className="h-64"
    >
      <Bar data={dataGrafik} options={opsi} />
    </div>
  );
}

// ---------- Boxplot (SVG) ----------

function Boxplot({ data, kuartil }) {
  const { q1, q2, q3, batasBawah, batasAtas, pencilan } = kuartil;

  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const dalam = data.filter((x) => x >= batasBawah && x <= batasAtas);
  const kumisBawah = Math.min(...dalam);
  const kumisAtas = Math.max(...dalam);

  const W = 420;
  const H = 120;
  const pad = 28;
  const y = 48; // garis tengah kotak
  const tinggi = 40;

  const x = (v) => (hi === lo ? W / 2 : pad + ((v - lo) / (hi - lo)) * (W - 2 * pad));
  const tick = hi === lo ? [lo] : [0, 1, 2, 3, 4].map((i) => lo + ((hi - lo) * i) / 4);

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[320px]"
        role="img"
        aria-label={`Boxplot. Minimum ${rapi(lo)}, Q1 ${rapi(q1)}, median ${rapi(q2)}, Q3 ${rapi(q3)}, maksimum ${rapi(hi)}. ${
          pencilan.length ? `Pencilan: ${pencilan.map(rapi).join(", ")}.` : "Tidak ada pencilan."
        }`}
      >
        {/* kumis */}
        <line x1={x(kumisBawah)} x2={x(q1)} y1={y} y2={y} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <line x1={x(q3)} x2={x(kumisAtas)} y1={y} y2={y} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <line x1={x(kumisBawah)} x2={x(kumisBawah)} y1={y - 10} y2={y + 10} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <line x1={x(kumisAtas)} x2={x(kumisAtas)} y1={y - 10} y2={y + 10} stroke={INK} strokeWidth="2" strokeLinecap="round" />

        {/* kotak Q1 sampai Q3 */}
        <rect
          x={x(q1)}
          y={y - tinggi / 2}
          width={Math.max(x(q3) - x(q1), 2)}
          height={tinggi}
          rx="8"
          fill={MINT}
          fillOpacity="0.55"
          stroke={INK}
          strokeWidth="2"
        />

        {/* median */}
        <line x1={x(q2)} x2={x(q2)} y1={y - tinggi / 2} y2={y + tinggi / 2} stroke={BRAND} strokeWidth="3.5" strokeLinecap="round" />

        {/* pencilan */}
        {pencilan.map((p, i) => (
          <circle key={i} cx={x(p)} cy={y} r="5" fill={ROSE} stroke={INK} strokeWidth="2" />
        ))}

        {/* sumbu */}
        <line x1={pad} x2={W - pad} y1={92} y2={92} stroke={LAVENDER} strokeWidth="2" />
        {tick.map((v, i) => (
          <g key={i}>
            <line x1={x(v)} x2={x(v)} y1={88} y2={96} stroke={INK} strokeWidth="1.5" />
            <text x={x(v)} y={112} textAnchor="middle" fontSize="11" fill={INK}>
              {rapi(v)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------- Gabungan ----------

export default function GrafikStatistik({ data, kuartil }) {
  return (
    <div className="mt-4 space-y-6">
      <div>
        <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">Histogram</p>
        <div className="mt-3">
          <Histogram data={data} />
        </div>
      </div>

      <div>
        <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">Boxplot</p>
        <div className="mt-3">
          <Boxplot data={data} kuartil={kuartil} />
        </div>
        <p className="mt-2 text-xs text-ink/60">
          Kotak: Q<sub>1</sub> sampai Q<sub>3</sub>. Garis ungu: median. Kumis: data terjauh dalam
          batas 1,5 × IQR. Titik merah muda: pencilan.
        </p>
      </div>
    </div>
  );
}