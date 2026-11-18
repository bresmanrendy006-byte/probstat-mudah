"use client";

// src/components/UbahRole.js
// Tombol ganti role pelajar <-> admin di tabel panel admin (gaya datar slate).
// Memanggil fungsi database ubah_role (security definer). Aturan "admin terakhir tidak bisa
// diturunkan" dijaga di database; tombol di sini hanya ikut menonaktifkannya agar jelas bagi admin.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UbahRole({ id, nama, role, diriSendiri, satuSatunyaAdmin }) {
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");

  const jadiAdmin = role !== "admin";
  const roleBaru = jadiAdmin ? "admin" : "pelajar";
  const terkunci = role === "admin" && satuSatunyaAdmin;

  // Saat dialog terbuka: Esc menutupnya, dan halaman di belakang tidak bisa digulir.
  useEffect(() => {
    if (!buka) return;
    function saatTekan(e) {
      if (e.key === "Escape" && !proses) setBuka(false);
    }
    document.addEventListener("keydown", saatTekan);
    const lama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", saatTekan);
      document.body.style.overflow = lama;
    };
  }, [buka, proses]);

  function bukaDialog() {
    setGalat("");
    setBuka(true);
  }

  async function ubah() {
    setProses(true);
    setGalat("");
    try {
      const { error } = await createClient().rpc("ubah_role", {
        id_pengguna: id,
        role_baru: roleBaru,
      });
      if (error) {
        setGalat(error.message || "Gagal mengubah role. Coba lagi.");
        return;
      }
      setBuka(false);
      // Muat ulang data server. Bila kamu menurunkan dirinya sendiri,
      // layout admin otomatis mengalihkanmu ke /dashboard.
      router.refresh();
    } catch (err) {
      console.error("Gagal mengubah role:", err);
      setGalat("Gagal mengubah role. Periksa koneksi internetmu.");
    } finally {
      setProses(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={bukaDialog}
        disabled={terkunci}
        title={terkunci ? "Satu-satunya admin tidak bisa diturunkan" : undefined}
        className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
      >
        {jadiAdmin ? "Jadikan admin" : "Jadikan pelajar"}
      </button>

      {buka &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/50 p-4"
            onClick={() => {
              if (!proses) setBuka(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-ubah-role"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-xl"
            >
              <h2 id="judul-ubah-role" className="text-lg font-bold">
                {jadiAdmin ? "Jadikan admin?" : "Jadikan pelajar?"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {jadiAdmin ? (
                  <>
                    <strong>{nama || "Pengguna ini"}</strong> akan bisa membuka Panel Admin dan
                    membaca data belajar semua pengguna.
                  </>
                ) : diriSendiri ? (
                  <>
                    Kamu akan <strong>kehilangan akses admin</strong> dan langsung dialihkan ke
                    dashboard pelajar. Hanya admin lain yang bisa mengembalikannya.
                  </>
                ) : (
                  <>
                    <strong>{nama || "Pengguna ini"}</strong> tidak akan bisa lagi membuka Panel
                    Admin.
                  </>
                )}
              </p>

              {galat && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                >
                  {galat}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setBuka(false)}
                  disabled={proses}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={ubah}
                  disabled={proses}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
                    jadiAdmin ? "bg-ink hover:bg-ink/90" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {proses ? "Menyimpan..." : "Ya, lanjutkan"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}