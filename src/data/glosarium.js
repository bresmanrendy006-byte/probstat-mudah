// src/data/glosarium.js
// Daftar istilah glosarium. Untuk menambah: salin satu baris, ubah isinya.
// Field: istilah, arti, kategori ("Probabilitas" | "Statistika Dasar" | "Statistika Inferensial"),
// slug (opsional; materi terkait). LaTeX ditulis di dalam t`...` dan diapit $...$.

const t = String.raw;

export const glosarium = [
  // ===== Probabilitas =====
  { istilah: "Percobaan", arti: "Kegiatan yang hasilnya dapat diamati, misalnya melempar dadu.", kategori: "Probabilitas", slug: "konsep-dasar-peluang" },
  { istilah: "Ruang sampel", arti: t`Himpunan semua hasil yang mungkin dari suatu percobaan, ditulis $S$.`, kategori: "Probabilitas", slug: "konsep-dasar-peluang" },
  { istilah: "Kejadian", arti: "Himpunan bagian dari ruang sampel, yaitu hasil-hasil yang kita inginkan.", kategori: "Probabilitas", slug: "konsep-dasar-peluang" },
  { istilah: "Peluang", arti: t`Ukuran seberapa mungkin suatu kejadian terjadi: $P(K) = \dfrac{n(K)}{n(S)}$, nilainya antara $0$ dan $1$.`, kategori: "Probabilitas", slug: "peluang-suatu-kejadian" },
  { istilah: "Komplemen", arti: t`Kejadian "tidak terjadinya $K$", dengan $P(K') = 1 - P(K)$.`, kategori: "Probabilitas", slug: "peluang-suatu-kejadian" },
  { istilah: "Kejadian saling lepas", arti: t`Dua kejadian yang tidak mungkin terjadi bersamaan, sehingga $P(A \cap B) = 0$.`, kategori: "Probabilitas", slug: "aturan-penjumlahan" },
  { istilah: "Kejadian saling bebas", arti: t`Dua kejadian yang tidak saling memengaruhi, sehingga $P(A \cap B) = P(A) \cdot P(B)$.`, kategori: "Probabilitas", slug: "aturan-perkalian" },
  { istilah: "Peluang bersyarat", arti: t`Peluang $A$ setelah diketahui $B$ sudah terjadi: $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$.`, kategori: "Probabilitas", slug: "peluang-bersyarat" },
  { istilah: "Teorema Bayes", arti: "Rumus untuk membalik arah syarat dan memperbarui peluang awal setelah ada informasi baru.", kategori: "Probabilitas", slug: "teorema-bayes" },
  { istilah: "Peluang total", arti: "Peluang suatu kejadian yang dihitung dengan menjumlahkan semua jalur yang mungkin, dipakai sebelum Teorema Bayes.", kategori: "Probabilitas", slug: "teorema-bayes" },
  { istilah: "Faktorial", arti: t`Hasil kali bilangan bulat dari $n$ turun sampai $1$, ditulis $n!$.`, kategori: "Probabilitas" },
  { istilah: "Permutasi", arti: "Banyak susunan objek bila urutan diperhatikan.", kategori: "Probabilitas" },
  { istilah: "Kombinasi", arti: "Banyak pilihan objek bila urutan tidak diperhatikan.", kategori: "Probabilitas" },

  // ===== Statistika Dasar =====
  { istilah: "Statistika", arti: "Ilmu tentang mengumpulkan, menyajikan, menganalisis, dan menafsirkan data.", kategori: "Statistika Dasar", slug: "pengertian-statistika" },
  { istilah: "Populasi", arti: "Seluruh objek yang menjadi sasaran penelitian.", kategori: "Statistika Dasar", slug: "pengertian-statistika" },
  { istilah: "Sampel", arti: "Sebagian dari populasi yang benar-benar diamati.", kategori: "Statistika Dasar", slug: "pengertian-statistika" },
  { istilah: "Parameter", arti: "Ukuran yang dihitung dari seluruh populasi, misalnya mean populasi $\\mu$.", kategori: "Statistika Dasar", slug: "pengertian-statistika" },
  { istilah: "Statistik", arti: t`Ukuran yang dihitung dari sampel, misalnya mean sampel $\bar{x}$.`, kategori: "Statistika Dasar", slug: "pengertian-statistika" },
  { istilah: "Skala nominal", arti: "Skala data berupa kategori tanpa urutan, misalnya jenis kelamin.", kategori: "Statistika Dasar", slug: "jenis-data-dan-skala" },
  { istilah: "Skala ordinal", arti: "Skala data berupa kategori yang berurutan, tetapi jarak antartingkat tidak pasti sama.", kategori: "Statistika Dasar", slug: "jenis-data-dan-skala" },
  { istilah: "Skala interval", arti: "Skala angka dengan jarak sama tetapi tanpa nol mutlak, misalnya suhu dalam °C.", kategori: "Statistika Dasar", slug: "jenis-data-dan-skala" },
  { istilah: "Skala rasio", arti: "Skala angka dengan jarak sama dan nol mutlak, misalnya berat badan.", kategori: "Statistika Dasar", slug: "jenis-data-dan-skala" },
  { istilah: "Mean", arti: "Rata-rata: jumlah semua data dibagi banyaknya data.", kategori: "Statistika Dasar", slug: "ukuran-pemusatan" },
  { istilah: "Median", arti: "Nilai tengah setelah data diurutkan.", kategori: "Statistika Dasar", slug: "ukuran-pemusatan" },
  { istilah: "Modus", arti: "Nilai yang paling sering muncul.", kategori: "Statistika Dasar", slug: "ukuran-pemusatan" },
  { istilah: "Pencilan", arti: "Nilai yang sangat jauh dari kebanyakan data; paling memengaruhi mean.", kategori: "Statistika Dasar", slug: "ukuran-pemusatan" },
  { istilah: "Range (jangkauan)", arti: "Selisih nilai terbesar dan terkecil.", kategori: "Statistika Dasar", slug: "ukuran-penyebaran" },
  { istilah: "Varians", arti: "Rata-rata kuadrat selisih data terhadap mean; sampel dibagi $n-1$, populasi dibagi $N$.", kategori: "Statistika Dasar", slug: "ukuran-penyebaran" },
  { istilah: "Simpangan baku", arti: "Akar kuadrat varians; satuannya sama dengan data.", kategori: "Statistika Dasar", slug: "ukuran-penyebaran" },
  { istilah: "Kuartil", arti: "Nilai yang membagi data terurut menjadi empat bagian sama banyak ($Q_1$, $Q_2$, $Q_3$).", kategori: "Statistika Dasar", slug: "ukuran-penyebaran" },
  { istilah: "IQR", arti: t`Jangkauan antarkuartil: $Q_3 - Q_1$.`, kategori: "Statistika Dasar", slug: "ukuran-penyebaran" },

  // ===== Statistika Inferensial =====
  { istilah: "Hipotesis nol ($H_0$)", arti: "Pernyataan bahwa tidak ada perbedaan atau tidak ada efek.", kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "Hipotesis alternatif ($H_1$)", arti: "Pernyataan yang ingin dibuktikan oleh peneliti.", kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "Taraf signifikansi (alpha)", arti: t`Batas peluang kesalahan Tipe I yang kita terima, biasanya $\alpha = 0{,}05$.`, kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "P-value", arti: t`Peluang memperoleh hasil sedekat atau lebih ekstrem dari yang diamati, bila $H_0$ benar. Tolak $H_0$ bila $p \le \alpha$.`, kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "Statistik uji", arti: "Angka yang dihitung dari sampel untuk memutuskan menolak atau tidak menolak $H_0$, misalnya $t$ atau $F$.", kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "Nilai kritis", arti: "Batas pada distribusi uji; bila statistik uji melewatinya, $H_0$ ditolak.", kategori: "Statistika Inferensial", slug: "dasar-uji-hipotesis" },
  { istilah: "Derajat bebas (db)", arti: t`Banyak informasi bebas yang dipakai; pada uji t satu sampel $db = n - 1$.`, kategori: "Statistika Inferensial", slug: "uji-t" },
  { istilah: "Kesalahan Tipe I", arti: t`Menolak $H_0$ padahal $H_0$ benar (alarm palsu). Peluangnya $\alpha$.`, kategori: "Statistika Inferensial", slug: "kesalahan-tipe-i-ii-power" },
  { istilah: "Kesalahan Tipe II", arti: t`Gagal menolak $H_0$ padahal $H_0$ salah. Peluangnya $\beta$.`, kategori: "Statistika Inferensial", slug: "kesalahan-tipe-i-ii-power" },
  { istilah: "Power", arti: t`Peluang menolak $H_0$ dengan benar saat $H_0$ memang salah: $1 - \beta$.`, kategori: "Statistika Inferensial", slug: "kesalahan-tipe-i-ii-power" },
  { istilah: "Skor Z", arti: t`Jarak suatu nilai dari mean dalam satuan simpangan baku: $Z = \dfrac{x - \mu}{\sigma}$.`, kategori: "Statistika Inferensial", slug: "distribusi-normal" },
  { istilah: "Distribusi normal", arti: "Distribusi berbentuk lonceng yang simetris di sekitar mean.", kategori: "Statistika Inferensial", slug: "distribusi-normal" },
  { istilah: "Uji t", arti: "Uji untuk membandingkan rata-rata: satu sampel, dua sampel bebas, atau berpasangan.", kategori: "Statistika Inferensial", slug: "uji-t" },
  { istilah: "Korelasi (r)", arti: t`Ukuran kekuatan dan arah hubungan linear dua variabel, bernilai $-1$ sampai $1$.`, kategori: "Statistika Inferensial", slug: "korelasi-dan-regresi" },
  { istilah: "Koefisien determinasi ($r^2$)", arti: "Proporsi variasi $y$ yang dijelaskan oleh $x$.", kategori: "Statistika Inferensial", slug: "korelasi-dan-regresi" },
  { istilah: "Regresi linear", arti: t`Garis $\hat{y} = a + bx$ untuk memprediksi $y$ dari $x$.`, kategori: "Statistika Inferensial", slug: "korelasi-dan-regresi" },
  { istilah: "ANOVA", arti: "Uji untuk membandingkan rata-rata tiga kelompok atau lebih sekaligus.", kategori: "Statistika Inferensial", slug: "anova-satu-arah" },
  { istilah: "Statistik F", arti: "Perbandingan variasi antar kelompok dengan variasi dalam kelompok.", kategori: "Statistika Inferensial", slug: "anova-satu-arah" },
  { istilah: "Uji lanjut (post hoc)", arti: "Uji sesudah ANOVA signifikan untuk mencari pasangan kelompok yang berbeda, misalnya Tukey.", kategori: "Statistika Inferensial", slug: "anova-satu-arah" },
  { istilah: "Sig. (di SPSS)", arti: "Kolom p-value pada output SPSS. Bila $\\le 0{,}05$, tolak $H_0$.", kategori: "Statistika Inferensial", slug: "spss-uji-beda-rata-rata" },
  { istilah: "Uji Levene", arti: "Uji kesamaan varians dua kelompok pada output Independent-Samples T Test SPSS.", kategori: "Statistika Inferensial", slug: "spss-uji-beda-rata-rata" },
];