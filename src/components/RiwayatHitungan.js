"use client";

// src/components/RiwayatHitungan.js
// Daftar riwayat hitungan di dashboard: Hitung ulang (buka kalkulator) dan Hapus (dengan konfirmasi).

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Teks from "@/components/Teks";

export default function RiwayatHitungan({ awal, userId }) {
  const [daftar, setDaftar] = useState(awal);
  const [konfirmasi, setKonfirmasi] = useState(null); // id entri yang sedang dikonfirmasi hapus
  const [sibuk, setSibuk] = useState(null); // id entri yang sedang dihapus
  const [galat, setGalat] = useState("");

  async function hapus(id) {
    setSibuk(id);
    setGalat("");
    const supabase = createClient();
    const { error } = await supabase
      .from("riwayat_hitungan")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    setSibuk(null);
    if (error) {
      console.warn("Galat hapus riwayat:", error.code);
      setGalat("Gagal menghapus. Coba lagi sebentar lagi.");
      return;
    }
    setDaftar((lama) => lama.filter((r) => r.id !== id));
    setKonfirmasi(null);
  }

  if (daftar.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand/25 p-5 text-center">
        <p className="text-sm text-ink/70">
          Belum ada riwayat. Hitung sesuatu di kalkulator, lalu tekan Simpan hasil ke riwayat.
        </p>
        <Link
          href="/kalkulator"
          className="mt-3 inline-block rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"
        >
          Buka kalkulator
        </Link>
      </div>
    );
  }

  return (
    <div>
      {galat && (
        <p role="alert" className="mb-3 rounded-2xl bg-rose/40 px-4 py-2 text-sm font-semibold">
          {galat}
        </p>
      )}
      <ul className="space-y-3">
        {daftar.map((r) => (
          <li key={r.id} className="rounded-2xl bg-lavender/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="rounded-full bg-white px-3 py-0.5 text-xs font-bold">{r.jenis}</span>
                <span className="text-xs text-ink/60">{r.tanggal}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {konfirmasi === r.id ? (
                  <>
                    <span className="text-xs font-semibold">Hapus entri ini?</span>
                    <button
                      type="button"
                      onClick={() => hapus(r.id)}
                      disabled={sibuk === r.id}
                      className="rounded-full bg-red-500 px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      {sibuk === r.id ? "Menghapus..." : "Ya, hapus"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setKonfirmasi(null)}
                      disabled={sibuk === r.id}
                      className="rounded-full border border-brand/20 bg-white px-3.5 py-1 text-xs font-semibold transition hover:bg-sun/50 disabled:opacity-50"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/kalkulator?riwayat=${r.id}`}
                      className="rounded-full bg-white px-3.5 py-1 text-xs font-semibold transition hover:bg-sun"
                    >
                      Hitung ulang
                    </Link>
                    <button
                      type="button"
                      onClick={() => setKonfirmasi(r.id)}
                      className="rounded-full border border-brand/20 bg-white px-3.5 py-1 text-xs font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            </div>

            {r.ringkasan.length > 0 && (
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {r.ringkasan.map((h, i) => (
                  <div key={i} className="min-w-0">
                    <dt className="text-xs text-ink/60">
                      <Teks>{h.label}</Teks>
                    </dt>
                    <dd className="max-w-full overflow-x-auto overflow-y-hidden font-display font-bold">
                      <Teks>{h.nilai}</Teks>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}