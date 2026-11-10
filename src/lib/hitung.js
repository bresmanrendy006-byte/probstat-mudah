// src/lib/hitung.js
// Fungsi hitungan dasar + langkah penyelesaian.
// Setiap fungsi mengembalikan:
//   { hasil: "teks hasil", langkah: ["langkah 1", "langkah 2", ...] }
// atau jika input tidak valid:
//   { galat: "pesan kesalahan" }

const BATAS_N = 100; // batas aman supaya hasil tidak terlalu raksasa

// ---------- Fungsi bantu ----------

function cekBilangan(nilai, nama, { min = 0 } = {}) {
  if (!Number.isInteger(nilai)) {
    return `${nama} harus bilangan bulat.`;
  }
  if (nilai < min) {
    return `${nama} tidak boleh kurang dari ${min}.`;
  }
  if (nilai > BATAS_N) {
    return `${nama} terlalu besar. Maksimal ${BATAS_N}.`;
  }
  return null;
}

// Faktorial memakai BigInt agar angka besar tetap tepat
function faktorialBig(n) {
  let hasil = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    hasil *= i;
  }
  return hasil;
}

// Tulis perkalian menurun: dari "mulai" turun sebanyak "banyak" suku
// Contoh: deretTurun(5, 3) -> "5 × 4 × 3"
function deretTurun(mulai, banyak) {
  if (banyak <= 0) return "1";
  const suku = [];
  for (let i = 0; i < banyak; i++) {
    suku.push(mulai - i);
  }
  if (suku.length > 6) {
    return `${suku.slice(0, 3).join(" × ")} × ... × ${suku[suku.length - 1]}`;
  }
  return suku.join(" × ");
}

// ---------- Faktorial ----------

export function hitungFaktorial(n) {
  const galat = cekBilangan(n, "n");
  if (galat) return { galat };

  const hasil = faktorialBig(n);

  return {
    hasil: hasil.toString(),
    langkah: [
      `Rumus: n! = n × (n − 1) × (n − 2) × ... × 1`,
      `Hitung ${n}! = ${deretTurun(n, n)}`,
      `Hasil: ${n}! = ${hasil}`,
      ...(n === 0 ? [`Catatan: 0! didefinisikan sama dengan 1.`] : []),
    ],
  };
}

// ---------- Permutasi ----------

export function hitungPermutasi(n, r) {
  const galatN = cekBilangan(n, "n");
  if (galatN) return { galat: galatN };
  const galatR = cekBilangan(r, "r");
  if (galatR) return { galat: galatR };
  if (r > n) return { galat: "r tidak boleh lebih besar dari n." };

  const hasil = faktorialBig(n) / faktorialBig(n - r);

  return {
    hasil: hasil.toString(),
    langkah: [
      `Rumus: P(n, r) = n! / (n − r)!`,
      `Masukkan angka: P(${n}, ${r}) = ${n}! / (${n} − ${r})! = ${n}! / ${n - r}!`,
      `Sederhanakan (coret yang sama): P(${n}, ${r}) = ${deretTurun(n, r)}`,
      `Hasil: P(${n}, ${r}) = ${hasil}`,
    ],
  };
}

// ---------- Kombinasi ----------

export function hitungKombinasi(n, r) {
  const galatN = cekBilangan(n, "n");
  if (galatN) return { galat: galatN };
  const galatR = cekBilangan(r, "r");
  if (galatR) return { galat: galatR };
  if (r > n) return { galat: "r tidak boleh lebih besar dari n." };

  const hasil =
    faktorialBig(n) / (faktorialBig(r) * faktorialBig(n - r));

  return {
    hasil: hasil.toString(),
    langkah: [
      `Rumus: C(n, r) = n! / (r! × (n − r)!)`,
      `Masukkan angka: C(${n}, ${r}) = ${n}! / (${r}! × ${n - r}!)`,
      `Sederhanakan: C(${n}, ${r}) = (${deretTurun(n, r)}) / ${r}!`,
      `Hasil: C(${n}, ${r}) = ${hasil}`,
    ],
  };
}