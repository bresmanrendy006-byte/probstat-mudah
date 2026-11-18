// src/data/video.js
// Daftar 27 video. Untuk menambah video: isi "id" dengan ID YouTube (11 karakter setelah v=
// atau setelah youtu.be/). Biarkan "" bila belum ada, kartunya otomatis tampil "Segera hadir".
// Isi "slug" bila video ini punya halaman materi (muncul tautan "Baca materinya").

export const bagianVideo = [
  {
    judul: "Peluang Dasar",
    warna: "from-lavender to-peach/60",
    video: [
      { judul: "Cara Memakai Website", id: "" },
      { judul: "Bekal Hitungan", id: "" },
      { judul: "Konsep Dasar Peluang", id: "", slug: "konsep-dasar-peluang" },
      { judul: "Peluang Suatu Kejadian", id: "", slug: "peluang-suatu-kejadian" },
      { judul: "Permutasi dan Kombinasi", id: "" },
      { judul: "Aturan Penjumlahan", id: "", slug: "aturan-penjumlahan" },
      { judul: "Aturan Perkalian", id: "", slug: "aturan-perkalian" },
    ],
  },
  {
    judul: "Bersyarat, Bayes, dan Dasar Uji",
    warna: "from-mint/50 to-lavender",
    video: [
      { judul: "Peluang Bersyarat", id: "", slug: "peluang-bersyarat" },
      { judul: "Teorema Bayes", id: "gnjYXzCeOQE", slug: "teorema-bayes" },
      { judul: "Dasar Uji Hipotesis", id: "_BaflviQadY" },
      { judul: "Kesalahan Tipe I, II, dan Power", id: "LZ07umhEuqk" },
      { judul: "Memilih Uji yang Tepat", id: "" },
    ],
  },
  {
    judul: "Distribusi Diskrit",
    warna: "from-sun/60 to-mint/40",
    video: [
      { judul: "Peubah Acak dan Fungsi Peluang", id: "" },
      { judul: "Distribusi Binomial", id: "" },
      { judul: "Distribusi Hipergeometrik", id: "" },
      { judul: "Geometrik dan Binomial Negatif", id: "" },
      { judul: "Distribusi Poisson", id: "" },
    ],
  },
  {
    judul: "Normal dan Statistika",
    warna: "from-rose/60 to-lavender",
    video: [
      { judul: "Distribusi Normal dan Skor Z", id: "" },
      { judul: "Statistika Deskriptif", id: "", slug: "ukuran-pemusatan" },
      { judul: "Membaca Histogram dan Boxplot", id: "" },
      { judul: "Distribusi Sampling", id: "" },
      { judul: "Distribusi t dan Interval Kepercayaan", id: "" },
    ],
  },
  {
    judul: "Uji Beda Rata-Rata",
    warna: "from-peach/60 to-rose/50",
    video: [
      { judul: "One-Sample T Test", id: "" },
      { judul: "Independent-Samples T Test", id: "" },
      { judul: "Paired-Samples T Test", id: "" },
      { judul: "One-Way ANOVA", id: "" },
      { judul: "Input Data dan Membaca Output SPSS", id: "", slug: "input-data-spss" },
    ],
  },
];