// src/lib/regresi.js
// Korelasi Pearson dan regresi linear sederhana, lengkap dengan uji signifikansi.
// Mengembalikan { ringkasan, langkah, grafik, keterangan } atau { galat }.

import { pDuaArah } from "./uji";
import { kekuatanKorelasi, tafsirPValue } from "./keterangan";

const t = String.raw;

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

// Angka t dalam LaTeX (korelasi sempurna menghasilkan t tak hingga)
function texT(x) {
  if (x === Infinity) return "\\infty";
  if (x === -Infinity) return "-\\infty";
  return rapi(x);
}

function bacaData(teks, nama) {
  const potongan = (teks || "").split(/[\s,;]+/).filter(Boolean);
  if (potongan.length === 0) return { galat: `Isi data ${nama} dulu. Contoh: 1, 2, 3, 4, 5.` };
  const data = potongan.map(Number);
  if (data.some((x) => !Number.isFinite(x))) {
    return {
      galat: `Data ${nama} berisi isian yang bukan angka. Pisahkan dengan koma, desimal pakai titik (7.5).`,
    };
  }
  if (data.length > 1000) return { galat: `Data ${nama} terlalu banyak. Maksimal 1000 angka.` };
  return { data };
}

// ---------- Fungsi utama ----------

// masukan: { x: "teks", y: "teks", alpha }
export function prosesKorelasi({ x: teksX, y: teksY, alpha }) {
  const al = Number(alpha);
  if (!(al > 0 && al < 1)) return { galat: "Taraf signifikansi tidak valid." };

  const X = bacaData(teksX, "X");
  if (X.galat) return { galat: X.galat };
  const Y = bacaData(teksY, "Y");
  if (Y.galat) return { galat: Y.galat };

  const x = X.data;
  const y = Y.data;
  if (x.length !== y.length) {
    return {
      galat: `Jumlah data X dan Y harus sama (berpasangan). Sekarang X ada ${x.length} dan Y ada ${y.length}.`,
    };
  }
  const n = x.length;
  if (n < 3) return { galat: "Minimal 3 pasang data." };

  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
    sxy += (x[i] - mx) * (y[i] - my);
  }
  if (sxx === 0) return { galat: "Semua nilai X sama, jadi korelasi dan regresi tidak bisa dihitung." };
  if (syy === 0) return { galat: "Semua nilai Y sama, jadi korelasi dan regresi tidak bisa dihitung." };

  const r = Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy)));
  const r2 = r * r;
  const df = n - 2;
  const nilaiT =
    Math.abs(r) >= 1 ? (r > 0 ? Infinity : -Infinity) : r * Math.sqrt(df / (1 - r2));
  const p = pDuaArah(nilaiT, df);
  const tolak = p < al;

  // Regresi: y-topi = a + b x
  const b = sxy / sxx;
  const a = my - b * mx;
  const persamaan = t`\hat{y} = ${rapi(a)} ${b >= 0 ? "+" : "-"} ${rapi(Math.abs(b))}\,x`;

  const arah = r > 0 ? "naik" : "turun";

  return {
    ringkasan: [
      { label: t`Korelasi ($r$)`, nilai: `$${rapi(r)}$` },
      { label: t`Determinasi ($r^2$)`, nilai: `$${rapi(r2)}$` },
      { label: t`Statistik $t$`, nilai: `$${texT(nilaiT)}$` },
      { label: "Derajat bebas", nilai: `$${df}$` },
      { label: t`$p$-value (dua arah)`, nilai: `$${tex(p)}$` },
      { label: "Keputusan", nilai: tolak ? "H₀ ditolak" : "H₀ tidak ditolak" },
      { label: "Intersep (a)", nilai: `$${rapi(a)}$` },
      { label: "Kemiringan (b)", nilai: `$${rapi(b)}$` },
      { label: "Persamaan regresi", nilai: `$${persamaan}$` },
    ],
    langkah: [
      "# Data",
      t`Banyak pasangan data: $n = ${n}$`,
      t`Rata-rata: $\bar{x} = ${rapi(mx)}$ dan $\bar{y} = ${rapi(my)}$`,
      t`Jumlah hasil kali simpangan: $S_{xy} = \sum (x - \bar{x})(y - \bar{y}) = ${rapi(sxy)}$`,
      t`Jumlah kuadrat simpangan: $S_{xx} = \sum (x - \bar{x})^2 = ${rapi(sxx)}$ dan $S_{yy} = \sum (y - \bar{y})^2 = ${rapi(syy)}$`,
      "# Korelasi",
      t`Rumus: $r = \dfrac{S_{xy}}{\sqrt{S_{xx} \, S_{yy}}}$`,
      t`Masukkan angka: $r = \dfrac{${rapi(sxy)}}{\sqrt{${rapi(sxx)} \times ${rapi(syy)}}} = ${rapi(r)}$`,
      t`Koefisien determinasi: $r^2 = ${rapi(r2)}$, artinya sekitar ${kom(r2 * 100, 1)}% variasi $y$ dijelaskan oleh $x$.`,
      "# Uji signifikansi",
      t`$H_0: \rho = 0$ (tidak ada hubungan lurus) dan $H_1: \rho \ne 0$ (dua arah), $\alpha = ${rapi(al)}$`,
      t`Rumus: $t = r \sqrt{\dfrac{n-2}{1-r^2}}$`,
      t`Masukkan angka: $t = ${rapi(r)} \sqrt{\dfrac{${df}}{1 - ${rapi(r2)}}} = ${texT(nilaiT)}$ dengan $db = n - 2 = ${df}$`,
      t`p-value (dua arah): $p = ${tex(p)}$`,
      tolak
        ? t`Karena $p < \alpha$, maka $H_0$ ditolak.`
        : t`Karena $p \ge \alpha$, maka $H_0$ tidak ditolak.`,
      tafsirPValue(p, al),
      "# Regresi linear",
      t`Kemiringan: $b = \dfrac{S_{xy}}{S_{xx}} = \dfrac{${rapi(sxy)}}{${rapi(sxx)}} = ${rapi(b)}$`,
      t`Intersep: $a = \bar{y} - b\bar{x} = ${rapi(my)} - ${rapi(b)} \times ${rapi(mx)} = ${rapi(a)}$`,
      t`Persamaan: $${persamaan}$`,
      `Pada regresi linear sederhana, uji untuk kemiringan b memberi t dan p-value yang sama dengan uji korelasi di atas.`,
    ],
    grafik: { jenis: "scatter", x, y, a, b },
    keterangan: [
      { judul: "Kekuatan dan arah", isi: kekuatanKorelasi(r) },
      {
        judul: "Signifikansi",
        isi: `${tafsirPValue(p, al)} ${
          tolak
            ? "Hubungan lurus yang terlihat di sampel ini cukup kuat untuk dianggap ada juga di populasinya."
            : "Hubungan di sampel ini bisa saja muncul hanya karena kebetulan, jadi belum cukup bukti adanya hubungan lurus."
        }`,
      },
      {
        judul: "Arti garis regresi",
        isi: `Setiap X naik 1 satuan, Y diperkirakan ${arah} ${kom(Math.abs(b), 3)} satuan. Nilai r² = ${kom(r2, 3)} berarti sekitar ${kom(r2 * 100, 1)}% variasi Y dijelaskan oleh X.`,
      },
      {
        judul: "Catatan",
        isi: `Korelasi tidak membuktikan sebab-akibat, dan r hanya mengukur hubungan garis lurus. Satu pencilan bisa mengubah r banyak, jadi lihat juga grafiknya.${
          n < 30 ? ` Datanya hanya ${n} pasang, jadi tafsirkan dengan hati-hati.` : ""
        }`,
      },
    ],
  };
}