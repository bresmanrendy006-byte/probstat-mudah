// src/lib/proses.js
// Membaca teks input, memanggil rumus, dan merapikan hasil.
// Bagian di antara $ ... $ ditulis dalam LaTeX dan digambar oleh komponen Teks.
// Setiap fungsi mengembalikan:
//   { ringkasan: [{ label, nilai }], langkah: ["...", "..."] }  atau  { galat: "..." }
// Mode Statistika juga mengembalikan { data, kuartil } untuk grafik.
// Baris langkah yang diawali "#" dianggap judul kelompok.

import { evaluate, format, parse } from "mathjs";
import {
  hitungFaktorial,
  hitungPermutasi,
  hitungKombinasi,
} from "./hitung";

const t = String.raw;

// ---------- Fungsi bantu ----------

// Bulatkan ke 4 angka desimal, buang nol di belakang, desimal memakai koma (untuk di dalam $...$)
function rapi(x) {
  if (!Number.isFinite(x)) return String(x);
  return String(Math.round(x * 1000000) / 1000000).replace(".", "{,}");
}

// Ubah titik desimal jadi koma tanpa membulatkan (untuk di dalam $...$)
function koma(x) {
  return String(x).replace(".", "{,}");
}

// Daftar angka dalam LaTeX; kalau terlalu panjang, dipersingkat
function daftar(arr, maks = 15) {
  const k = arr.map(koma);
  if (k.length <= maks) return k.join(", ");
  return `${k.slice(0, 10).join(", ")}, \\ldots, ${k[k.length - 1]}`;
}

// Median dari data yang SUDAH terurut
function medianUrut(urut) {
  const n = urut.length;
  if (n % 2 === 1) return urut[(n - 1) / 2];
  return (urut[n / 2 - 1] + urut[n / 2]) / 2;
}

// Kuartil: median bagian bawah (Q1) dan atas (Q3).
// Bila n ganjil, data tengah dikeluarkan dari kedua bagian.
function hitungKuartil(urut) {
  const n = urut.length;
  const bawah = urut.slice(0, Math.floor(n / 2));
  const atas = urut.slice(Math.ceil(n / 2));
  const q1 = medianUrut(bawah);
  const q2 = medianUrut(urut);
  const q3 = medianUrut(atas);
  const iqr = q3 - q1;
  const batasBawah = q1 - 1.5 * iqr;
  const batasAtas = q3 + 1.5 * iqr;
  const pencilan = urut.filter((x) => x < batasBawah || x > batasAtas);
  return { q1, q2, q3, iqr, batasBawah, batasAtas, pencilan };
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

    const teksHasil = format(nilai, { precision: 12 }).replace(".", "{,}");

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
    modus = daftarModus.map(koma).join(", ");    
    nilaiModus = `$${modus}$`;
    langkahModus = `Modus: nilai yang paling sering muncul (${terbanyak} kali), yaitu $${modus}$.`;
  }

  // Varians dan simpangan baku (sampel, dibagi n - 1)
  const jumlahKuadrat = data.reduce((a, x) => a + (x - mean) ** 2, 0);
  const varians = jumlahKuadrat / (n - 1);
  const simpangan = Math.sqrt(varians);

  // Kuartil, IQR, pencilan
  const kuartil = hitungKuartil(urut);
  const { q1, q3, iqr, batasBawah, batasAtas, pencilan } = kuartil;
  const nilaiPencilan = pencilan.length ? `$${daftar(pencilan, 8)}$` : "Tidak ada";
  const langkahPencilan = pencilan.length
    ? t`Pencilan: data di luar batas ini dianggap pencilan, yaitu $${daftar(pencilan, 8)}$.`
    : "Pencilan: tidak ada data di luar batas, jadi tidak ada pencilan.";

  return {
    data,
    kuartil,
    ringkasan: [
      { label: "Banyak data", nilai: `$${n}$` },
      { label: t`Mean ($\bar{x}$)`, nilai: `$${rapi(mean)}$` },
      { label: "Median", nilai: `$${rapi(median)}$` },
      { label: "Modus", nilai: nilaiModus },
      { label: t`Varians sampel ($s^2$)`, nilai: `$${rapi(varians)}$` },
      { label: t`Simpangan baku sampel ($s$)`, nilai: `$${rapi(simpangan)}$` },
      { label: "Minimum", nilai: `$${rapi(urut[0])}$` },
      { label: "Maksimum", nilai: `$${rapi(urut[n - 1])}$` },
      { label: t`Kuartil 1 ($Q_1$)`, nilai: `$${rapi(q1)}$` },
      { label: t`Kuartil 3 ($Q_3$)`, nilai: `$${rapi(q3)}$` },
      { label: t`Rentang antarkuartil (IQR)`, nilai: `$${rapi(iqr)}$` },
      { label: "Pencilan", nilai: nilaiPencilan },
    ],
    langkah: [
      "# Ukuran pemusatan dan penyebaran",
      t`Banyak data: $n = ${n}$`,
      t`Urutkan dari yang terkecil: $${daftar(urut)}$`,
      t`Mean: $\bar{x} = \dfrac{\sum x}{n} = \dfrac{${rapi(jumlah)}}{${n}} = ${rapi(mean)}$`,
      langkahMedian,
      langkahModus,
      t`Jumlah kuadrat selisih: $\sum (x - \bar{x})^2 = ${rapi(jumlahKuadrat)}$`,
      t`Varians sampel: $s^2 = \dfrac{\sum (x - \bar{x})^2}{n - 1} = \dfrac{${rapi(jumlahKuadrat)}}{${n} - 1} = ${rapi(varians)}$`,
      t`Simpangan baku: $s = \sqrt{s^2} = \sqrt{${rapi(varians)}} = ${rapi(simpangan)}$`,
      "# Kuartil dan pencilan",
      t`Kuartil: $Q_1$ adalah median bagian bawah dan $Q_3$ median bagian atas (data tengah dikeluarkan bila $n$ ganjil). Hasilnya $Q_1 = ${rapi(q1)}$ dan $Q_3 = ${rapi(q3)}$. Aplikasi seperti SPSS atau Excel memakai cara interpolasi, jadi angkanya bisa sedikit berbeda.`,
      t`Rentang antarkuartil: $IQR = Q_3 - Q_1 = ${rapi(q3)} - ${rapi(q1)} = ${rapi(iqr)}$`,
      t`Batas pencilan: batas bawah $Q_1 - 1{,}5 \times IQR = ${rapi(batasBawah)}$ dan batas atas $Q_3 + 1{,}5 \times IQR = ${rapi(batasAtas)}$`,
      langkahPencilan,
    ],
  };
}