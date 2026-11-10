const mode = ["Dasar", "Peluang", "Statistika"];

export default function Kalkulator() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Kalkulator</h1>
      <p className="mt-1 text-ink/70">Masukkan data, lihat hasil dan langkahnya.</p>

      <div className="mt-5 flex gap-2">
        {mode.map((m, i) => (
          <button key={m} type="button" className={`px-4 py-2 rounded-lg text-sm font-medium border ${i === 2 ? "bg-brand text-white border-brand" : "border-ink/20"}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="bg-white rounded-xl border border-ink/10 p-5">
          <label htmlFor="data" className="font-semibold">Data</label>
          <textarea
            id="data"
            rows={5}
            placeholder="Contoh: 70, 85, 90, 65, 85, 100, 78"
            className="mt-2 w-full rounded-lg border border-ink/20 p-3 text-sm"
          />
          <div className="mt-3 flex gap-2">
            <button type="button" className="px-5 py-2 rounded-lg bg-brand text-white font-medium">Hitung</button>
            <button type="button" className="px-5 py-2 rounded-lg border border-ink/20">Coba contoh</button>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-ink/10 p-5">
          <h2 className="font-semibold">Hasil</h2>
          <p className="mt-2 text-sm text-ink/60">Hasil hitungan akan muncul di sini.</p>
        </section>
      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-ink/10 p-5">
          <h2 className="font-semibold">Langkah penyelesaian</h2>
          <p className="mt-2 text-sm text-ink/60">Cara hitung akan ditampilkan di sini.</p>
        </div>
        <div className="bg-white rounded-xl border border-ink/10 p-5">
          <h2 className="font-semibold">Grafik</h2>
          <div className="mt-2 h-40 rounded-lg bg-ink/5 flex items-center justify-center text-sm text-ink/50">
            Histogram dan boxplot
          </div>
        </div>
      </section>
    </div>
  );
}