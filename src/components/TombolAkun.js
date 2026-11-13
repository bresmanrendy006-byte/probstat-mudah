"use client";

// src/components/TombolAkun.js
// Di Navbar: tombol Login jika belum masuk; jika sudah masuk, tombol Logout (dengan konfirmasi).
// Untuk admin, ada tambahan tombol "Panel Admin" untuk kembali ke halaman admin.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function TombolKeluar({ className = "" }) {
  const router = useRouter();
  const [buka, setBuka] = useState(false); // pop up konfirmasi terbuka atau tidak
  const [proses, setProses] = useState(false); // sedang proses keluar

  // Saat pop up terbuka: tombol Esc menutupnya, dan halaman di belakang tidak bisa digulir.
  useEffect(() => {
    if (!buka) return;

    function saatTekan(e) {
      if (e.key === "Escape" && !proses) setBuka(false);
    }
    document.addEventListener("keydown", saatTekan);

    const overflowLama = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", saatTekan);
      document.body.style.overflow = overflowLama;
    };
  }, [buka, proses]);

  async function keluar() {
    setProses(true);
    try {
      await createClient().auth.signOut();
      setBuka(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Gagal logout:", err);
    } finally {
      setProses(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        className={`rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 ${className}`}
      >
        Logout
      </button>

      {buka &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!proses) setBuka(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-logout"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-brand/15 bg-white p-6 text-ink shadow-[0_30px_60px_-20px_rgba(43,45,91,0.5)]"
            >
              <h2 id="judul-logout" className="text-xl font-bold">
                Yakin ingin logout?
              </h2>
              <p className="mt-2 text-sm text-ink/70">
                Kamu akan keluar dari akunmu. Progres dan skor yang sudah tersimpan tetap aman,
                dan kamu bisa masuk lagi kapan saja.
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setBuka(false)}
                  disabled={proses}
                  className="rounded-full bg-lavender px-5 py-2 text-sm font-semibold transition hover:bg-sun disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={keluar}
                  disabled={proses}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-60"
                >
                  {proses ? "Keluar..." : "Logout"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function TombolAkun() {
  const [user, setUser] = useState(undefined); // undefined = masih memeriksa
  const [role, setRole] = useState(null); // "admin" | "pelajar" | null

  useEffect(() => {
    const supabase = createClient();

    // Simpan pengguna, lalu baca role-nya dari database.
    function muat(u) {
      setUser(u ?? null);
      if (!u) {
        setRole(null);
        return;
      }
      supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .maybeSingle()
        .then(({ data }) => setRole(data?.role ?? null));
    }

    supabase.auth.getUser().then(({ data }) => muat(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => muat(session?.user), 0);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return <span aria-hidden="true" className="inline-block h-10 w-20 rounded-full bg-lavender" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="block rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#4a4dc4] hover:shadow-md"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {role === "admin" && (
        <Link
          href="/admin"
          className="rounded-full bg-sun px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 hover:shadow-md"
        >
          Panel Admin
        </Link>
      )}
      <TombolKeluar />
    </div>
  );
}