import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ambilDaftar } from "@/data/daftarBab";

export const metadata = { title: "Dashboard | ProbStat Mudah" };

const kartu = "rounded-xl border-2 border-ink bg-white shadow-hard";
const warna = ["bg-brand", "bg-mint", "bg-sun"];

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  // Row Level Security memastikan hanya data milik pengguna ini yang terbaca.
  // Skor diambil lebih banyak (50) lalu disaring per materi di bawah,
  // supaya mengulang satu kuis tidak menghabiskan jatah materi lain.
  const [profil, progres, skor, bookmark] = await Promise.all([
    supabase.from("profiles").select("nama").eq("id", claims.sub).maybeSingle(),
    supabase.from("progres").select("slug"),
    supabase.from("skor_kuis").select("slug, nilai").order("dibuat", { ascending: false }).limit(50),
    supabase.from("bookmark").select("slug").order("dibuat", { ascending: false }),
  ]);
  const tabelBelumAda = [profil, progres, skor, bookmark].some((r) => r.error);

  const nama = profil.data?.nama || claims.email?.split("@")[0] || "Pelajar";
  const daftar = ambilDaftar();
  const semua = daftar.flatMap((k) => k.materi);
  const judulDari = (slug) => semua.find((m) => m.slug === slug)?.judul ?? slug;

  // Satu skor TERBARU per materi.
  // Data sudah urut dari yang terbaru, jadi slug yang pertama ditemui adalah skor terbarunya.
  const terbaruPerMateri = new Map();
  for (const s of skor.data ?? []) {
    if (!terbaruPerMateri.has(s.slug)) terbaruPerMateri.set(s.slug, s);
  }
  const skorTerbaru = [...terbaruPerMateri.values()].slice(0, 5);

  const selesaiSet = new Set((progres.data ?? []).map((p) => p.slug));
  const perKategori = daftar.map((k) => ({
    nama: k.kategori,
    total: k.materi.length,
    selesai: k.materi.filter((m) => selesaiSet.has(m.slug)).length,
  }));
  const total = semua.length;
  const selesai = perKategori.reduce((a, k) => a + k.selesai, 0);
  const persen = total ? Math.round((selesai / total) * 100) : 0;
  const keliling = 2 * Math.PI * 52;
  const berikut = semua.find((m) => m.isi && !selesaiSet.has(m.slug));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Halo, {nama}</h1>
        <p className="mt-1 text-ink/70">{claims.email}</p>
      </div>

      {tabelBelumAda && (
        <p className="rounded-xl border-2 border-ink bg-sun/30 p-4 text-sm font-semibold">
          Data belajar belum bisa dibaca. Pastikan file skema.sql sudah dijalankan di Supabase.
        </p>
      )}

      <section className={`${kartu} flex flex-wrap items-center gap-8 p-6`}>
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
          {berikut ? (
            <Link
              href={`/materi/${berikut.slug}`}
              className="mt-3 inline-block rounded-xl border-2 border-ink bg-sun px-4 py-2 text-sm font-semibold shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              {selesai === 0 ? "Mulai belajar" : "Lanjutkan"}: {berikut.judul}
            </Link>
          ) : (
            <p className="mt-2 text-sm font-semibold text-mint">Semua materi sudah selesai.</p>
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {perKategori.map((k, i) => (
          <div key={k.nama} className={`${kartu} p-5`}>
            <h2 className="font-bold">{k.nama}</h2>
            <p className="mt-1 text-sm text-ink/60">{k.selesai}/{k.total} materi</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className={`h-full ${warna[i % warna.length]}`} style={{ width: `${k.total ? (k.selesai / k.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className={`${kartu} p-5`}>
          <h2 className="mb-3 font-bold">Skor kuis terakhir</h2>
          {skorTerbaru.length === 0 ? (
            <p className="text-sm text-ink/60">Belum ada kuis. Skor akan muncul setelah kamu mengerjakan soal.</p>
          ) : (
            <ul className="space-y-3">
              {skorTerbaru.map((s) => (
                <li key={s.slug}>
                  <div className="flex justify-between text-sm">
                    <span>{judulDari(s.slug)}</span>
                    <span className="font-bold">{s.nilai}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full bg-mint" style={{ width: `${s.nilai}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${kartu} p-5`}>
          <h2 className="mb-3 font-bold">Materi tersimpan</h2>
          {(bookmark.data ?? []).length === 0 ? (
            <p className="text-sm text-ink/60">Belum ada materi yang disimpan.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {bookmark.data.map((b) => (
                <li key={b.slug}>
                  <Link href={`/materi/${b.slug}`} className="block rounded-lg border-2 border-ink bg-paper px-3 py-2 transition hover:bg-sun">
                    {judulDari(b.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}