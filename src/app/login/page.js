export default function Login() {
  return (
    <div className="max-w-sm mx-auto mt-8 bg-white rounded-xl border border-ink/10 p-6">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-1 text-sm text-ink/70">Masuk untuk menyimpan progres belajarmu.</p>

      <div className="mt-5 space-y-3">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Kata sandi</label>
          <input id="password" type="password" className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2" />
        </div>
        <button type="button" className="w-full py-2.5 rounded-lg bg-brand text-white font-medium">Masuk</button>
        <button type="button" className="w-full py-2.5 rounded-lg border border-ink/20 font-medium">Masuk dengan Google</button>
      </div>

      <p className="mt-4 text-sm text-ink/60 text-center">Belum punya akun? Daftar</p>
    </div>
  );
}