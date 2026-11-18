import Link from "next/link";

export const metadata = { title: "Halaman tidak ditemukan | ProbStat Mudah" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md animate-rise py-10 text-center">
      <div className="relative rounded-3xl border border-brand/10 bg-white p-8 shadow-hard">
        {/* Tanda tanya melayang sebagai hiasan */}
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-4 grid size-12 animate-float place-items-center rounded-2xl bg-sun font-display text-2xl font-bold shadow-hard"
          style={{ "--r": "8deg" }}
        >
          ?
        </span>

        <p className="font-display text-7xl font-bold text-brand">404</p>
        <span className="mt-2 inline-block rounded-full bg-lavender px-3 py-1 text-xs font-bold">
          Peluang ditemukan: 0
        </span>
        <h1 className="mt-3 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink/70">
          Alamat yang kamu buka tidak ada atau sudah dipindah. Peluang menemukannya di sini
          adalah 0, tapi masih banyak materi lain yang bisa dipelajari.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 active:translate-y-0"
          >
            Ke Beranda
          </Link>
          <Link
            href="/materi"
            className="rounded-full border border-brand/20 bg-white px-6 py-2.5 font-semibold transition hover:bg-sun/50"
          >
            Lihat Materi
          </Link>
        </div>
      </div>
    </div>
  );
}