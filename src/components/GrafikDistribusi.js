"use client";

// src/components/GrafikDistribusi.js
// Grafik distribusi: batang (binomial, Poisson) dengan Chart.js, dan kurva normal dengan SVG.

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
const BATANG_ATAS = "#c9c9f2";

function rapi(x, d = 2) {
  const k = 10 ** d;
  return String(Math.round(x * k) / k);
}

// ---------- Batang (diskrit) ----------

function Diskrit({ grafik }) {
  const { titik, k, judul } = grafik;
  const kurangiGerak =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const warna = titik.map((d) => (d.x === k ? BRAND : d.x < k ? MINT : BATANG_ATAS));

  const data = {
    labels: titik.map((d) => String(d.x)),
    datasets: [
      {
        label: "Peluang",
        data: titik.map((d) => d.p),
        backgroundColor: warna,
        borderRadius: 6,
        borderSkipped: false,
        categoryPercentage: 1,
        barPercentage: 0.85,
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
          title: (items) => `X = ${items[0].label}`,
          label: (item) => `P(X = ${item.label}) = ${rapi(item.parsed.y, 4)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: INK, font: { size: 11 }, maxRotation: 0, autoSkip: true },
        title: { display: true, text: "Nilai X", color: INK },
      },
      y: {
        beginAtZero: true,
        grid: { color: LAVENDER },
        ticks: { color: INK },
        title: { display: true, text: "Peluang", color: INK },
      },
    },
  };

  return (
    <div>
      <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">{judul}</p>
      <div
        role="img"
        aria-label={`${judul}. Batang ungu menandai X = ${k}, batang hijau menandai nilai X yang lebih kecil dari ${k}.`}
        className="mt-3 h-64"
      >
        <Bar data={data} options={opsi} />
      </div>
      <p className="mt-2 text-xs text-ink/60">
        Batang ungu: X = {k}. Batang hijau: X lebih kecil dari {k}. Batang abu-ungu: X lebih besar
        dari {k}.
      </p>
    </div>
  );
}

// ---------- Kurva normal (SVG) ----------

function Normal({ grafik }) {
  const { mu, sigma, dari, sampai } = grafik;

  const W = 420;
  const H = 190;
  const pad = 24;
  const dasar = 150;
  const tinggi = 120;

  const xmin = mu - 4 * sigma;
  const xmax = mu + 4 * sigma;
  const pdf = (v) =>
    Math.exp(-0.5 * ((v - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const puncak = pdf(mu);

  const sx = (v) => pad + ((v - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y) => dasar - (y / puncak) * tinggi;

  const N = 120;
  const kurva = Array.from({ length: N + 1 }, (_, i) => {
    const v = xmin + ((xmax - xmin) * i) / N;
    return `${i ? "L" : "M"}${sx(v).toFixed(1)} ${sy(pdf(v)).toFixed(1)}`;
  }).join(" ");

  // Daerah yang diarsir (null berarti sampai ujung kurva)
  const a = Math.max(xmin, dari ?? xmin);
  const b = Math.min(xmax, sampai ?? xmax);
  let area = null;
  if (b > a) {
    const M = 80;
    const pts = Array.from({ length: M + 1 }, (_, i) => {
      const v = a + ((b - a) * i) / M;
      return `L${sx(v).toFixed(1)} ${sy(pdf(v)).toFixed(1)}`;
    }).join(" ");
    area = `M${sx(a).toFixed(1)} ${dasar} ${pts} L${sx(b).toFixed(1)} ${dasar} Z`;
  }

  const tick = [-3, -2, -1, 0, 1, 2, 3].map((i) => mu + i * sigma);

  return (
    <div>
      <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">
        Kurva normal
      </p>
      <div className="mt-3 overflow-x-auto overflow-y-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[320px]"
          role="img"
          aria-label={`Kurva normal dengan rata-rata ${rapi(mu)} dan simpangan baku ${rapi(sigma)}. Daerah peluang diarsir.`}
        >
          {area && <path d={area} fill={MINT} fillOpacity="0.6" />}
          <path d={kurva} fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinejoin="round" />
          <line x1={pad} x2={W - pad} y1={dasar} y2={dasar} stroke={INK} strokeWidth="1.5" />
          {/* garis rata-rata */}
          <line
            x1={sx(mu)}
            x2={sx(mu)}
            y1={sy(puncak)}
            y2={dasar}
            stroke={INK}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {tick.map((v, i) => (
            <g key={i}>
              <line x1={sx(v)} x2={sx(v)} y1={dasar} y2={dasar + 5} stroke={INK} strokeWidth="1.5" />
              <text x={sx(v)} y={dasar + 20} textAnchor="middle" fontSize="11" fill={INK}>
                {rapi(v)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink/60">
        Garis putus-putus: rata-rata (μ). Daerah hijau: peluang yang dihitung. Angka di sumbu
        berjarak satu simpangan baku (σ).
      </p>
    </div>
  );
}

// ---------- Gabungan ----------

export default function GrafikDistribusi({ grafik }) {
  return (
    <div className="mt-4">
      {grafik.jenis === "normal" ? <Normal grafik={grafik} /> : <Diskrit grafik={grafik} />}
    </div>
  );
}