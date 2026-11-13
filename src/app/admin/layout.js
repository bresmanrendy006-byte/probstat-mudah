import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TombolKeluar } from "@/components/TombolAkun";

export const metadata = { title: "Panel Admin | ProbStat Mudah" };

// Daftar menu sidebar. Tambah item baru di sini saat halaman admin bertambah.
const menu = [{ nama: "Ringkasan", href: "/admin", ikon: "▦" }];

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: saya } = await supabase
    .from("profiles")
    .select("nama, role")
    .eq("id", claims.sub)
    .maybeSingle();
  if (saya?.role !== "admin") redirect("/dashboard");

  const nama = saya?.nama || "Admin";

  return (
    <div className="min-h-screen bg-slate-100 text-ink md:flex">
      <aside className="bg-ink text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col">
        {/* Merek */}
        <div className="flex items-center gap-3 p-4 md:p-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun font-display text-xl font-bold text-ink">
            σ
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-tight">ProbStat</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-sun">Panel Admin</p>
          </div>
        </div>

        {/* Menu */}
        <nav aria-label="Menu admin" className="flex gap-2 px-4 pb-3 md:flex-1 md:flex-col md:px-4 md:pb-0">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <span aria-hidden="true">{m.ikon}</span>
              {m.nama}
            </Link>
          ))}
        </nav>

        {/* Akun + tombol */}
        <div className="space-y-3 border-t border-white/10 p-4 md:p-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{nama}</p>
            <p className="truncate text-xs text-white/60">{claims.email}</p>
          </div>
          <Link
            href="/"
            className="block rounded-xl bg-sun px-4 py-2.5 text-center text-sm font-bold text-ink transition hover:brightness-110"
          >
            Ke Situs Umum →
          </Link>
          <TombolKeluar className="w-full" />
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}