import Link from "next/link";
import HeroBeranda from "@/components/HeroBeranda";
import Muncul from "@/components/Muncul";
import KartuMiring from "@/components/KartuMiring";
import { daftarMateri } from "@/data/materi";
import { bankSoal } from "@/data/soal";

const fitur = [
  {
    judul: "Materi",
    teks: "Konsep peluang sampai uji statistik, dengan contoh soal.",
    href: "/materi",
    ikon: "Σ",
    warna: "bg-lavender text-brand",
  },
  {
    judul: "Video",
    teks: "27 video, dikelompokkan per bagian dan bisa ditonton berurutan.",
    href: "/video",
    ikon: "▶",
    warna: "bg-mint/40 text-ink",
  },
  {
    judul: "Kalkulator",
    teks: "Hitung dan lihat langkahnya, lengkap dengan grafik.",
    href: "/kalkulator",
    ikon: "÷",
    warna: "bg-peach/60 text-ink",
  },
];

const jalur = [
  {
    judul: "Siswa SMA",
    teks: "Mulai dari konsep dasar peluang, lalu ukuran pemusatan.",
    href: "/materi/konsep-dasar-peluang",
    tombol: "Mulai dari konsep dasar",
    lencana: "bg-mint/40",
  },
  {
    judul: "Mahasiswa",
    teks: "Langsung ke Bayes, distribusi, dan uji hipotesis.",
    href: "/materi/teorema-bayes",
    tombol: "Mulai dari Teorema Bayes",
    lencana: "bg-lavender",
  },
];

export default function Home() {
  const statistik = [
    { angka: daftarMateri.length, label: "materi lengkap", ikon: "Σ", warna: "bg-lavender text-brand" },
    { angka: 27, label: "video pembelajaran", ikon: "▶", warna: "bg-mint/40 text-ink" },
    { angka: bankSoal.length, label: "soal latihan", ikon: "?", warna: "bg-rose/60 text-ink" },
  ];

  return (
    <div className="space-y-14">
      <HeroBeranda />

      <Muncul>
        <section aria-label="Statistik" className="grid grid-cols-3 gap-3 sm:gap-5">
          {statistik.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-brand/10 bg-white p-4 text-center shadow-hard sm:p-6"
            >
              <span
                aria-hidden="true"
                className={`mx-auto grid size-9 place-items-center rounded-full font-display text-lg font-bold sm:size-11 ${s.warna}`}
              >
                {s.ikon}
              </span>
              <p className="mt-3 font-display text-3xl font-bold text-brand sm:text-5xl">{s.angka}</p>
              <p className="mt-1 text-xs font-semibold text-ink/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </section>
      </Muncul>

      <section>
        <Muncul>
          <h2 className="text-3xl font-bold">Apa yang bisa kamu pakai?</h2>
          <p className="mt-1 text-ink/70">Tiga alat belajar yang saling melengkapi.</p>
        </Muncul>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {fitur.map((f, i) => (
            <Muncul key={f.href} delay={i * 120}>
              <Link href={f.href} className="group block h-full rounded-3xl">
                <KartuMiring className="h-full">
                  <span
                    aria-hidden="true"
                    className={`grid size-12 place-items-center rounded-2xl font-display text-2xl font-bold transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${f.warna}`}
                  >
                    {f.ikon}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{f.judul}</h3>
                  <p className="mt-1 text-sm text-ink/70">{f.teks}</p>
                  <p className="mt-4 text-sm font-semibold text-brand transition-transform duration-200 group-hover:translate-x-1">
                    Buka →
                  </p>
                </KartuMiring>
              </Link>
            </Muncul>
          ))}
        </div>
      </section>

      <Muncul>
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand to-[#8b7ee8] p-6 text-white shadow-[0_24px_48px_-20px_rgba(91,94,214,0.7)] sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 left-1/3 size-40 rounded-full bg-peach/30 blur-2xl"
          />

          <div className="relative">
            <h2 className="text-2xl font-bold">Mulai dari mana?</h2>
            <p className="mt-1 text-sm text-white/85">Pilih jalur yang paling cocok denganmu.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {jalur.map((j) => (
                <Link
                  key={j.judul}
                  href={j.href}
                  className="group rounded-2xl bg-white p-5 text-ink shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${j.lencana}`}>
                    {j.judul}
                  </span>
                  <p className="mt-3 text-sm">{j.teks}</p>
                  <p className="mt-3 text-sm font-semibold text-brand transition-transform duration-200 group-hover:translate-x-1">
                    {j.tombol} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Muncul>
    </div>
  );
}