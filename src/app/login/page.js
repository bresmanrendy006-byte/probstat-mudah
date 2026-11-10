const isian = "mt-1 w-full rounded-xl border-2 border-ink px-3 py-2.5 bg-paper";

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-4 animate-rise">
      <div className="p-7 bg-white border-2 border-ink rounded-2xl shadow-hard">
        <span className="grid place-items-center size-11 rounded-lg bg-brand text-white border-2 border-ink shadow-hard text-xl">σ</span>
        <h1 className="mt-4 text-3xl font-bold">Masuk</h1>
        <p className="mt-1 text-sm text-ink/70">Masuk untuk menyimpan progres belajarmu.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input id="email" type="email" className={isian} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">Kata sandi</label>
            <input id="password" type="password" className={isian} />
          </div>

          <button type="button" className="w-full py-3 rounded-xl bg-brand text-white font-semibold border-2 border-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition">
            Masuk
          </button>

          <div className="flex items-center gap-3 text-xs text-ink/50">
            <span className="h-px flex-1 bg-ink/20" />atau<span className="h-px flex-1 bg-ink/20" />
          </div>

          <button type="button" className="w-full py-3 rounded-xl bg-white font-semibold border-2 border-ink hover:bg-sun transition">
            Masuk dengan Google
          </button>
        </div>

        <p className="mt-5 text-sm text-ink/60 text-center">
          Belum punya akun? <span className="font-semibold text-brand">Daftar</span>
        </p>
      </div>

      <p className="mt-4 text-sm text-ink/60 text-center">
        Materi, video, dan kalkulator tetap bisa dipakai tanpa login.
      </p>
    </div>
  );
}