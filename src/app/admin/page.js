import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ambilDaftar } from "@/data/daftarBab";

export const metadata = { title: "Ringkasan | Panel Admin" };

const panel = "rounded-2xl border border-slate-200 bg-white shadow-sm";

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function Admin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  // Penjaga kedua (layout admin sudah mengecek juga). Role dibaca dari database.
  const { data: saya } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .maybeSingle();
  if (saya?.role !== "admin") redirect("/dashboard");

  // Policy "admin lihat semua ..." mengizinkan admin membaca data semua pengguna (hanya membaca).
  const [profil, progres, skor] = await Promise.all([
    supabase.from("profiles").select("id, nama, role, dibuat").order("dibuat", { ascending: false }),
    supabase.from("progres").select("user_id, slug"),
    supabase
      .from("skor_kuis")
      .select("user_id, slug, nilai, dibuat")
      .order("dibuat", { ascending: false }),
  ]);
  const galat = [profil, progres, skor].some((r) => r.error);

  const semua = ambilDaftar().flatMap((k) => k.materi);
  const totalMateri = semua.length;
  const judulDari = (slug) => semua.find((m) => m.slug === slug)?.judul ?? slug;

  const pengguna = (profil.data ?? []).map((p) => {
    const selesai = (progres.data ?? []).filter((x) => x.user_id === p.id).length;
    const skorUser = (skor.data ?? []).filter((x) => x.user_id === p.id);
    return { ...p, selesai, percobaan: skorUser.length, terakhir: skorUser[0] ?? null };
  });

  const jumlahAdmin = pengguna.filter((p) => p.role === "admin").length;
  const statistik = [
    { angka: pengguna.length, label: "Total pengguna", garis: "bg-brand" },
    { angka: pengguna.length - jumlahAdmin, label: "Pelajar", garis: "bg-mint" },
    { angka: jumlahAdmin, label: "Admin", garis: "bg-sun" },
    { angka: (skor.data ?? []).length, label: "Percobaan kuis", garis: "bg-ink" },
  ];

  return (
    <div className="animate-rise space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-brand">Panel Admin</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Ringkasan pengguna</h1>
        <p className="mt-1 text-sm text-slate-600">
          Semua akun dan kemajuan belajarnya. Tampilan ini hanya untuk membaca.
        </p>
      </header>

      {galat && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          Sebagian data belum bisa dibaca. Pastikan SQL admin (policy &quot;admin lihat semua ...&quot;)
          sudah dijalankan di Supabase.
        </p>
      )}

      <section aria-label="Statistik" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statistik.map((s) => (
          <div key={s.label} className={`${panel} relative overflow-hidden p-5`}>
            <span className={`absolute inset-x-0 top-0 h-1.5 ${s.garis}`} />
            <p className="font-display text-4xl font-bold">{s.angka}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>

      <section className={`${panel} p-5`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Daftar pengguna</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {pengguna.length} akun
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Nama</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Progres materi</th>
                <th className="py-2 pr-3">Percobaan</th>
                <th className="py-2 pr-3">Skor terakhir</th>
                <th className="py-2">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {pengguna.map((p) => {
                const persen = totalMateri ? Math.round((p.selesai / totalMateri) * 100) : 0;
                return (
                  <tr key={p.id} className="border-b border-slate-100 align-middle hover:bg-slate-50">
                    <td className="py-3 pr-3 font-semibold">
                      {p.nama || "(tanpa nama)"}
                      {p.id === claims.sub && (
                        <span className="ml-2 rounded-full bg-mint/20 px-2 py-0.5 text-xs font-bold text-mint">
                          Kamu
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.role === "admin"
                            ? "bg-ink text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full bg-brand" style={{ width: `${persen}%` }} />
                        </div>
                        <span className="text-xs text-slate-600">
                          {p.selesai}/{totalMateri}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">{p.percobaan}</td>
                    <td className="py-3 pr-3">
                      {p.terakhir ? (
                        <>
                          <span className="font-bold">{p.terakhir.nilai}</span>
                          <span className="block text-xs text-slate-500">
                            {judulDari(p.terakhir.slug)}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-600">{p.dibuat ? formatTanggal(p.dibuat) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}