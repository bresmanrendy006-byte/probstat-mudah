// src/components/LatarBelakang.js
const simbol = [
  { s: "Σ", x: "6%", y: "14%", ukuran: "text-6xl", jeda: "0s", r: "-12deg" },
  { s: "π", x: "88%", y: "10%", ukuran: "text-7xl", jeda: "1.2s", r: "10deg" },
  { s: "√", x: "14%", y: "62%", ukuran: "text-5xl", jeda: "2.4s", r: "8deg" },
  { s: "∞", x: "80%", y: "58%", ukuran: "text-7xl", jeda: "0.6s", r: "-8deg" },
  { s: "%", x: "48%", y: "8%", ukuran: "text-5xl", jeda: "3s", r: "14deg" },
  { s: "σ", x: "92%", y: "86%", ukuran: "text-6xl", jeda: "1.8s", r: "-14deg" },
  { s: "!", x: "30%", y: "88%", ukuran: "text-6xl", jeda: "2.8s", r: "6deg" },
  { s: "μ", x: "62%", y: "80%", ukuran: "text-5xl", jeda: "0.9s", r: "-6deg" },
];

export default function LatarBelakang() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-brand/20 blur-3xl animate-[drift_18s_ease-in-out_infinite]" />
      <div className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-sun/25 blur-3xl animate-[drift_22s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-mint/20 blur-3xl animate-[drift_26s_ease-in-out_infinite]" />

      {simbol.map((x) => (
        <span
          key={x.s}
          className={`absolute select-none font-display font-bold text-ink/10 animate-[melayang_9s_ease-in-out_infinite] ${x.ukuran}`}
          style={{
            left: x.x,
            top: x.y,
            animationDelay: x.jeda,
            "--r": x.r,
          }}
        >
          {x.s}
        </span>
      ))}
    </div>
  );
}