// src/components/HeroBeranda.js
import Link from "next/link";
import Muncul from "./Muncul";
import KartuMiring from "./KartuMiring";
import DaduMain from "./DaduMain";
import Teks from "./Teks";

const statistik = [
  { angka: "27", label: "Video" },
  { angka: "5", label: "Bagian belajar" },
  { angka: "0", label: "Login untuk belajar" },
];

export default function HeroBeranda() {
  return (
    <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
      <div>
        <Muncul>
          <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-sun px-4 py-1 text-sm font-bold shadow-hard">
            Untuk siswa SMA dan mahasiswa
          </span>
        </Muncul>

        <Muncul delay={120}>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
            Belajar peluang dan statistika jadi{" "}
            <span className="teks-kilau">mudah</span>
          </h1>
        </Muncul>

        <Muncul delay={240}>
          <p className="mt-4 max-w-lg text-lg text-ink/70">
            Video, materi dengan rumus, dan kalkulator pintar yang menunjukkan
            langkah penyelesaiannya. Semua bisa dipakai tanpa login.
          </p>
        </Muncul>

        <Muncul delay={360}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kalkulator"
              className="rounded-xl border-2 border-ink bg-brand px-6 py-3 font-semibold text-white shadow-hard transition hover:-translate-y-1 active:translate-y-0"
            >
              Coba Kalkulator
            </Link>
            <Link
              href="/materi"
              className="rounded-xl border-2 border-ink bg-white px-6 py-3 font-semibold shadow-hard transition hover:-translate-y-1 hover:bg-sun active:translate-y-0"
            >
              Mulai Belajar
            </Link>
          </div>
        </Muncul>

        <Muncul delay={480}>
          <dl className="mt-8 flex flex-wrap gap-4">
            {statistik.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border-2 border-ink bg-white px-4 py-2 shadow-hard"
              >
                <dd className="font-display text-2xl font-bold">{s.angka}</dd>
                <dt className="text-xs text-ink/60">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Muncul>
      </div>

      <Muncul delay={300}>
        <div className="relative mx-auto max-w-sm">
          <div
            className="absolute -left-6 -top-6 z-10 animate-float rounded-xl border-2 border-ink bg-sun px-3 py-2 text-sm font-bold shadow-hard"
            style={{ "--r": "-6deg" }}
          >
            <Teks>{String.raw`$P(A) = \dfrac{n(A)}{n(S)}$`}</Teks>
          </div>
          <div
            className="absolute -bottom-5 -right-4 z-10 animate-float rounded-xl border-2 border-ink bg-mint px-3 py-2 text-sm font-bold text-white shadow-hard"
            style={{ "--r": "5deg", animationDelay: "1.5s" }}
          >
            <Teks>{String.raw`$\bar{x} = \dfrac{\sum x}{n}$`}</Teks>
          </div>

          <KartuMiring className="p-8">
            <p className="mb-3 text-center font-bold">Coba lempar dadu</p>
            <DaduMain />
          </KartuMiring>
        </div>
      </Muncul>
    </section>
  );
}