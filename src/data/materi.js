// src/data/materi.js
// Isi materi. Bagian di antara $ ... $ ditulis dalam LaTeX dan digambar oleh komponen Teks.
// Tulis LaTeX di dalam String.raw`...` supaya tanda \ tidak bermasalah.
// Urutan tampil di halaman Materi diatur di daftarBab.js, bukan di sini.

import { materiProbabilitas } from "./materiProbabilitas";

const t = String.raw;

const peluangSuatuKejadian = {
  slug: "peluang-suatu-kejadian",
  judul: "Peluang Suatu Kejadian",
  kategori: "Probabilitas",
  tingkat: "SMA", // "SMA" atau "Mahasiswa"
  video: [], // isi ID YouTube bila sudah ada

  pengertian: [
    t`Peluang adalah ukuran seberapa mungkin sebuah kejadian terjadi. Nilainya selalu berada di antara $0$ dan $1$. Nilai $0$ berarti mustahil terjadi, dan nilai $1$ berarti pasti terjadi.`,
    t`Himpunan semua hasil yang mungkin disebut ruang sampel ($S$). Kejadian ($K$) adalah himpunan bagian dari ruang sampel, yaitu hasil-hasil yang kita inginkan.`,
  ],

  rumus: [
    {
      nama: "Peluang kejadian K",
      tex: t`P(K) = \dfrac{n(K)}{n(S)}`,
      ket: t`$n(K)$ adalah banyak hasil yang diinginkan, dan $n(S)$ adalah banyak semua hasil yang mungkin.`,
    },
    {
      nama: "Peluang komplemen",
      tex: t`P(K') = 1 - P(K)`,
      ket: t`Peluang kejadian K tidak terjadi.`,
    },
  ],

  contoh: [
    {
      soal: "Sebuah dadu dilempar satu kali. Berapa peluang muncul angka genap?",
      diketahui: [
        t`Ruang sampel $S = \{1, 2, 3, 4, 5, 6\}$, sehingga $n(S) = 6$`,
        t`Kejadian $K$ = muncul angka genap $= \{2, 4, 6\}$, sehingga $n(K) = 3$`,
      ],
      ditanya: t`Peluang $K$, yaitu $P(K)$`,
      rumus: t`$P(K) = \dfrac{n(K)}{n(S)}$`,
      langkah: [
        t`Masukkan angka ke rumus: $P(K) = \dfrac{3}{6}$`,
        t`Sederhanakan pecahan dengan membagi pembilang dan penyebut dengan $3$: $P(K) = \dfrac{1}{2}$`,
      ],
      jawaban: t`Peluang muncul angka genap adalah $\dfrac{1}{2}$ atau $0{,}5$.`,
    },
    {
      soal: "Dua koin dilempar bersamaan. Berapa peluang muncul paling sedikit satu Angka?",
      diketahui: [
        t`Tiap koin punya sisi Angka (A) dan Gambar (G)`,
        t`Ruang sampel $S = \{AA, AG, GA, GG\}$, sehingga $n(S) = 4$`,
        t`Kejadian $K$ = paling sedikit satu Angka $= \{AA, AG, GA\}$, sehingga $n(K) = 3$`,
      ],
      ditanya: t`Peluang $K$, yaitu $P(K)$`,
      rumus: t`$P(K) = \dfrac{n(K)}{n(S)}$`,
      langkah: [
        t`Tulis semua hasil yang mungkin: $AA$, $AG$, $GA$, $GG$`,
        t`Pilih hasil yang memuat paling sedikit satu A: $AA$, $AG$, $GA$`,
        t`Masukkan angka ke rumus: $P(K) = \dfrac{3}{4}$`,
      ],
      jawaban: t`Peluang muncul paling sedikit satu Angka adalah $\dfrac{3}{4}$ atau $0{,}75$.`,
    },
  ],
};

export const daftarMateri = [peluangSuatuKejadian, ...materiProbabilitas];

export function cariMateri(slug) {
  return daftarMateri.find((m) => m.slug === slug);
}