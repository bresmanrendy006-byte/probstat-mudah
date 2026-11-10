import Link from "next/link";

const rumus = [
  { teks: "P(A) = n(A) / n(S)", pos: "top-2 left-4 bg-white", r: "-4deg", d: "0s" },
  { teks: "x̄ = Σx / n", pos: "top-24 right-0 bg-sun", r: "3deg", d: "1s" },
  { teks: "P(A|B) = P(A∩B) / P(B)", pos: "top-48 left-0 bg-mint text-white", r: "-2deg", d: "2s" },
  { teks: "σ = √varians", pos: "bottom-0 right-6 bg-white", r: "5deg", d: "3s" },
];

const fitur = [
  { judul: "Materi", teks: "Konsep peluang sampai uji statistik, dengan contoh soal.", href: "/materi", warna: "bg-brand" },
  { judul: "Video", teks: "27 video, dikelompokkan per bagian dan bisa ditonton berurutan.", href: "/video", warna: "bg-mint" },
  { judul: "Kalkulator", teks: "Hitung dan lihat langkahnya, lengkap dengan grafik.", href: "/kalkulator", warna: "bg-sun" },
];

const statistik = [
  ["27", "video pembelajaran"],
  ["3", "mode kalkulator"],
  ["Gratis", "belajar tanpa login"],
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid md:grid-cols-2 gap-10 items-center animate-rise">
        <div>
          <p className="inline-block px-3 py-1 rounded-full border-2 border-ink bg-white text-sm font-semibold">
            Untuk siswa SMA dan mahasiswa
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-[1.05]">
            Peluang dan statistika,{" "}
            <span className="bg-sun px-2 -mx-1 rounded">tanpa pusing.</span>
          </h1>
          <p className="mt-5 text-lg text-ink/75 max-w-md">
            Belajar lewat video, materi bergambar, dan kalkulator yang menunjukkan langkah hitungnya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/materi" className="px-6 py-3 rounded-xl bg-brand text-white font-semibold border-2 border-ink shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
              Mulai belajar
            </Link>
            <Link href="/kalkulator" className="px-6 py-3 rounded-xl bg-white font-semibold border-2 border-ink shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition">
              Coba kalkulator
            </Link>
          </div>
        </div>

        <div className="relative h-80 hidden md:block" aria-hidden="true">
          {rumus.map((r) => (
            <div
              key={r.teks}
              style={{ "--r": r.r, animationDelay: r.d }}
              className={`absolute ${r.pos} px-4 py-3 border-2 border-ink rounded-xl shadow-hard font-semibold animate-float`}
            >
              {r.teks}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 sm:gap-6">
        {statistik.map(([angka, label]) => (
          <div key={label} className="text-center p-4 bg-white border-2 border-ink rounded-xl shadow-hard">
            <p className="font-display text-2xl sm:text-4xl font-bold text-brand">{angka}</p>
            <p className="text-xs sm:text-sm text-ink/70">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {fitur.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group p-6 bg-white border-2 border-ink rounded-xl shadow-hard hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)] transition"
          >
            <span className={`block size-10 rounded-lg border-2 border-ink ${f.warna}`} />
            <h2 className="mt-4 text-xl font-bold">{f.judul}</h2>
            <p className="mt-1 text-sm text-ink/70">{f.teks}</p>
            <p className="mt-4 text-sm font-semibold group-hover:translate-x-1 transition">Buka →</p>
          </Link>
        ))}
      </section>

      <section className="p-8 bg-ink text-white rounded-2xl border-2 border-ink">
        <h2 className="text-2xl font-bold">Mulai dari mana?</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link href="/materi" className="p-5 rounded-xl bg-white text-ink hover:bg-sun transition">
            <p className="font-bold">Siswa SMA</p>
            <p className="text-sm mt-1">Mulai dari konsep dasar peluang dan ukuran pemusatan.</p>
          </Link>
          <Link href="/materi" className="p-5 rounded-xl bg-white text-ink hover:bg-sun transition">
            <p className="font-bold">Mahasiswa</p>
            <p className="text-sm mt-1">Langsung ke Bayes, distribusi, dan uji hipotesis.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}