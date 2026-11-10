// src/lib/proses.js
// Membaca teks input, memanggil rumus, dan merapikan hasil.
// Bagian di antara $ ... $ ditulis dalam LaTeX dan digambar oleh komponen Teks.
// Setiap fungsi mengembalikan:
//   { ringkasan: [{ label, nilai }], langkah: ["...", "..."] }  atau  { galat: "..." }
// Baris langkah yang diawali "#" dianggap judul kelompok.

import { evaluate, format, parse } from "mathjs";
import {
  hitungFaktorial,
  hitungPermutasi,
  hitungKombinasi,
} from "./hitung";

const t = String.raw;

// ---------- Fungsi bantu ----------

// Bulatkan ke 4 angka desimal dan buang nol di belakang
function rapi(x) {
  if (!Number.isFinite(x)) return String(x);
  return String(Math.round(x * 10000) / 10000);
}

// Daftar angka dalam LaTeX; kalau terlalu panjang, dipersingkat
function daftar(arr, maks = 15) {
  if (arr.length <= maks) return arr.join(", ");
  return `${arr.slice(0, 10).join(", ")}, \\ldots, ${arr[arr.length - 1]}`;
}

// ---------- Mode Dasar ----------

export function prosesDasar(teks) {
  const ekspresi = teks.trim();
  if (!ekspresi) {
    return { galat: "Ketik ekspresi dulu, misalnya (12 + 8) * 3 / 4." };
  }

  try {
    const nilai = evaluate(ekspresi);

    if (typeof nilai !== "number") {
      return { galat: "Ekspresi harus menghasilkan satu angka biasa." };
    }
    if (!Number.isFinite(nilai)) {
      return {
        galat: "Hasilnya tak terhingga atau bukan angka (cek pembagian dengan nol).",
      };
    }

    const teksHasil = format(nilai, { precision: 12 });

    // Ubah ekspresi ketikan menjadi penulisan matematika (pecahan, akar, dst.)
    let tex = ekspresi;
    try {
      tex = parse(ekspresi).toTex();
    } catch {
      // kalau gagal diubah, pakai teks asli
    }

    return {
      ringkasan: [{ label: "Hasil", nilai: `$${teksHasil}$` }],
      langkah: [
        t`Ekspresi: $${tex}$`,
        `Urutan hitung: kurung, pangkat dan akar, kali dan bagi, lalu tambah dan kurang.`,
        t`Hasil: $${tex} = ${teksHasil}$`,
      ],
    };
  } catch (e) {
    return {
      galat: "Ekspresi tidak bisa dibaca. Cek tanda kurung dan penulisannya.",
    };
  }
}

// ---------- Mode Peluang ----------

export function prosesPeluang(teks) {
  const angka = (teks.match(/-?\d+(\.\d+)?/g) || []).map(Number);

  if (angka.length === 0) {
    return { galat: "Isi angka n (dan r). Contoh: n = 10, r = 3." };
  }
  if (angka.length > 2) {
    return { galat: "Isi maksimal 2 angka: n dan r." };
  }

  const n = angka[0];
  const f = hitungFaktorial(n);
  if (f.galat) return { galat: f.galat };

  const ringkasan = [{ label: `$${n}!$`, nilai: `$${f.hasil}$` }];
  const langkah = ["# Faktorial", ...f.langkah];

  if (angka.length === 2) {
    const r = angka[1];

    const p = hitungPermutasi(n, r);
    if (p.galat) return { galat: p.galat };

    const k = hitungKombinasi(n, r);
    if (k.galat) return { galat: k.galat };

    ringkasan.push({ label: `$P(${n}, ${r})$`, nilai: `$${p.hasil}$` });
    ringkasan.push({ label: `$C(${n}, ${r})$`, nilai: `$${k.hasil}$` });
    langkah.push("# Permutasi", ...p.langkah);
    langkah.push("# Kombinasi", ...k.langkah);
  }

  return { ringkasan, langkah };
}

// ---------- Mode Statistika ----------

export function prosesStatistika(teks) {
  const potongan = teks.split(/[\s,;]+/).filter(Boolean);
  if (potongan.length === 0) {
    return { galat: "Isi datanya dulu. Contoh: 70, 85, 90, 65, 85." };
  }

  const data = potongan.map(Number);
  if (data.some((x) => !Number.isFinite(x))) {
    return {
      galat:
        "Ada isian yang bukan angka. Pisahkan angka dengan koma, dan pakai titik untuk desimal (contoh 7.5).",
    };
  }
  if (data.length < 2) {
    return { galat: "Isi minimal 2 angka." };
  }
  if (data.length > 1000) {
    return { galat: "Data terlalu banyak. Maksimal 1000 angka." };
  }

  const n = data.length;
  const urut = [...data].sort((a, b) => a - b);
  const jumlah = data.reduce((a, b) => a + b, 0);
  const mean = jumlah / n;

  // Median
  let median;
  let langkahMedian;
  if (n % 2 === 1) {
    median = urut[(n - 1) / 2];
    langkahMedian = t`Median: karena $n = ${n}$ ganjil, median adalah data ke-$\dfrac{n+1}{2} = ${(n + 1) / 2}$ setelah diurutkan, yaitu $${rapi(median)}$.`;
  } else {
    const a = urut[n / 2 - 1];
    const b = urut[n / 2];
    median = (a + b) / 2;
    langkahMedian = t`Median: karena $n = ${n}$ genap, median adalah rata-rata dua data tengah: $\dfrac{${rapi(a)} + ${rapi(b)}}{2} = ${rapi(median)}$.`;
  }

  // Modus
  const hitungan = new Map();
  for (const x of data) hitungan.set(x, (hitungan.get(x) || 0) + 1);
  const terbanyak = Math.max(...hitungan.values());
  let modus;
  let nilaiModus;
  let langkahModus;
  if (terbanyak === 1) {
    modus = "Tidak ada";
    nilaiModus = "Tidak ada";
    langkahModus = "Modus: semua nilai muncul sekali, jadi tidak ada modus.";
  } else {
    const daftarModus = [...hitungan.entries()]
      .filter(([, jml]) => jml === terbanyak)
      .map(([nilai]) => nilai)
      .sort((a, b) => a - b);
    modus = daftarModus.join(", ");
    nilaiModus = `$${modus}$`;
    langkahModus = `Modus: nilai yang paling sering muncul (${terbanyak} kali), yaitu $${modus}$.`;
  }

  // Varians dan simpangan baku (sampel, dibagi n - 1)
  const jumlahKuadrat = data.reduce((a, x) => a + (x - mean) ** 2, 0);
  const varians = jumlahKuadrat / (n - 1);
  const simpangan = Math.sqrt(varians);

  return {
    ringkasan: [
      { label: "Banyak data", nilai: `$${n}$` },
      { label: t`Mean ($\bar{x}$)`, nilai: `$${rapi(mean)}$` },
      { label: "Median", nilai: `$${rapi(median)}$` },
      { label: "Modus", nilai: nilaiModus },
      { label: t`Varians sampel ($s^2$)`, nilai: `$${rapi(varians)}$` },
      { label: t`Simpangan baku sampel ($s$)`, nilai: `$${rapi(simpangan)}$` },
    ],
    langkah: [
      t`Banyak data: $n = ${n}$`,
      t`Urutkan dari yang terkecil: $${daftar(urut)}$`,
      t`Mean: $\bar{x} = \dfrac{\sum x}{n} = \dfrac{${rapi(jumlah)}}{${n}} = ${rapi(mean)}$`,
      langkahMedian,
      langkahModus,
      t`Jumlah kuadrat selisih: $\sum (x - \bar{x})^2 = ${rapi(jumlahKuadrat)}$`,
      t`Varians sampel: $s^2 = \dfrac{\sum (x - \bar{x})^2}{n - 1} = \dfrac{${rapi(jumlahKuadrat)}}{${n} - 1} = ${rapi(varians)}$`,
      t`Simpangan baku: $s = \sqrt{s^2} = \sqrt{${rapi(varians)}} = ${rapi(simpangan)}$`,
    ],
  };
}