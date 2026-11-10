// src/lib/hitung.js
// Faktorial, permutasi, kombinasi + langkah penyelesaian.
// Bagian di antara $ ... $ ditulis dalam LaTeX dan digambar oleh komponen Teks.
// Setiap fungsi mengembalikan { hasil, langkah } atau { galat }.

const t = String.raw; // supaya tanda \ di LaTeX tidak bermasalah
const BATAS_N = 100;

// ---------- Fungsi bantu ----------

function cekBilangan(nilai, nama, { min = 0 } = {}) {
  if (!Number.isInteger(nilai)) return `${nama} harus bilangan bulat.`;
  if (nilai < min) return `${nama} tidak boleh kurang dari ${min}.`;
  if (nilai > BATAS_N) return `${nama} terlalu besar. Maksimal ${BATAS_N}.`;
  return null;
}

function faktorialBig(n) {
  let hasil = 1n;
  for (let i = 2n; i <= BigInt(n); i++) hasil *= i;
  return hasil;
}

// Perkalian menurun dalam LaTeX. Contoh: deretTurun(5, 3) -> 5 \times 4 \times 3
function deretTurun(mulai, banyak) {
  if (banyak <= 0) return "1";
  const suku = [];
  for (let i = 0; i < banyak; i++) suku.push(mulai - i);
  if (suku.length > 6) {
    return t`${suku.slice(0, 3).join(t` \times `)} \times \cdots \times ${suku[suku.length - 1]}`;
  }
  return suku.join(t` \times `);
}

// ---------- Faktorial ----------

export function hitungFaktorial(n) {
  const galat = cekBilangan(n, "n");
  if (galat) return { galat };

  const hasil = faktorialBig(n);

  return {
    hasil: hasil.toString(),
    langkah: [
      t`Rumus: $n! = n \times (n-1) \times (n-2) \times \cdots \times 1$`,
      t`Hitung: $${n}! = ${deretTurun(n, n)}$`,
      t`Hasil: $${n}! = ${hasil}$`,
      ...(n === 0 ? [t`Catatan: $0! = 1$ sudah ditetapkan dalam definisi.`] : []),
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
      t`Rumus: $P(n, r) = \dfrac{n!}{(n-r)!}$`,
      t`Masukkan angka: $P(${n}, ${r}) = \dfrac{${n}!}{(${n}-${r})!} = \dfrac{${n}!}{${n - r}!}$`,
      t`Sederhanakan (coret yang sama): $P(${n}, ${r}) = ${deretTurun(n, r)}$`,
      t`Hasil: $P(${n}, ${r}) = ${hasil}$`,
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

  const hasil = faktorialBig(n) / (faktorialBig(r) * faktorialBig(n - r));

  return {
    hasil: hasil.toString(),
    langkah: [
      t`Rumus: $C(n, r) = \dfrac{n!}{r! \, (n-r)!}$`,
      t`Masukkan angka: $C(${n}, ${r}) = \dfrac{${n}!}{${r}! \, (${n}-${r})!} = \dfrac{${n}!}{${r}! \times ${n - r}!}$`,
      t`Sederhanakan: $C(${n}, ${r}) = \dfrac{${deretTurun(n, r)}}{${r}!}$`,
      t`Hasil: $C(${n}, ${r}) = ${hasil}$`,
    ],
  };
}