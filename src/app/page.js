import Link from "next/link";
import HeroBeranda from "@/components/HeroBeranda";
import Muncul from "@/components/Muncul";
import KartuMiring from "@/components/KartuMiring";

const fitur = [
  { judul: "Materi", teks: "Konsep peluang sampai uji statistik, dengan contoh soal.", href: "/materi", warna: "bg-brand" },
  { judul: "Video", teks: "27 video, dikelompokkan per bagian dan bisa ditonton berurutan.", href: "/video", warna: "bg-mint" },
  { judul: "Kalkulator", teks: "Hitung dan lihat langkahnya, lengkap dengan grafik.", href: "/kalkulator", warna: "bg-sun" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroBeranda />

      <section>
        <Muncul>
          <h2 className="text-3xl font-bold">Apa yang bisa kamu pakai?</h2>
        </Muncul>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {fitur.map((f, i) => (
            <Muncul key={f.href} delay={i * 120}>
              <Link href={f.href} className="group block h-full">
                <KartuMiring className="h-full">
                  <span
                    className={`block size-10 rounded-lg border-2 border-ink ${f.warna} transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}
                  />
                  <h3 className="mt-4 text-xl font-bold">{f.judul}</h3>
                  <p className="mt-1 text-sm text-ink/70">{f.teks}</p>
                  <p className="mt-4 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1">
                    Buka →
                  </p>
                </KartuMiring>
              </Link>
            </Muncul>
          ))}
        </div>
      </section>

      <Muncul>
        <section className="rounded-2xl border-2 border-ink bg-ink p-8 text-white">
          <h2 className="text-2xl font-bold">Mulai dari mana?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/materi"
              className="rounded-xl bg-white p-5 text-ink transition hover:-translate-y-1 hover:bg-sun"
            >
              <p className="font-bold">Siswa SMA</p>
              <p className="mt-1 text-sm">Mulai dari konsep dasar peluang dan ukuran pemusatan.</p>
            </Link>
            <Link
              href="/materi"
              className="rounded-xl bg-white p-5 text-ink transition hover:-translate-y-1 hover:bg-sun"
            >
              <p className="font-bold">Mahasiswa</p>
              <p className="mt-1 text-sm">Langsung ke Bayes, distribusi, dan uji hipotesis.</p>
            </Link>
          </div>
        </section>
      </Muncul>
    </div>
  );
}