// src/lib/anova.js
// ANOVA satu arah (One-Way ANOVA), 2 sampai 5 kelompok.
// p-value dihitung dari distribusi F lewat fungsi beta tak lengkap (betai di uji.js).
// Mengembalikan { ringkasan, langkah, grafik, keterangan } atau { galat }.

import { betai } from "./uji";
import { tafsirPValue } from "./keterangan";

const t = String.raw;
const NAMA = ["A", "B", "C", "D", "E"];

// ---------- Fungsi bantu tampilan ----------

function rapi(x, d = 6) {
  if (!Number.isFinite(x)) return String(x);
  const k = 10 ** d;
  return String(Math.round(x * k) / k).replace(".", "{,}");
}

// Untuk kalimat biasa (desimal pakai koma)
function kom(x, d = 2) {
  if (!Number.isFinite(x)) return String(x);
  const k = 10 ** d;
  return String(Math.round(x * k) / k).replace(".", ",");
}

function tex(x) {
  if (x === 0) return "0";
  if (x < 0.0001) {
    const [m, e] = x.toExponential(3).split("e");
    return `${m.replace(".", "{,}")} \\times 10^{${Number(e)}}`;
  }
  return rapi(x);
}

// ---------- Distribusi F ----------

// p-value sisi kanan: P(F >= f)
function pF(f, d1, d2) {
  if (f <= 0) return 1;
  return betai(d2 / 2, d1 / 2, d2 / (d2 + d1 * f));
}

// Nilai kritis F: f sehingga P(F >= f) = alpha (bisection)
function fKritis(d1, d2, alpha) {
  let lo = 0;
  let hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pF(mid, d1, d2) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- Kuartil untuk boxplot (sama dengan proses.js) ----------

function medianUrut(urut) {
  const n = urut.length;
  if (n % 2 === 1) return urut[(n - 1) / 2];
  return (urut[n / 2 - 1] + urut[n / 2]) / 2;
}

function ringkasBox(data) {
  const urut = [...data].sort((a, b) => a - b);
  const n = urut.length;
  const q1 = medianUrut(urut.slice(0, Math.floor(n / 2)));
  const q2 = medianUrut(urut);
  const q3 = medianUrut(urut.slice(Math.ceil(n / 2)));
  const iqr = q3 - q1;
  const batasBawah = q1 - 1.5 * iqr;
  const batasAtas = q3 + 1.5 * iqr;
  const dalam = urut.filter((x) => x >= batasBawah && x <= batasAtas);
  return {
    q1,
    q2,
    q3,
    kumisBawah: Math.min(...dalam),
    kumisAtas: Math.max(...dalam),
    pencilan: urut.filter((x) => x < batasBawah || x > batasAtas),
  };
}

// ---------- Membaca data ----------

function bacaKelompok(teks, nama) {
  const potongan = teks.split(/[\s,;]+/).filter(Boolean);
  const data = potongan.map(Number);
  if (data.some((x) => !Number.isFinite(x))) {
    return {
      galat: `Kelompok ${nama} berisi isian yang bukan angka. Pisahkan dengan koma, desimal pakai titik (7.5).`,
    };
  }
  if (data.length < 2) return { galat: `Kelompok ${nama} minimal 2 angka.` };
  if (data.length > 1000) return { galat: `Kelompok ${nama} terlalu banyak. Maksimal 1000 angka.` };
  return { data };
}

// ---------- Fungsi utama ----------

// masukan: { kelompok: ["teks A", "teks B", ...], alpha }
export function prosesAnova({ kelompok, alpha }) {
  const al = Number(alpha);
  if (!(al > 0 && al < 1)) return { galat: "Taraf signifikansi tidak valid." };

  // Kelompok yang kosong dilewati
  const isi = [];
  for (let i = 0; i < kelompok.length; i++) {
    const teks = (kelompok[i] || "").trim();
    if (!teks) continue;
    const r = bacaKelompok(teks, NAMA[i]);
    if (r.galat) return { galat: r.galat };
    isi.push({ nama: NAMA[i], data: r.data });
  }
  if (isi.length < 2) {
    return { galat: "Isi data minimal 2 kelompok. Contoh: 70, 75, 80, 85, 90." };
  }

  const k = isi.length;
  const semua = isi.flatMap((g) => g.data);
  const N = semua.length;
  const rataBesar = semua.reduce((a, b) => a + b, 0) / N;

  const ringkas = isi.map((g) => {
    const n = g.data.length;
    const mean = g.data.reduce((a, b) => a + b, 0) / n;
    const jk = g.data.reduce((a, x) => a + (x - mean) ** 2, 0);
    return { ...g, n, mean, jk, varians: jk / (n - 1) };
  });

  const jkAntar = ringkas.reduce((a, g) => a + g.n * (g.mean - rataBesar) ** 2, 0);
  const jkDalam = ringkas.reduce((a, g) => a + g.jk, 0);
  const jkTotal = jkAntar + jkDalam;
  const df1 = k - 1;
  const df2 = N - k;
  const ktAntar = jkAntar / df1;
  const ktDalam = jkDalam / df2;

  if (ktDalam === 0) {
    return {
      galat:
        "Semua data di dalam tiap kelompok sama (variasi dalam kelompok 0), jadi F tidak bisa dihitung.",
    };
  }

  const F = ktAntar / ktDalam;
  const p = pF(F, df1, df2);
  const fc = fKritis(df1, df2, al);
  const tolak = p < al;
  const eta2 = jkTotal === 0 ? 0 : jkAntar / jkTotal;

  const namaKelompok = ringkas.map((g) => g.nama).join(", ");
  const rumusAntar = ringkas
    .map((g) => t`${g.n}(${rapi(g.mean)} - ${rapi(rataBesar)})^2`)
    .join(" + ");

  // Tafsir ukuran efek (patokan Cohen untuk eta kuadrat)
  const ukuranEfek = eta2 < 0.01 ? "sangat kecil" : eta2 < 0.06 ? "kecil" : eta2 < 0.14 ? "sedang" : "besar";

  // Kelompok dengan rata-rata tertinggi dan terendah
  const urutMean = [...ringkas].sort((a, b) => a.mean - b.mean);
  const terendah = urutMean[0];
  const tertinggi = urutMean[urutMean.length - 1];

  return {
    ringkasan: [
      { label: t`Statistik $F$`, nilai: `$${rapi(F)}$` },
      { label: t`$p$-value`, nilai: `$${tex(p)}$` },
      { label: `Nilai kritis F (α = ${kom(al)})`, nilai: `$${rapi(fc)}$` },
      { label: "db antar kelompok", nilai: `$${df1}$` },
      { label: "db dalam kelompok", nilai: `$${df2}$` },
      { label: t`Ukuran efek ($\eta^2$)`, nilai: `$${rapi(eta2)}$` },
      { label: "Keputusan", nilai: tolak ? "H₀ ditolak" : "H₀ tidak ditolak" },
      ...ringkas.map((g) => ({ label: `Rata-rata ${g.nama}`, nilai: `$${rapi(g.mean)}$` })),
    ],
    langkah: [
      "# Hipotesis",
      t`ANOVA satu arah: apakah ada perbedaan rata-rata di antara ${k} kelompok (${namaKelompok})?`,
      t`$H_0: \mu_1 = \mu_2 = \cdots = \mu_${k}$ (semua rata-rata sama)`,
      t`$H_1$: ada paling sedikit satu rata-rata yang berbeda. Taraf signifikansi $\alpha = ${rapi(al)}$`,
      "# Statistik data",
      ...ringkas.map(
        (g) => t`Kelompok ${g.nama}: $n = ${g.n}$, $\bar{x} = ${rapi(g.mean)}$, $s^2 = ${rapi(g.varians)}$`
      ),
      t`Banyak seluruh data: $N = ${N}$, rata-rata keseluruhan: $\bar{x} = ${rapi(rataBesar)}$`,
      "# Jumlah kuadrat (JK)",
      t`JK antar kelompok: $JK_A = \sum n_i (\bar{x}_i - \bar{x})^2 = ${rumusAntar} = ${rapi(jkAntar)}$`,
      t`JK dalam kelompok: $JK_D = \sum \sum (x - \bar{x}_i)^2 = ${rapi(jkDalam)}$`,
      t`JK total: $JK_T = JK_A + JK_D = ${rapi(jkAntar)} + ${rapi(jkDalam)} = ${rapi(jkTotal)}$`,
      "# Kuadrat tengah (KT) dan F",
      t`Derajat bebas: $db_A = k - 1 = ${df1}$ dan $db_D = N - k = ${df2}$`,
      t`$KT_A = \dfrac{JK_A}{db_A} = \dfrac{${rapi(jkAntar)}}{${df1}} = ${rapi(ktAntar)}$`,
      t`$KT_D = \dfrac{JK_D}{db_D} = \dfrac{${rapi(jkDalam)}}{${df2}} = ${rapi(ktDalam)}$`,
      t`Rumus: $F = \dfrac{KT_A}{KT_D}$`,
      t`Masukkan angka: $F = \dfrac{${rapi(ktAntar)}}{${rapi(ktDalam)}} = ${rapi(F)}$`,
      "# Keputusan",
      t`Nilai kritis: $F_{${rapi(al)};\,${df1};\,${df2}} = ${rapi(fc)}$`,
      t`p-value: $p = ${tex(p)}$`,
      tolak
        ? t`Karena $F = ${rapi(F)} > ${rapi(fc)}$ (atau $p < \alpha$), maka $H_0$ ditolak.`
        : t`Karena $F = ${rapi(F)} \le ${rapi(fc)}$ (atau $p \ge \alpha$), maka $H_0$ tidak ditolak.`,
      tafsirPValue(p, al),
      t`Ukuran efek: $\eta^2 = \dfrac{JK_A}{JK_T} = ${rapi(eta2)}$, artinya sekitar ${kom(eta2 * 100, 1)}% variasi data dijelaskan oleh perbedaan kelompok.`,
    ],
    grafik: {
      jenis: "anova",
      kelompok: ringkas.map((g) => ({
        nama: g.nama,
        data: g.data,
        mean: g.mean,
        ...ringkasBox(g.data),
      })),
    },
    keterangan: [
      {
        judul: "Keputusan uji",
        isi: `${tafsirPValue(p, al)} Nilai F hitung ${kom(F)} dibandingkan dengan nilai kritis ${kom(fc, 3)} pada db ${df1} dan ${df2}.`,
      },
      {
        judul: "Arti praktis",
        isi: tolak
          ? `Paling sedikit ada satu kelompok yang rata-ratanya berbeda nyata. Dari data ini, rata-rata terendah ada di kelompok ${terendah.nama} (${kom(terendah.mean)}) dan tertinggi di kelompok ${tertinggi.nama} (${kom(tertinggi.mean)}). ANOVA belum menunjukkan pasangan mana yang berbeda; untuk itu dibutuhkan uji lanjut (post hoc) seperti Tukey, yang belum tersedia di kalkulator ini.`
          : `Rata-rata antar kelompok memang tidak persis sama, tetapi perbedaannya masih wajar terjadi karena kebetulan. Belum cukup bukti bahwa ada kelompok yang rata-ratanya berbeda.`,
      },
      {
        judul: "Ukuran efek",
        isi: `η² = ${kom(eta2, 3)}, tergolong ${ukuranEfek} (patokan umum: di bawah 0,01 sangat kecil, sampai 0,06 kecil, sampai 0,14 sedang, di atasnya besar). Ukuran efek menunjukkan seberapa besar perbedaannya, sedangkan p-value hanya menunjukkan apakah perbedaannya mungkin kebetulan.`,
      },
      {
        judul: "Catatan asumsi",
        isi: `ANOVA mengandaikan kelompok saling bebas, data tiap kelompok kira-kira berdistribusi normal, dan variasi antar kelompok kira-kira sama (lihat tinggi kotak di boxplot).${
          N / k < 10 ? ` Rata-rata tiap kelompok hanya ${kom(N / k, 1)} data, jadi tafsirkan dengan hati-hati.` : ""
        }${k === 2 ? " Untuk dua kelompok, hasilnya setara dengan uji t dua sampel bebas (F = t²)." : ""}`,
      },
    ],
  };
}