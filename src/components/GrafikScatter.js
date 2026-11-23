"use client";

// src/components/GrafikScatter.js
// Diagram pencar (scatter plot) dengan garis regresi, digambar dengan SVG.

const INK = "#2b2d5b";
const BRAND = "#5b5ed6";
const MINT = "#6fd1bb";
const LAVENDER = "#e4e4fb";

function rapi(x, d = 2) {
  const k = 10 ** d;
  return String(Math.round(x * k) / k);
}

function rentang(arr) {
  const lo = Math.min(...arr);
  const hi = Math.max(...arr);
  const pad = (hi - lo) * 0.08 || 1;
  return [lo - pad, hi + pad];
}

function tandai(lo, hi, banyak = 5) {
  return Array.from({ length: banyak }, (_, i) => lo + ((hi - lo) * i) / (banyak - 1));
}

export default function GrafikScatter({ grafik }) {
  const { x, y, a, b } = grafik;

  const W = 420;
  const H = 280;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 42;

  const [x0, x1] = rentang(x);
  const [y0, y1] = rentang(y);
  const sx = (v) => padL + ((v - x0) / (x1 - x0)) * (W - padL - padR);
  const sy = (v) => H - padB - ((v - y0) / (y1 - y0)) * (H - padT - padB);

  const tickX = tandai(x0, x1);
  const tickY = tandai(y0, y1);

  return (
    <div className="mt-4">
      <p className="inline-block rounded-full bg-sun/60 px-3 py-0.5 text-sm font-bold">
        Diagram pencar dan garis regresi
      </p>
      <div className="mt-3 overflow-x-auto overflow-y-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[320px]"
          role="img"
          aria-label={`Diagram pencar dengan ${x.length} titik dan garis regresi y sama dengan ${rapi(a, 3)} ${
            b >= 0 ? "tambah" : "kurang"
          } ${rapi(Math.abs(b), 3)} x.`}
        >
          <defs>
            <clipPath id="area-scatter">
              <rect x={padL} y={padT} width={W - padL - padR} height={H - padT - padB} />
            </clipPath>
          </defs>

          {/* garis bantu */}
          {tickY.map((v, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={sy(v)} y2={sy(v)} stroke={LAVENDER} strokeWidth="1.5" />
          ))}

          {/* sumbu */}
          <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke={INK} strokeWidth="1.5" />
          <line x1={padL} x2={padL} y1={padT} y2={H - padB} stroke={INK} strokeWidth="1.5" />

          {tickX.map((v, i) => (
            <g key={`x${i}`}>
              <line x1={sx(v)} x2={sx(v)} y1={H - padB} y2={H - padB + 5} stroke={INK} strokeWidth="1.5" />
              <text x={sx(v)} y={H - padB + 19} textAnchor="middle" fontSize="11" fill={INK}>
                {rapi(v)}
              </text>
            </g>
          ))}
          {tickY.map((v, i) => (
            <g key={`y${i}`}>
              <line x1={padL - 5} x2={padL} y1={sy(v)} y2={sy(v)} stroke={INK} strokeWidth="1.5" />
              <text x={padL - 9} y={sy(v) + 4} textAnchor="end" fontSize="11" fill={INK}>
                {rapi(v)}
              </text>
            </g>
          ))}

          <text x={(padL + W - padR) / 2} y={H - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>
            X
          </text>
          <text
            x={12}
            y={(padT + H - padB) / 2}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={INK}
            transform={`rotate(-90 12 ${(padT + H - padB) / 2})`}
          >
            Y
          </text>

          {/* garis regresi */}
          <g clipPath="url(#area-scatter)">
            <line
              x1={sx(x0)}
              y1={sy(a + b * x0)}
              x2={sx(x1)}
              y2={sy(a + b * x1)}
              stroke={BRAND}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* titik data */}
          {x.map((v, i) => (
            <circle key={i} cx={sx(v)} cy={sy(y[i])} r="5" fill={MINT} stroke={INK} strokeWidth="1.8">
              <title>{`(${rapi(v)}, ${rapi(y[i])})`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink/60">
        Titik hijau: pasangan data (X, Y). Garis ungu: garis regresi ŷ = a + bx. Makin dekat titik ke
        garis, makin kuat hubungan lurusnya.
      </p>
    </div>
  );
}