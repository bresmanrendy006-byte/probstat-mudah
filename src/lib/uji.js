// src/lib/uji.js
// Uji t: satu sampel, dua sampel bebas, dan berpasangan (dua arah).
// Distribusi t dihitung sendiri lewat fungsi beta tak lengkap (tanpa paket tambahan).
// Mengembalikan { ringkasan, langkah, grafik, keterangan } atau { galat }.

import { tafsirPValue } from "./keterangan";

const t = String.raw;

// ---------- Fungsi bantu tampilan ----------

function rapi(x, d = 4) {
  if (!Number.isFinite(x)) return String(x);
  const k = 10 ** d;
  return String(Math.round(x * k) / k);
}

// Untuk kalimat biasa (desimal pakai koma)
function kom(x, d = 2) {
  return rapi(x, d).replace(".", ",");
}

// Peluang dalam LaTeX; yang sangat kecil ditulis bentuk ilmiah
function tex(x) {
  if (x === 0) return "0";
  if (x < 0.0001) {
    const [m, e] = x.toExponential(3).split("e");
    return `${m} \\times 10^{${Number(e)}}`;
  }
  return rapi(x);
}

// ---------- Matematika distribusi t ----------

// log gamma (aproksimasi Lanczos)
function lgamma(x) {
  const cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5,
  ];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) {
    y += 1;
    ser += cof[j] / y;
  }
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

// Pecahan berlanjut untuk fungsi beta tak lengkap
function betacf(a, b, x) {
  const MAXIT = 300;
  const EPS = 3e-14;
  const FPMIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

// Fungsi beta tak lengkap teregularisasi I_x(a, b)
export function betai(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)
  );
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(a, b, x)) / a;
  return 1 - (bt * betacf(b, a, 1 - x)) / b;
}

// p-value dua arah: P(|T| >= |t|)
export function pDuaArah(nilaiT, df) {
  return betai(df / 2, 0.5, df / (df + nilaiT * nilaiT));
}

// Nilai kritis dua arah: t sehingga P(|T| >= t) = alpha (bisection)
function tKritis(df, alpha) {
  let lo = 0;
  let hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pDuaArah(mid, df) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Kerapatan distribusi t (dipakai untuk menggambar kurva)
export function kerapatanT(x, df) {
  const c = Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2)) / Math.sqrt(df * Math.PI);
  return c * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

// ---------- Fungsi bantu data ----------

function bacaData(teks, nama) {
  const potongan = (teks || "").split(/[\s,;]+/).filter(Boolean);
  if (potongan.length === 0) return { galat: `Isi data ${nama} dulu. Contoh: 70, 85, 90, 65, 85.` };
  const data = potongan.map(Number);
  if (data.some((x) => !Number.isFinite(x))) {
    return {
      galat: `Data ${nama} berisi isian yang bukan angka. Pisahkan dengan koma, desimal pakai titik (7.5).`,
    };
  }
  if (data.length < 2) return { galat: `Data ${nama} minimal 2 angka.` };
  if (data.length > 1000) return { galat: `Data ${nama} terlalu banyak. Maksimal 1000 angka.` };
  return { data };
}

function ringkasData(data) {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const varians = data.reduce((a, x) => a + (x - mean) ** 2, 0) / (n - 1);
  return { n, mean, varians, sd: Math.sqrt(varians) };
}

// ---------- Penyusun hasil bersama ----------

function susunHasil({ jenis, nilaiT, df, alpha, ringkasanTambahan, langkahHitung, langkahHipotesis, pembanding, arti, asumsi }) {
  const p = pDuaArah(nilaiT, df);
  const tc = tKritis(df, alpha);
  const tolak = p < alpha;

  const keputusan = tolak
    ? t`Karena $|t| = ${rapi(Math.abs(nilaiT))} > ${rapi(tc)}$ (atau $p < \alpha$), maka $H_0$ ditolak.`
    : t`Karena $|t| = ${rapi(Math.abs(nilaiT))} \le ${rapi(tc)}$ (atau $p \ge \alpha$), maka $H_0$ tidak ditolak.`;

  return {
    ringkasan: [
      { label: t`Statistik $t$`, nilai: `$${rapi(nilaiT)}$` },
      { label: "Derajat bebas", nilai: `$${rapi(df, 2)}$` },
      { label: t`$p$-value (dua arah)`, nilai: `$${tex(p)}$` },
      { label: `Nilai kritis (α = ${kom(alpha)})`, nilai: t`$\pm ${rapi(tc)}$` },
      ...ringkasanTambahan,
      { label: "Keputusan", nilai: tolak ? "H₀ ditolak" : "H₀ tidak ditolak" },
    ],
    langkah: [
      "# Hipotesis",
      ...langkahHipotesis,
      t`Taraf signifikansi: $\alpha = ${rapi(alpha)}$`,
      "# Hitungan",
      ...langkahHitung,
      "# Keputusan",
      t`Nilai kritis (dua arah): $\pm t_{\alpha/2;\,db} = \pm ${rapi(tc)}$`,
      t`p-value (dua arah): $p = ${tex(p)}$`,
      keputusan,
      tafsirPValue(p, alpha),
      ...(pembanding ? ["# Pembanding", ...pembanding] : []),
    ],
    grafik: { jenis: "t", df, t: nilaiT, tKritis: tc, alpha },
    keterangan: [
      {
        judul: "Keputusan uji",
        isi: `${tafsirPValue(p, alpha)} Nilai t hitung ${kom(nilaiT)} dibandingkan dengan nilai kritis ±${kom(tc, 3)} pada derajat bebas ${kom(df)}.`,
      },
      { judul: "Arti praktis", isi: arti(tolak) },
      { judul: "Catatan asumsi", isi: asumsi },
    ],
    // dipakai halaman supaya tidak salah dikira data mode Statistika
    jenisUji: jenis,
  };
}

// ---------- Fungsi utama ----------

// masukan: { jenis: "satu" | "bebas" | "pasangan", a, b, mu0, alpha }
export function prosesUjiT({ jenis, a, b, mu0, alpha }) {
  const al = Number(alpha);
  if (!(al > 0 && al < 1)) return { galat: "Taraf signifikansi tidak valid." };

  // ----- Satu sampel -----
  if (jenis === "satu") {
    const A = bacaData(a, "sampel");
    if (A.galat) return { galat: A.galat };
    const nol = Number(mu0);
    if (String(mu0 ?? "").trim() === "" || !Number.isFinite(nol)) {
      return { galat: "Isi nilai rata-rata hipotesis (μ0), misalnya 75." };
    }
    const { n, mean, sd } = ringkasData(A.data);
    if (sd === 0) {
      return { galat: "Semua data sama (simpangan baku 0), jadi uji t tidak bisa dihitung." };
    }
    const se = sd / Math.sqrt(n);
    const nilaiT = (mean - nol) / se;
    const df = n - 1;

    return susunHasil({
      jenis,
      nilaiT,
      df,
      alpha: al,
      ringkasanTambahan: [
        { label: t`Rata-rata sampel ($\bar{x}$)`, nilai: `$${rapi(mean)}$` },
        { label: t`Galat baku ($s/\sqrt{n}$)`, nilai: `$${rapi(se)}$` },
      ],
      langkahHipotesis: [
        t`Uji t satu sampel: apakah rata-rata populasi berbeda dari nilai tertentu?`,
        t`$H_0: \mu = ${nol}$ dan $H_1: \mu \ne ${nol}$ (dua arah)`,
      ],
      langkahHitung: [
        t`Statistik data: $n = ${n}$, $\bar{x} = ${rapi(mean)}$, $s = ${rapi(sd)}$`,
        t`Rumus: $t = \dfrac{\bar{x} - \mu_0}{s / \sqrt{n}}$`,
        t`Masukkan angka: $t = \dfrac{${rapi(mean)} - ${nol}}{${rapi(sd)} / \sqrt{${n}}} = \dfrac{${rapi(mean - nol)}}{${rapi(se)}} = ${rapi(nilaiT)}$`,
        t`Derajat bebas: $db = n - 1 = ${df}$`,
      ],
      arti: (tolak) =>
        tolak
          ? `Rata-rata sampel (${kom(mean)}) berbeda nyata dari ${kom(nol)}. Perbedaan sebesar itu sulit terjadi hanya karena kebetulan pengambilan sampel.`
          : `Rata-rata sampel (${kom(mean)}) memang berbeda dari ${kom(nol)}, tetapi selisih itu masih wajar terjadi karena kebetulan pengambilan sampel. Belum cukup bukti bahwa rata-rata populasi berbeda dari ${kom(nol)}.`,
      asumsi: `Uji t mengandaikan data diambil acak dan kira-kira berdistribusi normal. Bila datanya hanya ${n}, periksa bentuk sebarannya (misalnya lewat histogram di mode Statistika) sebelum percaya hasilnya.`,
    });
  }

  // ----- Dua sampel bebas -----
  if (jenis === "bebas") {
    const A = bacaData(a, "Kelompok A");
    if (A.galat) return { galat: A.galat };
    const B = bacaData(b, "Kelompok B");
    if (B.galat) return { galat: B.galat };
    const sa = ringkasData(A.data);
    const sb = ringkasData(B.data);
    const df = sa.n + sb.n - 2;
    const sp2 = ((sa.n - 1) * sa.varians + (sb.n - 1) * sb.varians) / df;
    if (sp2 === 0) {
      return { galat: "Semua data di kedua kelompok sama (variasi 0), jadi uji t tidak bisa dihitung." };
    }
    const se = Math.sqrt(sp2 * (1 / sa.n + 1 / sb.n));
    const selisih = sa.mean - sb.mean;
    const nilaiT = selisih / se;

    // Pembanding Welch (varians tidak diasumsikan sama)
    const va = sa.varians / sa.n;
    const vb = sb.varians / sb.n;
    const seW = Math.sqrt(va + vb);
    const tW = selisih / seW;
    const dfW = (va + vb) ** 2 / (va ** 2 / (sa.n - 1) + vb ** 2 / (sb.n - 1));
    const pW = pDuaArah(tW, dfW);

    return susunHasil({
      jenis,
      nilaiT,
      df,
      alpha: al,
      ringkasanTambahan: [
        { label: t`Rata-rata A ($\bar{x}_1$)`, nilai: `$${rapi(sa.mean)}$` },
        { label: t`Rata-rata B ($\bar{x}_2$)`, nilai: `$${rapi(sb.mean)}$` },
        { label: "Selisih rata-rata (A − B)", nilai: `$${rapi(selisih)}$` },
      ],
      langkahHipotesis: [
        t`Uji t dua sampel bebas: apakah rata-rata kelompok A berbeda dari kelompok B?`,
        t`$H_0: \mu_1 = \mu_2$ dan $H_1: \mu_1 \ne \mu_2$ (dua arah)`,
      ],
      langkahHitung: [
        t`Kelompok A: $n_1 = ${sa.n}$, $\bar{x}_1 = ${rapi(sa.mean)}$, $s_1^2 = ${rapi(sa.varians)}$`,
        t`Kelompok B: $n_2 = ${sb.n}$, $\bar{x}_2 = ${rapi(sb.mean)}$, $s_2^2 = ${rapi(sb.varians)}$`,
        t`Varians gabungan: $s_p^2 = \dfrac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2} = ${rapi(sp2)}$`,
        t`Rumus: $t = \dfrac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_p^2 \left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$`,
        t`Masukkan angka: $t = \dfrac{${rapi(selisih)}}{${rapi(se)}} = ${rapi(nilaiT)}$`,
        t`Derajat bebas: $db = n_1 + n_2 - 2 = ${df}$`,
      ],
      pembanding: [
        t`Bila varians kedua kelompok dianggap tidak sama (Welch, baris "Equal variances not assumed" di SPSS): $t = ${rapi(tW)}$, $db = ${rapi(dfW, 2)}$, $p = ${tex(pW)}$.`,
        `Bila keputusan dari kedua cara berbeda, varians kedua kelompok kemungkinan jauh berbeda. Di SPSS hal ini diperiksa dengan uji Levene.`,
      ],
      arti: (tolak) =>
        tolak
          ? `Rata-rata kelompok A (${kom(sa.mean)}) dan B (${kom(sb.mean)}) berbeda nyata. Selisih ${kom(Math.abs(selisih))} sulit dijelaskan hanya oleh kebetulan.`
          : `Rata-rata kelompok A (${kom(sa.mean)}) dan B (${kom(sb.mean)}) memang berbeda, tetapi selisih ${kom(Math.abs(selisih))} masih wajar terjadi karena kebetulan. Belum cukup bukti bahwa kedua kelompok berbeda.`,
      asumsi: `Kedua kelompok harus saling bebas (orang di A bukan orang yang sama dengan di B), kira-kira berdistribusi normal, dan hasil utama mengandaikan varians sama. Lihat bagian Pembanding di langkah untuk versi Welch.`,
    });
  }

  // ----- Berpasangan -----
  if (jenis === "pasangan") {
    const A = bacaData(a, "pengukuran 1");
    if (A.galat) return { galat: A.galat };
    const B = bacaData(b, "pengukuran 2");
    if (B.galat) return { galat: B.galat };
    if (A.data.length !== B.data.length) {
      return {
        galat: `Uji berpasangan butuh jumlah data yang sama. Sekarang pengukuran 1 ada ${A.data.length} dan pengukuran 2 ada ${B.data.length}.`,
      };
    }
    const d = A.data.map((x, i) => x - B.data[i]);
    const { n, mean, sd } = ringkasData(d);
    if (sd === 0) {
      return { galat: "Semua selisih sama (simpangan baku 0), jadi uji t tidak bisa dihitung." };
    }
    const se = sd / Math.sqrt(n);
    const nilaiT = mean / se;
    const df = n - 1;
    const daftarSelisih = d.length <= 12 ? d.map((x) => rapi(x, 2)).join(", ") : `${d.slice(0, 10).map((x) => rapi(x, 2)).join(", ")}, \\ldots`;

    return susunHasil({
      jenis,
      nilaiT,
      df,
      alpha: al,
      ringkasanTambahan: [
        { label: t`Rata-rata selisih ($\bar{d}$)`, nilai: `$${rapi(mean)}$` },
        { label: t`Simpangan baku selisih ($s_d$)`, nilai: `$${rapi(sd)}$` },
      ],
      langkahHipotesis: [
        t`Uji t berpasangan: apakah rata-rata selisih dua pengukuran pada subjek yang sama berbeda dari nol?`,
        t`$H_0: \mu_d = 0$ dan $H_1: \mu_d \ne 0$ (dua arah)`,
      ],
      langkahHitung: [
        t`Selisih tiap pasangan ($d = A - B$): $${daftarSelisih}$`,
        t`Statistik selisih: $n = ${n}$, $\bar{d} = ${rapi(mean)}$, $s_d = ${rapi(sd)}$`,
        t`Rumus: $t = \dfrac{\bar{d}}{s_d / \sqrt{n}}$`,
        t`Masukkan angka: $t = \dfrac{${rapi(mean)}}{${rapi(sd)} / \sqrt{${n}}} = \dfrac{${rapi(mean)}}{${rapi(se)}} = ${rapi(nilaiT)}$`,
        t`Derajat bebas: $db = n - 1 = ${df}$`,
      ],
      arti: (tolak) =>
        tolak
          ? `Rata-rata selisih (${kom(mean)}) berbeda nyata dari nol, artinya ada perubahan yang konsisten antara pengukuran 1 dan 2. Tanda negatif berarti pengukuran 2 lebih besar daripada pengukuran 1.`
          : `Rata-rata selisih (${kom(mean)}) tidak cukup jauh dari nol, jadi belum ada bukti perubahan yang konsisten antara kedua pengukuran.`,
      asumsi: `Urutan data harus berpasangan: data ke-1 di kotak A dan data ke-1 di kotak B berasal dari subjek yang sama. Selisihnya sebaiknya kira-kira berdistribusi normal. Bila datanya hanya ${n} pasang, tafsirkan dengan hati-hati.`,
    });
  }

  return { galat: "Jenis uji tidak dikenal." };
}