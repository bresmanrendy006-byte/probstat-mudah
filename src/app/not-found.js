import Link from "next/link";

export const metadata = { title: "Halaman tidak ditemukan | ProbStat Mudah" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md animate-rise py-10 text-center">
      <div className="rounded-2xl border-2 border-ink bg-white p-8 shadow-hard">
        <p className="font-display text-7xl font-bold text-brand">404</p>
        <h1 className="mt-3 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink/70">
          Alamat yang kamu buka tidak ada atau sudah dipindah. Peluang menemukannya di sini
          adalah 0, tapi masih banyak materi lain yang bisa dipelajari.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border-2 border-ink bg-brand px-5 py-2.5 font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Ke Beranda
          </Link>
          <Link
            href="/materi"
            className="rounded-xl border-2 border-ink bg-white px-5 py-2.5 font-semibold transition hover:bg-sun"
          >
            Lihat Materi
          </Link>
        </div>
      </div>
    </div>
  );
}