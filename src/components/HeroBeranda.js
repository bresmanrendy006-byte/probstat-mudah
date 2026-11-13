// src/components/HeroBeranda.js
import Link from "next/link";
import Muncul from "./Muncul";
import KartuMiring from "./KartuMiring";
import DaduMain from "./DaduMain";
import Teks from "./Teks";

const manfaat = ["Gratis", "Tanpa login", "Ada langkah penyelesaian"];

export default function HeroBeranda() {
  return (
    <section className="grid items-center gap-12 py-6 md:grid-cols-2 md:py-12">
      <div>
        <Muncul>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-4 py-1.5 text-sm font-bold shadow-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-mint" />
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
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/kalkulator"
              className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-7 py-3 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-1 hover:shadow-[0_16px_28px_-10px_rgba(91,94,214,0.8)] active:translate-y-0"
            >
              Coba Kalkulator
            </Link>
            <Link
              href="/materi"
              className="rounded-full border border-brand/20 bg-white px-7 py-3 font-semibold shadow-sm transition hover:-translate-y-1 hover:bg-sun active:translate-y-0"
            >
              Mulai Belajar
            </Link>
          </div>
        </Muncul>

        <Muncul delay={480}>
          <ul className="mt-8 flex flex-wrap gap-2">
            {manfaat.map((m) => (
              <li
                key={m}
                className="flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 text-mint"
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                {m}
              </li>
            ))}
          </ul>
        </Muncul>
      </div>

      <Muncul delay={300}>
        <div className="relative mx-auto max-w-sm">
          {/* Latar blob pastel di belakang kartu */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-br from-lavender via-peach/50 to-mint/40 blur-xl"
          />

          <div
            className="absolute -left-6 -top-5 z-10 animate-float rounded-2xl bg-sun px-3.5 py-2 text-sm font-bold shadow-hard"
            style={{ "--r": "-6deg" }}
          >
            <Teks>{String.raw`$P(A) = \dfrac{n(A)}{n(S)}$`}</Teks>
          </div>
          <div
            className="absolute -bottom-5 -right-4 z-10 animate-float rounded-2xl bg-mint px-3.5 py-2 text-sm font-bold text-ink shadow-hard"
            style={{ "--r": "5deg", animationDelay: "1.5s" }}
          >
            <Teks>{String.raw`$\bar{x} = \dfrac{\sum x}{n}$`}</Teks>
          </div>

          <KartuMiring className="relative p-8">
            <p className="mb-4 text-center font-display text-lg font-bold">Coba lempar dadu</p>
            <DaduMain />
          </KartuMiring>
        </div>
      </Muncul>
    </section>
  );
}