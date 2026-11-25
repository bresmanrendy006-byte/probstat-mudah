// src/lib/distribusi.js
// Kalkulator distribusi: Binomial, Poisson, Normal.
// Setiap fungsi mengembalikan { ringkasan, langkah, grafik } atau { galat }.
// Bagian di antara $ ... $ ditulis dalam LaTeX dan digambar oleh komponen Teks.

import { erf } from "mathjs";

const t = String.raw;

// ---------- Fungsi bantu ----------

// Bulatkan, desimal pakai koma LaTeX {,} (hanya untuk di dalam $...$)
function rapi(x, d = 6) {
  if (!Number.isFinite(x)) return String(x);
  const k = 10 ** d;
  return String(Math.round(x * k) / k).replace(".", "{,}");
}

// Angka masukan apa adanya, desimal pakai koma LaTeX
function kt(x) {
  return String(x).replace(".", "{,}");
}

// Peluang dalam LaTeX; yang sangat kecil ditulis bentuk ilmiah
function tex(x) {
  if (x === 0) return "0";
  if (x < 0.0001) {
    const [m, e] = x.toExponential(3).split("e");
    return `${m.replace(".", "{,}")} \\times 10^{${Number(e)}}`;
  }
  return rapi(x);
}

// Ambil angka berlabel dari teks, misalnya "n = 10, p = 0.5" -> ambil(teks, ["p"]) = 0.5
function ambil(teks, nama) {
  for (const n of nama) {
    const re = new RegExp(
      `(?:^|[^a-zA-Zα-ωΑ-Ω])${n}\\s*[=:]\\s*(-?\\d+(?:\\.\\d+)?)`,
      "i"
    );
    const m = teks.match(re);
    if (m) return Number(m[1]);
  }
  return null;
}

// Tabel log(i!) untuk i = 0..n (menghindari angka raksasa)
function tabelLogFak(n) {
  const lf = [0];
  for (let i = 1; i <= n; i++) lf.push(lf[i - 1] + Math.log(i));
  return lf;
}

function jumlah(arr, dari, sampai) {
  let s = 0;
  for (let i = dari; i <= sampai; i++) s += arr[i];
  return Math.min(1, s);
}

// Fungsi sebaran kumulatif normal baku
function cdfNormal(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// ---------- Binomial ----------

export function prosesBinomial(teks) {
  const n = ambil(teks, ["n"]);
  const p = ambil(teks, ["p"]);
  const k = ambil(teks, ["k", "x"]);

  if (n === null || p === null || k === null) {
    return { galat: "Isi n, p, dan k. Contoh: n = 10, p = 0.5, k = 3." };
  }
  if (!Number.isInteger(n) || n < 1 || n > 1000) {
    return { galat: "n harus bilangan bulat antara 1 dan 1000." };
  }
  if (p < 0 || p > 1) {
    return { galat: "p adalah peluang, jadi harus antara 0 dan 1. Pakai titik untuk desimal (0.5)." };
  }
  if (!Number.isInteger(k) || k < 0 || k > n) {
    return { galat: "k harus bilangan bulat antara 0 dan n." };
  }

  const lf = tabelLogFak(n);
  const pm = Array.from({ length: n + 1 }, (_, i) => {
    if (p === 0) return i === 0 ? 1 : 0;
    if (p === 1) return i === n ? 1 : 0;
    return Math.exp(lf[n] - lf[i] - lf[n - i] + i * Math.log(p) + (n - i) * Math.log(1 - p));
  });

  const pSama = pm[k];
  const pKurang = jumlah(pm, 0, k);
  const pLebih = jumlah(pm, k, n);
  const rata = n * p;
  const varians = n * p * (1 - p);
  const simpangan = Math.sqrt(varians);

  // Rentang batang yang digambar: sekitar rata-rata ± 4 simpangan baku
  let lo = Math.max(0, Math.floor(rata - 4 * simpangan));
  let hi = Math.min(n, Math.ceil(rata + 4 * simpangan));
  lo = Math.min(lo, k);
  hi = Math.max(hi, k);
  const titik = [];
  for (let i = lo; i <= hi; i++) titik.push({ x: i, p: pm[i] });

  return {
    ringkasan: [
      { label: t`$P(X = ${k})$`, nilai: `$${tex(pSama)}$` },
      { label: t`$P(X \le ${k})$`, nilai: `$${tex(pKurang)}$` },
      { label: t`$P(X \ge ${k})$`, nilai: `$${tex(pLebih)}$` },
      { label: t`Rata-rata $E(X)$`, nilai: `$${rapi(rata)}$` },
      { label: t`Varians $Var(X)$`, nilai: `$${rapi(varians)}$` },
      { label: "Simpangan baku", nilai: `$${rapi(simpangan)}$` },
    ],
    langkah: [
      "# Distribusi binomial",
      t`Ciri: percobaan diulang $n = ${n}$ kali, peluang sukses tiap percobaan $p = ${kt(p)}$, dan yang dihitung banyaknya sukses $X$.`,
      t`Rumus: $P(X = k) = \binom{n}{k} \, p^k \, (1-p)^{n-k}$`,
      t`Masukkan angka: $P(X = ${k}) = \binom{${n}}{${k}} \, (${kt(p)})^{${k}} \, (${rapi(1 - p)})^{${n - k}}$`,
      t`Hasil: $P(X = ${k}) = ${tex(pSama)}$`,
      t`Kumulatif: $P(X \le ${k}) = \sum_{i=0}^{${k}} P(X = i) = ${tex(pKurang)}$`,
      t`Kumulatif: $P(X \ge ${k}) = \sum_{i=${k}}^{${n}} P(X = i) = ${tex(pLebih)}$`,
      t`Rata-rata: $E(X) = np = ${n} \times ${kt(p)} = ${rapi(rata)}$`,
      t`Varians: $Var(X) = np(1-p) = ${rapi(varians)}$`,
      t`Simpangan baku: $\sigma = \sqrt{Var(X)} = ${rapi(simpangan)}$`,
    ],
    grafik: { jenis: "diskrit", judul: "Distribusi binomial", titik, k },
  };
}

// ---------- Poisson ----------

export function prosesPoisson(teks) {
  const lam = ambil(teks, ["lambda", "λ", "lam"]);
  const k = ambil(teks, ["k", "x"]);

  if (lam === null || k === null) {
    return { galat: "Isi lambda dan k. Contoh: lambda = 4, k = 2." };
  }
  if (!(lam > 0) || lam > 500) {
    return { galat: "lambda (rata-rata kejadian) harus lebih dari 0 dan maksimal 500." };
  }
  if (!Number.isInteger(k) || k < 0 || k > 1000) {
    return { galat: "k harus bilangan bulat antara 0 dan 1000." };
  }

  const M = Math.max(k, Math.ceil(lam + 4 * Math.sqrt(lam) + 3));
  const lf = tabelLogFak(M);
  const pm = Array.from({ length: M + 1 }, (_, i) =>
    Math.exp(-lam + i * Math.log(lam) - lf[i])
  );

  const pSama = pm[k];
  const pKurang = jumlah(pm, 0, k);
  const pLebih = k === 0 ? 1 : Math.max(0, 1 - jumlah(pm, 0, k - 1));
  const simpangan = Math.sqrt(lam);

  let lo = Math.max(0, Math.floor(lam - 4 * simpangan));
  let hi = Math.ceil(lam + 4 * simpangan);
  lo = Math.min(lo, k);
  hi = Math.max(hi, k);
  const titik = [];
  for (let i = lo; i <= hi; i++) titik.push({ x: i, p: pm[i] });

  return {
    ringkasan: [
      { label: t`$P(X = ${k})$`, nilai: `$${tex(pSama)}$` },
      { label: t`$P(X \le ${k})$`, nilai: `$${tex(pKurang)}$` },
      { label: t`$P(X \ge ${k})$`, nilai: `$${tex(pLebih)}$` },
      { label: t`Rata-rata $E(X) = \lambda$`, nilai: `$${rapi(lam)}$` },
      { label: "Simpangan baku", nilai: `$${rapi(simpangan)}$` },
    ],
    langkah: [
      "# Distribusi Poisson",
      t`Ciri: banyaknya kejadian $X$ dalam satu selang, dengan rata-rata $\lambda = ${kt(lam)}$ kejadian per selang.`,
      t`Rumus: $P(X = k) = \dfrac{e^{-\lambda} \, \lambda^k}{k!}$`,
      t`Masukkan angka: $P(X = ${k}) = \dfrac{e^{-${kt(lam)}} \times ${kt(lam)}^{${k}}}{${k}!}$`,
      t`Hasil: $P(X = ${k}) = ${tex(pSama)}$`,
      t`Kumulatif: $P(X \le ${k}) = \sum_{i=0}^{${k}} P(X = i) = ${tex(pKurang)}$`,
      t`Kumulatif: $P(X \ge ${k}) = 1 - P(X \le ${k - 1}) = ${tex(pLebih)}$`,
      t`Pada Poisson, rata-rata dan varians sama: $E(X) = Var(X) = \lambda = ${rapi(lam)}$`,
      t`Simpangan baku: $\sigma = \sqrt{\lambda} = ${rapi(simpangan)}$`,
    ],
    grafik: { jenis: "diskrit", judul: "Distribusi Poisson", titik, k },
  };
}

// ---------- Normal ----------

export function prosesNormal(teks) {
  const mu = ambil(teks, ["mu", "μ", "mean"]);
  const sigma = ambil(teks, ["sigma", "σ", "sd"]);
  const x = ambil(teks, ["x"]);
  const a = ambil(teks, ["a"]);
  const b = ambil(teks, ["b"]);

  if (mu === null || sigma === null) {
    return { galat: "Isi mu dan sigma. Contoh: mu = 70, sigma = 10, x = 85." };
  }
  if (!(sigma > 0)) {
    return { galat: "sigma (simpangan baku) harus lebih dari 0." };
  }

  // Dua batas a dan b: P(a <= X <= b)
  if (a !== null && b !== null) {
    if (a >= b) return { galat: "Batas a harus lebih kecil dari b." };
    const za = (a - mu) / sigma;
    const zb = (b - mu) / sigma;
    const p = cdfNormal(zb) - cdfNormal(za);
    return {
      ringkasan: [
        { label: t`$P(${kt(a)} \le X \le ${kt(b)})$`, nilai: `$${tex(p)}$` },
        { label: t`Skor z batas bawah ($z_1$)`, nilai: `$${rapi(za)}$` },
        { label: t`Skor z batas atas ($z_2$)`, nilai: `$${rapi(zb)}$` },
      ],
      langkah: [
        "# Distribusi normal",
        t`Data berdistribusi normal dengan rata-rata $\mu = ${kt(mu)}$ dan simpangan baku $\sigma = ${kt(sigma)}$.`,
        t`Rumus skor z: $z = \dfrac{x - \mu}{\sigma}$`,
        t`Batas bawah: $z_1 = \dfrac{${kt(a)} - ${kt(mu)}}{${kt(sigma)}} = ${rapi(za)}$`,
        t`Batas atas: $z_2 = \dfrac{${kt(b)} - ${kt(mu)}}{${kt(sigma)}} = ${rapi(zb)}$`,
        t`Peluang di antara dua batas: $P(${kt(a)} \le X \le ${kt(b)}) = P(${rapi(za)} \le Z \le ${rapi(zb)}) = \Phi(${rapi(zb)}) - \Phi(${rapi(za)})$`,
        t`Hasil: $P(${kt(a)} \le X \le ${kt(b)}) = ${tex(p)}$`,
        `Catatan: Φ adalah peluang kumulatif distribusi normal baku (yang biasa dibaca dari tabel z).`,
      ],
      grafik: { jenis: "normal", mu, sigma, dari: a, sampai: b },
    };
  }

  // Satu batas x
  if (x === null) {
    return {
      galat: "Isi x (satu batas) atau a dan b (dua batas). Contoh: mu = 70, sigma = 10, x = 85.",
    };
  }
  const z = (x - mu) / sigma;
  const pKurang = cdfNormal(z);
  const pLebih = 1 - pKurang;

  return {
    ringkasan: [
      { label: t`Skor z`, nilai: `$${rapi(z)}$` },
      { label: t`$P(X \le ${kt(x)})$`, nilai: `$${tex(pKurang)}$` },
      { label: t`$P(X \ge ${kt(x)})$`, nilai: `$${tex(pLebih)}$` },
    ],
    langkah: [
      "# Distribusi normal",
      t`Data berdistribusi normal dengan rata-rata $\mu = ${kt(mu)}$ dan simpangan baku $\sigma = ${kt(sigma)}$.`,
      t`Skor z: $z = \dfrac{x - \mu}{\sigma} = \dfrac{${kt(x)} - ${kt(mu)}}{${kt(sigma)}} = ${rapi(z)}$`,
      t`Peluang di bawah $x$: $P(X \le ${kt(x)}) = P(Z \le ${rapi(z)}) = \Phi(${rapi(z)}) = ${tex(pKurang)}$`,
      t`Peluang di atas $x$: $P(X \ge ${kt(x)}) = 1 - P(X \le ${kt(x)}) = ${tex(pLebih)}$`,
      `Catatan: Φ adalah peluang kumulatif distribusi normal baku (yang biasa dibaca dari tabel z).`,
    ],
    grafik: { jenis: "normal", mu, sigma, dari: null, sampai: x },
  };
}