const kategori = [
  { nama: "Probabilitas", selesai: 3, total: 6, warna: "bg-brand" },
  { nama: "Statistika Dasar", selesai: 2, total: 9, warna: "bg-mint" },
  { nama: "Statistika Inferensial", selesai: 0, total: 7, warna: "bg-sun" },
];

const skor = [
  { bab: "Peluang Bersyarat", nilai: 80 },
  { bab: "Ukuran Pemusatan", nilai: 65 },
  { bab: "Aturan Penjumlahan", nilai: 90 },
];

const bookmark = ["Teorema Bayes", "Boxplot dan pencilan", "Uji t dua sampel"];

const kartu = "bg-white border-2 border-ink rounded-xl shadow-hard";

export default function Dashboard() {
  const selesai = kategori.reduce((a, k) => a + k.selesai, 0);
  const total = kategori.reduce((a, k) => a + k.total, 0);
  const persen = Math.round((selesai / total) * 100);
  const keliling = 2 * Math.PI * 52;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Halo, selamat datang kembali</h1>
        <p className="text-ink/70 mt-1">Ini ringkasan belajarmu.</p>
      </div>

      <section className={`${kartu} p-6 flex flex-wrap items-center gap-8`}>
        <div className="relative size-36">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-ink/10" />
            <circle
              cx="60" cy="60" r="52" fill="none" strokeWidth="12" strokeLinecap="round"
              className="stroke-brand"
              strokeDasharray={keliling}
              strokeDashoffset={keliling * (1 - persen / 100)}
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center font-display text-3xl font-bold">{persen}%</p>
        </div>
        <div>
          <p className="text-sm text-ink/60">Progres keseluruhan</p>
          <p className="text-2xl font-bold">{selesai} dari {total} materi selesai</p>
          <p className="text-sm text-ink/70 mt-1">Lanjutkan dari materi terakhir yang kamu buka.</p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {kategori.map((k) => (
          <div key={k.nama} className={`${kartu} p-5`}>
            <h2 className="font-bold">{k.nama}</h2>
            <p className="text-sm text-ink/60 mt-1">{k.selesai}/{k.total} materi</p>
            <div className="mt-3 h-3 rounded-full border-2 border-ink bg-white overflow-hidden">
              <div className={`h-full ${k.warna}`} style={{ width: `${(k.selesai / k.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className={`${kartu} p-5`}>
          <h2 className="font-bold mb-3">Skor kuis terakhir</h2>
          <ul className="space-y-3">
            {skor.map((s) => (
              <li key={s.bab}>
                <div className="flex justify-between text-sm">
                  <span>{s.bab}</span>
                  <span className="font-bold">{s.nilai}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-mint" style={{ width: `${s.nilai}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="font-bold mb-3">Materi tersimpan</h2>
          <ul className="space-y-2 text-sm">
            {bookmark.map((b) => (
              <li key={b} className="px-3 py-2 rounded-lg border-2 border-ink bg-paper hover:bg-sun transition">{b}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}