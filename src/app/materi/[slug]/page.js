// src/app/materi/[slug]/page.js
// Halaman isi satu materi: video, pengertian, rumus, contoh soal, kuis latihan.

import Link from "next/link";
import { notFound } from "next/navigation";
import { cariMateri } from "@/data/materi";
import { ambilDaftar } from "@/data/daftarBab";
import { ambilSoal } from "@/data/soal";
import Teks from "@/components/Teks";
import ContohSoal from "@/components/ContohSoal";
import Kuis from "@/components/Kuis";
import AksiMateri from "@/components/AksiMateri";
import CatatanMateri from "@/components/CatatanMateri";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = cariMateri(slug);
  return { title: m ? `${m.judul} | ProbStat Mudah` : "Materi | ProbStat Mudah" };
}

const warnaTingkat = { SMA: "bg-mint/40", Mahasiswa: "bg-lavender" };
const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";


// Materi -> tab kalkulator terkait (kode mengikuti kodeMode di kalkulator/page.js)
const kalkulatorTerkait = {
  "peluang-suatu-kejadian": { kode: "peluang", nama: "Peluang" },
  "aturan-penjumlahan": { kode: "peluang", nama: "Peluang" },
  "aturan-perkalian": { kode: "peluang", nama: "Peluang" },
  "peluang-bersyarat": { kode: "peluang", nama: "Peluang" },
  "ukuran-pemusatan": { kode: "statistika", nama: "Statistika" },
  "ukuran-penyebaran": { kode: "statistika", nama: "Statistika" },
  "distribusi-normal": { kode: "normal", nama: "Normal" },
  "dasar-uji-hipotesis": { kode: "uji-t", nama: "Uji t" },
  "uji-t": { kode: "uji-t", nama: "Uji t" },
  "korelasi-dan-regresi": { kode: "korelasi", nama: "Korelasi" },
  "spss-korelasi-regresi": { kode: "korelasi", nama: "Korelasi" },
  "anova-satu-arah": { kode: "anova", nama: "ANOVA" },
  "spss-uji-beda-rata-rata": { kode: "anova", nama: "ANOVA" },
};

// Judul bagian dengan ikon pastel kecil di depannya.
function JudulBagian({ ikon, warna, children }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-bold">
      <span
        aria-hidden="true"
        className={`grid size-9 shrink-0 place-items-center rounded-xl font-display text-lg ${warna}`}
      >
        {ikon}
      </span>
      {children}
    </h2>
  );
}

export default async function IsiMateri({ params }) {
  const { slug } = await params; // di Next.js 16, params harus di-await
  const m = cariMateri(slug);
  if (!m) notFound();

  const soal = ambilSoal(slug);
  const kalk = kalkulatorTerkait[slug] ?? null;

  // Materi sebelum dan sesudah (hanya yang sudah ada isinya)
  const urut = ambilDaftar().flatMap((k) => k.materi).filter((x) => x.isi);
  const idx = urut.findIndex((x) => x.slug === slug);
  const sebelum = idx > 0 ? urut[idx - 1] : null;
  const sesudah = idx >= 0 && idx < urut.length - 1 ? urut[idx + 1] : null;

  // Menu loncat: hanya bagian yang benar-benar tampil
  const menu = [
    m.video?.length > 0 && { id: "video", nama: "Video" },
    { id: "pengertian", nama: "Pengertian" },
    m.rumus?.length > 0 && { id: "rumus", nama: "Rumus" },
    m.contoh?.length > 0 && { id: "contoh", nama: "Contoh soal" },
    soal.length > 0 && { id: "kuis", nama: "Kuis" },
    { id: "catatan", nama: "Catatan" },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <Link
        href="/materi"
        className="group inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-sun/50 active:translate-y-0"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          ←
        </span>
        Kembali ke daftar materi
      </Link>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-brand/15 bg-white px-3 py-1 text-xs font-bold">
          {m.kategori}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${warnaTingkat[m.tingkat] ?? "bg-sun"}`}
        >
          {m.tingkat}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-bold leading-tight">{m.judul}</h1>

      {/* Tombol Tandai selesai + Simpan (hanya aktif jika login) */}
      <AksiMateri key={slug} slug={slug} />

      {/* Menu loncat */}
      <nav aria-label="Isi halaman" className="mt-5 flex flex-wrap gap-2">
        {menu.map((x) => (
          <a
            key={x.id}
            href={`#${x.id}`}
            className="rounded-full border border-brand/20 bg-white px-4 py-1.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-sun/50"
          >
            {x.nama}
          </a>
        ))}
      </nav>

      {/* Video (hanya tampil jika ada) */}
      {m.video?.length > 0 && (
        <section id="video" className="mt-10 scroll-mt-28">
          <JudulBagian ikon="▶" warna="bg-rose/60">
            Video
          </JudulBagian>
          <div className="mt-4 space-y-4">
            {m.video.map((id) => (
              <div
                key={id}
                className="aspect-video overflow-hidden rounded-3xl border border-brand/10 bg-lavender shadow-hard"
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={`Video ${m.judul}`}
                  allowFullScreen
                  loading="lazy"
                  className="size-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pengertian */}
      <section id="pengertian" className="mt-10 scroll-mt-28">
        <JudulBagian ikon="i" warna="bg-lavender text-brand">
          Pengertian
        </JudulBagian>
        <div className={`${KARTU} mt-4 space-y-3 p-5 sm:p-6`}>
          {m.pengertian.map((p, i) => (
            <p key={i} className="leading-relaxed">
              <Teks>{p}</Teks>
            </p>
          ))}
        </div>
      </section>

      {/* Rumus (disembunyikan jika kosong) */}
      {m.rumus?.length > 0 && (
        <section id="rumus" className="mt-10 scroll-mt-28">
          <JudulBagian ikon="Σ" warna="bg-sun">
            Rumus
          </JudulBagian>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {m.rumus.map((r) => (
              <div
                key={r.nama}
                className={`${KARTU} p-5 transition hover:-translate-y-0.5`}
              >
                <p className="inline-block rounded-full bg-lavender px-3 py-0.5 text-xs font-bold">
                  {r.nama}
                </p>
                <div className="mt-3 overflow-x-auto overflow-y-hidden rounded-2xl bg-paper px-3 py-2 text-lg">
                  <Teks besar>{`$${r.tex}$`}</Teks>
                </div>
                {r.ket && (
                  <p className="mt-3 text-sm text-ink/70">
                    <Teks>{r.ket}</Teks>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contoh soal (disembunyikan jika kosong) */}
      {m.contoh?.length > 0 && (
        <section id="contoh" className="mt-10 scroll-mt-28">
          <JudulBagian ikon="✎" warna="bg-peach/60">
            Contoh soal dan pembahasan
          </JudulBagian>
          <div className="mt-4 space-y-5">
            {m.contoh.map((c, i) => (
              <ContohSoal key={i} nomor={i + 1} data={c} />
            ))}
          </div>
        </section>
      )}

      {/* Kuis latihan (disembunyikan jika belum ada soal untuk materi ini) */}
      {soal.length > 0 && (
        <section id="kuis" className="mt-10 scroll-mt-28">
          <JudulBagian ikon="?" warna="bg-mint/40">
            Kuis latihan
          </JudulBagian>
          <p className="mt-2 text-sm text-ink/70">
            {soal.length} soal pilihan ganda. Bisa dikerjakan tanpa login; masuk bila ingin
            skormu tersimpan.
          </p>
          <div className="mt-4">
            <Kuis key={slug} slug={slug} soal={soal} />
          </div>
        </section>
      )}

      {/* Catatan pribadi */}
      <section id="catatan" className="mt-10 scroll-mt-28">
        <JudulBagian ikon="✐" warna="bg-rose/60">
          Catatanku
        </JudulBagian>
        <div className="mt-4">
          <CatatanMateri key={slug} slug={slug} />
        </div>
      </section>

      {/* Sebelumnya / Berikutnya */}
      <nav aria-label="Pindah materi" className="mt-12 grid gap-4 sm:grid-cols-2">
        {sebelum ? (
          <Link
            href={`/materi/${sebelum.slug}`}
            className={`group ${KARTU} p-4 transition hover:-translate-y-0.5 hover:bg-lavender/50`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand">← Sebelumnya</p>
            <p className="mt-1 font-bold">{sebelum.judul}</p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {sesudah && (
          <Link
            href={`/materi/${sesudah.slug}`}
            className={`group ${KARTU} p-4 text-right transition hover:-translate-y-0.5 hover:bg-lavender/50`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Berikutnya →</p>
            <p className="mt-1 font-bold">{sesudah.judul}</p>
          </Link>
        )}
      </nav>

      {/* Ajakan ke kalkulator */}
      <div className="relative mt-8 overflow-hidden rounded-3xl bg-linear-to-br from-brand to-[#8b7ee8] p-6 text-white shadow-[0_24px_48px_-20px_rgba(91,94,214,0.7)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/15 blur-2xl"
        />
        <div className="relative">
          <p className="font-display text-xl font-bold">Mau coba hitung sendiri?</p>
          <p className="mt-1 text-sm text-white/85">
            Kalkulator menunjukkan langkah penyelesaiannya satu per satu.
          </p>
          <Link
            href={kalk ? `/kalkulator?mode=${kalk.kode}` : "/kalkulator"}
            className="mt-4 inline-block rounded-full bg-sun px-6 py-2.5 font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {kalk ? `Coba di Kalkulator: ${kalk.nama}` : "Buka Kalkulator"}
          </Link>
          <Link
            href={`/cheat-sheet/${slug}`}
            className="ml-2 mt-4 inline-block rounded-full bg-white/20 px-6 py-2.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/30"
          >
            Cheat sheet materi ini
          </Link>
        </div>
      </div>
    </div>
  );
}