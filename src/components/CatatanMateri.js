"use client";

// src/components/CatatanMateri.js
// Catatan pribadi per materi (satu catatan per pengguna per materi). Hanya untuk yang login.

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const KARTU = "rounded-3xl border border-brand/10 bg-white shadow-hard";
const BATAS = 2000;

export default function CatatanMateri({ slug }) {
  const [userId, setUserId] = useState(undefined); // undefined = memeriksa, null = belum login
  const [isi, setIsi] = useState("");
  const [tersimpan, setTersimpan] = useState(""); // isi yang sudah ada di database
  const [status, setStatus] = useState({ jenis: "", teks: "" });
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        const id = data?.claims?.sub ?? null;
        if (batal) return;
        setUserId(id);
        if (!id) return;
        // Filter user_id WAJIB (admin boleh membaca catatan semua pengguna)
        const { data: baris, error } = await supabase
          .from("catatan")
          .select("isi")
          .eq("user_id", id)
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        if (!batal && baris) {
          setIsi(baris.isi);
          setTersimpan(baris.isi);
        }
      } catch (err) {
        console.error("Gagal membaca catatan:", err);
        if (!batal) {
          setStatus({ jenis: "galat", teks: "Catatan belum bisa dibaca. Coba muat ulang halaman." });
        }
      }
    })();
    return () => {
      batal = true;
    };
  }, [slug]);

  async function simpan() {
    const bersih = isi.trim();
    if (!userId || sibuk) return;
    if (!bersih) {
      setStatus({ jenis: "galat", teks: "Catatan masih kosong. Tulis sesuatu dulu." });
      return;
    }
    setSibuk(true);
    setStatus({ jenis: "", teks: "" });
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("catatan")
        .upsert(
          { user_id: userId, slug, isi: bersih, diubah: new Date().toISOString() },
          { onConflict: "user_id,slug" }
        );
      if (error) throw error;
      setIsi(bersih);
      setTersimpan(bersih);
      setStatus({ jenis: "ok", teks: "Catatan tersimpan." });
    } catch (err) {
      console.error("Gagal menyimpan catatan:", err);
      setStatus({ jenis: "galat", teks: "Gagal menyimpan. Coba lagi sebentar lagi." });
    } finally {
      setSibuk(false);
    }
  }

  async function hapus() {
    if (!userId || sibuk) return;
    setSibuk(true);
    setStatus({ jenis: "", teks: "" });
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("catatan")
        .delete()
        .eq("user_id", userId)
        .eq("slug", slug);
      if (error) throw error;
      setIsi("");
      setTersimpan("");
      setStatus({ jenis: "ok", teks: "Catatan dihapus." });
    } catch (err) {
      console.error("Gagal menghapus catatan:", err);
      setStatus({ jenis: "galat", teks: "Gagal menghapus. Coba lagi sebentar lagi." });
    } finally {
      setSibuk(false);
    }
  }

  if (userId === undefined) {
    return (
      <div className={`${KARTU} p-5 text-sm text-ink/70`} role="status">
        Memuat catatan...
      </div>
    );
  }

  if (userId === null) {
    return (
      <div className={`${KARTU} p-5 text-sm`}>
        <Link href="/login" className="font-bold text-brand underline">
          Masuk
        </Link>{" "}
        untuk menulis catatan pribadi di materi ini.
      </div>
    );
  }

  const berubah = isi.trim() !== tersimpan;

  return (
    <div className={`${KARTU} p-5 sm:p-6`}>
      <label htmlFor={`catatan-${slug}`} className="block text-sm font-bold">
        Catatan pribadimu (hanya kamu yang bisa melihat)
      </label>
      <textarea
        id={`catatan-${slug}`}
        rows={5}
        maxLength={BATAS}
        value={isi}
        onChange={(e) => {
          setIsi(e.target.value);
          setStatus({ jenis: "", teks: "" });
        }}
        placeholder="Tulis hal penting, rumus yang sering lupa, atau pertanyaan untuk nanti."
        className="mt-2 w-full rounded-2xl border border-brand/20 bg-paper px-4 py-3 text-sm outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15"
      />
      <p className="mt-1 text-right text-xs text-ink/60">
        {isi.length}/{BATAS}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={simpan}
          disabled={sibuk || !berubah}
          className="rounded-full bg-linear-to-r from-brand to-[#8b7ee8] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-10px_rgba(91,94,214,0.7)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {sibuk ? "Menyimpan..." : "Simpan catatan"}
        </button>
        {tersimpan && (
          <button
            type="button"
            onClick={hapus}
            disabled={sibuk}
            className="rounded-full border border-brand/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hapus catatan
          </button>
        )}
      </div>

      {status.teks && (
        <p
          role={status.jenis === "galat" ? "alert" : "status"}
          className={`mt-3 rounded-2xl px-4 py-2 text-xs font-semibold ${
            status.jenis === "galat" ? "bg-rose/40" : "bg-mint/30"
          }`}
        >
          {status.teks}
        </p>
      )}
    </div>
  );
}