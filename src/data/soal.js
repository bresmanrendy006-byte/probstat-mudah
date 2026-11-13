// src/data/soal.js
// Bank soal kuis. Satu sumber kebenaran, sama seperti materi.
// Tiap soal: id (tetap, jangan diubah), slug (sama persis dengan slug materi),
// pertanyaan, pilihan (4 buah), benar (nomor pilihan yang benar, mulai dari 0: 0=A, 1=B, 2=C, 3=D), pembahasan.
// Rumus ditulis LaTeX di dalam String.raw`...` dan diapit $...$.

import { cariMateri } from "./materi";

const t = String.raw;

export const bankSoal = [
  // ===== Konsep Dasar Peluang =====
  {
    id: "kd-001",
    slug: "konsep-dasar-peluang",
    pertanyaan: t`Dua dadu dilempar bersamaan. Berapa banyak anggota ruang sampelnya?`,
    pilihan: [t`$6$`, t`$12$`, t`$36$`, t`$66$`],
    benar: 2,
    pembahasan: t`Tiap dadu punya $6$ kemungkinan, sehingga $n(S) = 6 \times 6 = 36$.`,
  },
  {
    id: "kd-002",
    slug: "konsep-dasar-peluang",
    pertanyaan: t`Apa yang dimaksud dengan kejadian dalam peluang?`,
    pilihan: [
      t`Himpunan semua hasil yang mungkin`,
      t`Himpunan bagian dari ruang sampel`,
      t`Bilangan di antara $0$ dan $1$`,
      t`Proses mengulang suatu percobaan`,
    ],
    benar: 1,
    pembahasan: t`Kejadian adalah himpunan bagian dari ruang sampel, yaitu hasil-hasil yang kita inginkan. Himpunan semua hasil yang mungkin disebut ruang sampel.`,
  },
  {
    id: "kd-003",
    slug: "konsep-dasar-peluang",
    pertanyaan: t`Tiga koin dilempar bersamaan. Berapa banyak anggota ruang sampelnya?`,
    pilihan: [t`$3$`, t`$6$`, t`$8$`, t`$9$`],
    benar: 2,
    pembahasan: t`Tiap koin punya $2$ kemungkinan, sehingga $n(S) = 2 \times 2 \times 2 = 8$.`,
  },
  {
    id: "kd-004",
    slug: "konsep-dasar-peluang",
    pertanyaan: t`Sebuah dadu dilempar satu kali. Kejadian $K$ adalah muncul angka lebih dari $4$. Anggota $K$ adalah ...`,
    pilihan: [t`$\{4, 5, 6\}$`, t`$\{5, 6\}$`, t`$\{1, 2, 3, 4\}$`, t`$\{6\}$`],
    benar: 1,
    pembahasan: t`Angka yang lebih dari $4$ pada dadu hanya $5$ dan $6$, sehingga $K = \{5, 6\}$. Angka $4$ tidak termasuk karena $4$ tidak lebih dari $4$.`,
  },
  {
    id: "kd-005",
    slug: "konsep-dasar-peluang",
    pertanyaan: t`Pada pelemparan satu dadu, manakah yang merupakan kejadian pasti?`,
    pilihan: [
      t`Muncul angka genap`,
      t`Muncul angka $6$`,
      t`Muncul angka kurang dari $7$`,
      t`Muncul angka lebih dari $6$`,
    ],
    benar: 2,
    pembahasan: t`Semua angka pada dadu ($1$ sampai $6$) kurang dari $7$, sehingga kejadian ini selalu terjadi dan peluangnya $1$. Muncul angka lebih dari $6$ adalah kejadian mustahil.`,
  },

  // ===== Peluang Suatu Kejadian =====
  {
    id: "psk-001",
    slug: "peluang-suatu-kejadian",
    pertanyaan: t`Sebuah dadu dilempar satu kali. Berapa peluang muncul angka prima?`,
    pilihan: [t`$\dfrac{1}{6}$`, t`$\dfrac{1}{3}$`, t`$\dfrac{1}{2}$`, t`$\dfrac{2}{3}$`],
    benar: 2,
    pembahasan: t`Ruang sampel $S = \{1, 2, 3, 4, 5, 6\}$, jadi $n(S) = 6$. Angka prima adalah $\{2, 3, 5\}$, jadi $n(K) = 3$. Maka $P(K) = \dfrac{3}{6} = \dfrac{1}{2}$.`,
  },
  {
    id: "psk-002",
    slug: "peluang-suatu-kejadian",
    pertanyaan: t`Berapa nilai peluang untuk kejadian yang mustahil terjadi?`,
    pilihan: [t`$0$`, t`$\dfrac{1}{2}$`, t`$1$`, t`$-1$`],
    benar: 0,
    pembahasan: t`Peluang selalu berada di antara $0$ dan $1$. Nilai $0$ berarti kejadian mustahil, dan nilai $1$ berarti kejadian pasti terjadi.`,
  },
  {
    id: "psk-003",
    slug: "peluang-suatu-kejadian",
    pertanyaan: t`Jika peluang hujan besok adalah $P(K) = 0{,}3$, berapa peluang besok tidak hujan?`,
    pilihan: [t`$0{,}3$`, t`$0{,}5$`, t`$0{,}7$`, t`$1{,}3$`],
    benar: 2,
    pembahasan: t`Peluang tidak hujan adalah peluang komplemen: $P(K') = 1 - P(K) = 1 - 0{,}3 = 0{,}7$.`,
  },
  {
    id: "psk-004",
    slug: "peluang-suatu-kejadian",
    pertanyaan: t`Dua koin dilempar bersamaan. Berapa peluang muncul dua Gambar?`,
    pilihan: [t`$\dfrac{1}{4}$`, t`$\dfrac{1}{3}$`, t`$\dfrac{1}{2}$`, t`$\dfrac{3}{4}$`],
    benar: 0,
    pembahasan: t`Ruang sampel $S = \{AA, AG, GA, GG\}$, jadi $n(S) = 4$. Hanya $GG$ yang memuat dua Gambar, jadi $n(K) = 1$. Maka $P(K) = \dfrac{1}{4}$.`,
  },
  {
    id: "psk-005",
    slug: "peluang-suatu-kejadian",
    pertanyaan: t`Satu kartu diambil acak dari satu set kartu bridge (52 kartu). Berapa peluang terambil kartu As?`,
    pilihan: [t`$\dfrac{1}{52}$`, t`$\dfrac{1}{26}$`, t`$\dfrac{1}{13}$`, t`$\dfrac{1}{4}$`],
    benar: 2,
    pembahasan: t`Ada $4$ kartu As dalam $52$ kartu, jadi $P(K) = \dfrac{4}{52} = \dfrac{1}{13}$.`,
  },

  // ===== Aturan Penjumlahan =====
  {
    id: "ap-001",
    slug: "aturan-penjumlahan",
    pertanyaan: t`Sebuah dadu dilempar satu kali. Berapa peluang muncul angka genap atau angka prima?`,
    pilihan: [t`$\dfrac{1}{6}$`, t`$\dfrac{1}{2}$`, t`$\dfrac{5}{6}$`, t`$1$`],
    benar: 2,
    pembahasan: t`Genap $= \{2, 4, 6\}$ dan prima $= \{2, 3, 5\}$. Irisannya $\{2\}$. Maka $P(A \cup B) = \dfrac{3}{6} + \dfrac{3}{6} - \dfrac{1}{6} = \dfrac{5}{6}$.`,
  },
  {
    id: "ap-002",
    slug: "aturan-penjumlahan",
    pertanyaan: t`Kejadian $A$ dan $B$ saling lepas dengan $P(A) = 0{,}3$ dan $P(B) = 0{,}4$. Berapa $P(A \cup B)$?`,
    pilihan: [t`$0{,}12$`, t`$0{,}35$`, t`$0{,}7$`, t`$1{,}2$`],
    benar: 2,
    pembahasan: t`Untuk kejadian saling lepas, $P(A \cap B) = 0$, sehingga $P(A \cup B) = P(A) + P(B) = 0{,}3 + 0{,}4 = 0{,}7$.`,
  },
  {
    id: "ap-003",
    slug: "aturan-penjumlahan",
    pertanyaan: t`Satu kartu diambil dari 52 kartu bridge. Berapa peluang terambil kartu As atau kartu Hati?`,
    pilihan: [t`$\dfrac{17}{52}$`, t`$\dfrac{4}{13}$`, t`$\dfrac{1}{2}$`, t`$\dfrac{1}{13}$`],
    benar: 1,
    pembahasan: t`Ada $4$ As dan $13$ Hati, dan satu kartu (As Hati) terhitung dua kali. Maka $n = 4 + 13 - 1 = 16$, sehingga $P = \dfrac{16}{52} = \dfrac{4}{13}$.`,
  },
  {
    id: "ap-004",
    slug: "aturan-penjumlahan",
    pertanyaan: t`Dua kejadian $A$ dan $B$ disebut saling lepas jika ...`,
    pilihan: [
      t`$P(A \cap B) = 0$`,
      t`$P(A \cap B) = P(A) \cdot P(B)$`,
      t`$P(A) = P(B)$`,
      t`$P(A \cup B) = 1$`,
    ],
    benar: 0,
    pembahasan: t`Kejadian saling lepas tidak mungkin terjadi bersamaan, sehingga irisannya kosong dan $P(A \cap B) = 0$.`,
  },
  {
    id: "ap-005",
    slug: "aturan-penjumlahan",
    pertanyaan: t`Diketahui $P(A) = 0{,}5$, $P(B) = 0{,}4$, dan $P(A \cap B) = 0{,}2$. Berapa $P(A \cup B)$?`,
    pilihan: [t`$0{,}9$`, t`$0{,}7$`, t`$0{,}5$`, t`$0{,}2$`],
    benar: 1,
    pembahasan: t`$P(A \cup B) = P(A) + P(B) - P(A \cap B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$.`,
  },

  // ===== Peluang Bersyarat =====
  {
    id: "pb-001",
    slug: "peluang-bersyarat",
    pertanyaan: t`Diketahui $P(A \cap B) = 0{,}2$ dan $P(B) = 0{,}5$. Berapa $P(A \mid B)$?`,
    pilihan: [t`$0{,}1$`, t`$0{,}4$`, t`$0{,}7$`, t`$2{,}5$`],
    benar: 1,
    pembahasan: t`$P(A \mid B) = \dfrac{P(A \cap B)}{P(B)} = \dfrac{0{,}2}{0{,}5} = 0{,}4$.`,
  },
  {
    id: "pb-002",
    slug: "peluang-bersyarat",
    pertanyaan: t`Sebuah dadu dilempar. Jika diketahui hasilnya genap, berapa peluang hasilnya angka $6$?`,
    pilihan: [t`$\dfrac{1}{6}$`, t`$\dfrac{1}{3}$`, t`$\dfrac{1}{2}$`, t`$\dfrac{2}{3}$`],
    benar: 1,
    pembahasan: t`Dengan syarat genap, ruang sampel menyempit menjadi $\{2, 4, 6\}$. Hanya satu yang bernilai $6$, sehingga peluangnya $\dfrac{1}{3}$.`,
  },
  {
    id: "pb-003",
    slug: "peluang-bersyarat",
    pertanyaan: t`Notasi $P(A \mid B)$ dibaca ...`,
    pilihan: [
      t`Peluang $A$ dan $B$ terjadi bersamaan`,
      t`Peluang $A$ atau $B$ terjadi`,
      t`Peluang $A$ terjadi, dengan syarat $B$ sudah terjadi`,
      t`Peluang $A$ dibagi peluang $B$`,
    ],
    benar: 2,
    pembahasan: t`Garis tegak $\mid$ dibaca "dengan syarat". $P(A \mid B)$ adalah peluang $A$ setelah kita tahu bahwa $B$ sudah terjadi.`,
  },
  {
    id: "pb-004",
    slug: "peluang-bersyarat",
    pertanyaan: t`Dalam kotak ada $5$ bola merah dan $3$ bola biru. Dua bola diambil satu per satu tanpa pengembalian. Jika bola pertama merah, berapa peluang bola kedua juga merah?`,
    pilihan: [t`$\dfrac{5}{8}$`, t`$\dfrac{4}{7}$`, t`$\dfrac{5}{7}$`, t`$\dfrac{1}{2}$`],
    benar: 1,
    pembahasan: t`Setelah satu bola merah terambil, tersisa $4$ merah dari total $7$ bola. Maka peluangnya $\dfrac{4}{7}$.`,
  },
  {
    id: "pb-005",
    slug: "peluang-bersyarat",
    pertanyaan: t`Diketahui $P(B) = 0{,}6$ dan $P(A \mid B) = 0{,}5$. Berapa $P(A \cap B)$?`,
    pilihan: [t`$0{,}3$`, t`$0{,}6$`, t`$0{,}5$`, t`$1{,}1$`],
    benar: 0,
    pembahasan: t`Dari $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$ diperoleh $P(A \cap B) = P(B) \cdot P(A \mid B) = 0{,}6 \times 0{,}5 = 0{,}3$.`,
  },

  // ===== Aturan Perkalian =====
  {
    id: "apk-001",
    slug: "aturan-perkalian",
    pertanyaan: t`Sebuah koin dan sebuah dadu dilempar bersamaan. Berapa peluang muncul Angka pada koin dan angka $6$ pada dadu?`,
    pilihan: [t`$\dfrac{1}{12}$`, t`$\dfrac{1}{8}$`, t`$\dfrac{7}{12}$`, t`$\dfrac{1}{6}$`],
    benar: 0,
    pembahasan: t`Kedua kejadian saling bebas, sehingga peluangnya dikalikan: $\dfrac{1}{2} \times \dfrac{1}{6} = \dfrac{1}{12}$.`,
  },
  {
    id: "apk-002",
    slug: "aturan-perkalian",
    pertanyaan: t`Tiga koin dilempar bersamaan. Berapa peluang ketiganya muncul Angka?`,
    pilihan: [t`$\dfrac{1}{8}$`, t`$\dfrac{1}{6}$`, t`$\dfrac{3}{8}$`, t`$\dfrac{1}{2}$`],
    benar: 0,
    pembahasan: t`Tiap koin saling bebas: $\dfrac{1}{2} \times \dfrac{1}{2} \times \dfrac{1}{2} = \dfrac{1}{8}$.`,
  },
  {
    id: "apk-003",
    slug: "aturan-perkalian",
    pertanyaan: t`Dua kejadian $A$ dan $B$ saling bebas jika ...`,
    pilihan: [
      t`$P(A \cap B) = 0$`,
      t`$P(A \cap B) = P(A) + P(B)$`,
      t`$P(A \cap B) = P(A) \cdot P(B)$`,
      t`$P(A) = 1 - P(B)$`,
    ],
    benar: 2,
    pembahasan: t`Dua kejadian saling bebas bila terjadinya satu tidak memengaruhi yang lain, sehingga $P(A \cap B) = P(A) \cdot P(B)$. Syarat $P(A \cap B) = 0$ adalah untuk kejadian saling lepas.`,
  },
  {
    id: "apk-004",
    slug: "aturan-perkalian",
    pertanyaan: t`Sebuah kantong berisi $4$ bola merah dan $6$ bola putih. Dua bola diambil satu per satu tanpa pengembalian. Berapa peluang keduanya merah?`,
    pilihan: [t`$\dfrac{4}{25}$`, t`$\dfrac{2}{15}$`, t`$\dfrac{1}{5}$`, t`$\dfrac{2}{5}$`],
    benar: 1,
    pembahasan: t`Bola pertama merah: $\dfrac{4}{10}$. Setelah itu tersisa $3$ merah dari $9$ bola, jadi bola kedua merah: $\dfrac{3}{9}$. Maka $P = \dfrac{4}{10} \times \dfrac{3}{9} = \dfrac{12}{90} = \dfrac{2}{15}$.`,
  },
  {
    id: "apk-005",
    slug: "aturan-perkalian",
    pertanyaan: t`Peluang hujan pada hari Senin adalah $0{,}3$ dan pada hari Selasa juga $0{,}3$ (dianggap saling bebas). Berapa peluang hujan pada kedua hari itu?`,
    pilihan: [t`$0{,}6$`, t`$0{,}3$`, t`$0{,}09$`, t`$0{,}9$`],
    benar: 2,
    pembahasan: t`Kejadian saling bebas, sehingga $P = 0{,}3 \times 0{,}3 = 0{,}09$.`,
  },

  // ===== Teorema Bayes =====
  {
    id: "tb-001",
    slug: "teorema-bayes",
    pertanyaan: t`Manakah rumus Teorema Bayes yang benar untuk $P(A \mid B)$?`,
    pilihan: [
      t`$\dfrac{P(A) \cdot P(B)}{P(B \mid A)}$`,
      t`$\dfrac{P(B \mid A) \cdot P(A)}{P(B)}$`,
      t`$\dfrac{P(B)}{P(B \mid A) \cdot P(A)}$`,
      t`$P(A) + P(B \mid A)$`,
    ],
    benar: 1,
    pembahasan: t`Teorema Bayes: $P(A \mid B) = \dfrac{P(B \mid A) \cdot P(A)}{P(B)}$.`,
  },
  {
    id: "tb-002",
    slug: "teorema-bayes",
    pertanyaan: t`Mesin $A$ menghasilkan $60\%$ produk dengan $2\%$ cacat. Mesin $B$ menghasilkan $40\%$ produk dengan $5\%$ cacat. Berapa peluang sebuah produk yang diambil acak cacat?`,
    pilihan: [t`$0{,}032$`, t`$0{,}07$`, t`$0{,}035$`, t`$0{,}1$`],
    benar: 0,
    pembahasan: t`Gunakan peluang total: $P(\text{cacat}) = 0{,}6 \times 0{,}02 + 0{,}4 \times 0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$.`,
  },
  {
    id: "tb-003",
    slug: "teorema-bayes",
    pertanyaan: t`Lanjutan soal sebelumnya: jika produk yang diambil ternyata cacat, berapa peluang produk itu berasal dari mesin $A$?`,
    pilihan: [t`$0{,}375$`, t`$0{,}6$`, t`$0{,}02$`, t`$0{,}5$`],
    benar: 0,
    pembahasan: t`$P(A \mid \text{cacat}) = \dfrac{0{,}6 \times 0{,}02}{0{,}032} = \dfrac{0{,}012}{0{,}032} = 0{,}375$.`,
  },
  {
    id: "tb-004",
    slug: "teorema-bayes",
    pertanyaan: t`Suatu penyakit diderita $1\%$ penduduk. Tes menghasilkan positif pada $90\%$ penderita dan pada $5\%$ orang sehat. Jika seseorang hasil tesnya positif, peluang ia benar-benar sakit sekitar ...`,
    pilihan: [t`$90\%$`, t`$15\%$`, t`$50\%$`, t`$1\%$`],
    benar: 1,
    pembahasan: t`$P(\text{positif}) = 0{,}01 \times 0{,}9 + 0{,}99 \times 0{,}05 = 0{,}0585$. Maka $P(\text{sakit} \mid \text{positif}) = \dfrac{0{,}009}{0{,}0585} \approx 0{,}154$, yaitu sekitar $15\%$. Hasilnya kecil karena penyakitnya langka, sehingga banyak hasil positif berasal dari orang sehat.`,
  },
  {
    id: "tb-005",
    slug: "teorema-bayes",
    pertanyaan: t`Teorema Bayes pada dasarnya dipakai untuk ...`,
    pilihan: [
      t`Menghitung rata-rata data`,
      t`Memperbarui peluang awal setelah mendapat informasi baru`,
      t`Menghitung banyak susunan objek`,
      t`Menentukan ruang sampel`,
    ],
    benar: 1,
    pembahasan: t`Bayes membalik arah syarat: dari $P(B \mid A)$ menjadi $P(A \mid B)$, sehingga peluang awal diperbarui setelah ada bukti baru.`,
  },

  // ===== Pengertian Statistika =====
  {
    id: "ps-001",
    slug: "pengertian-statistika",
    pertanyaan: t`Statistika adalah ilmu yang mempelajari ...`,
    pilihan: [
      t`Cara menghitung bilangan besar`,
      t`Cara mengumpulkan, menyajikan, menganalisis, dan menafsirkan data`,
      t`Hubungan antarhimpunan`,
      t`Sifat-sifat bangun ruang`,
    ],
    benar: 1,
    pembahasan: t`Statistika mencakup pengumpulan, penyajian, analisis, dan penafsiran data untuk mengambil keputusan.`,
  },
  {
    id: "ps-002",
    slug: "pengertian-statistika",
    pertanyaan: t`Seluruh objek yang menjadi sasaran penelitian disebut ...`,
    pilihan: [t`Sampel`, t`Populasi`, t`Variabel`, t`Statistik`],
    benar: 1,
    pembahasan: t`Populasi adalah keseluruhan objek yang diteliti, sedangkan sampel hanyalah sebagian dari populasi.`,
  },
  {
    id: "ps-003",
    slug: "pengertian-statistika",
    pertanyaan: t`Peneliti ingin mengetahui tinggi rata-rata siswa di satu kota, lalu mengukur $200$ siswa yang dipilih acak. Kelompok $200$ siswa itu disebut ...`,
    pilihan: [t`Populasi`, t`Parameter`, t`Sampel`, t`Data`],
    benar: 2,
    pembahasan: t`Kelompok $200$ siswa adalah bagian dari seluruh siswa di kota itu, sehingga disebut sampel.`,
  },
  {
    id: "ps-004",
    slug: "pengertian-statistika",
    pertanyaan: t`Menyimpulkan sifat populasi berdasarkan data sampel termasuk ...`,
    pilihan: [
      t`Statistika deskriptif`,
      t`Statistika inferensial`,
      t`Penyajian data`,
      t`Pengumpulan data`,
    ],
    benar: 1,
    pembahasan: t`Statistika inferensial menarik kesimpulan tentang populasi dari sampel. Statistika deskriptif hanya menggambarkan data yang ada.`,
  },
  {
    id: "ps-005",
    slug: "pengertian-statistika",
    pertanyaan: t`Rata-rata nilai yang dihitung dari sampel $50$ siswa disebut ...`,
    pilihan: [t`Parameter`, t`Populasi`, t`Statistik`, t`Variabel`],
    benar: 2,
    pembahasan: t`Ukuran yang dihitung dari sampel disebut statistik. Ukuran yang dihitung dari seluruh populasi disebut parameter.`,
  },

  // ===== Jenis Data dan Skala =====
  {
    id: "jd-001",
    slug: "jenis-data-dan-skala",
    pertanyaan: t`Jenis kelamin (laki-laki atau perempuan) termasuk skala ...`,
    pilihan: [t`Nominal`, t`Ordinal`, t`Interval`, t`Rasio`],
    benar: 0,
    pembahasan: t`Jenis kelamin hanya berupa kategori tanpa urutan, sehingga termasuk skala nominal.`,
  },
  {
    id: "jd-002",
    slug: "jenis-data-dan-skala",
    pertanyaan: t`Tingkat kepuasan (sangat puas, puas, kurang puas, tidak puas) termasuk skala ...`,
    pilihan: [t`Nominal`, t`Ordinal`, t`Interval`, t`Rasio`],
    benar: 1,
    pembahasan: t`Kategorinya punya urutan, tetapi jarak antarkategori tidak pasti sama. Itu ciri skala ordinal.`,
  },
  {
    id: "jd-003",
    slug: "jenis-data-dan-skala",
    pertanyaan: t`Suhu dalam derajat Celsius termasuk skala interval. Alasan yang tepat adalah ...`,
    pilihan: [
      t`Suhu hanya berupa kategori`,
      t`Jaraknya sama, tetapi tidak punya nol mutlak`,
      t`Suhu tidak bisa diurutkan`,
      t`Suhu punya nol mutlak`,
    ],
    benar: 1,
    pembahasan: t`Pada skala interval, selisih antarnilai bermakna tetapi nol bukan berarti "tidak ada". $0^\circ$C bukan berarti tidak ada suhu, sehingga tidak punya nol mutlak.`,
  },
  {
    id: "jd-004",
    slug: "jenis-data-dan-skala",
    pertanyaan: t`Berat badan dalam kilogram termasuk skala ...`,
    pilihan: [t`Nominal`, t`Ordinal`, t`Interval`, t`Rasio`],
    benar: 3,
    pembahasan: t`Berat badan punya nol mutlak ($0$ kg berarti tidak ada berat), sehingga perbandingan seperti "dua kali lebih berat" bermakna. Itu ciri skala rasio.`,
  },
  {
    id: "jd-005",
    slug: "jenis-data-dan-skala",
    pertanyaan: t`Manakah yang merupakan data diskrit?`,
    pilihan: [
      t`Tinggi badan siswa`,
      t`Berat sebuah apel`,
      t`Banyak siswa dalam satu kelas`,
      t`Suhu ruangan`,
    ],
    benar: 2,
    pembahasan: t`Data diskrit diperoleh dengan menghitung dan berupa bilangan bulat, seperti banyak siswa. Tinggi, berat, dan suhu diperoleh dengan mengukur sehingga bersifat kontinu.`,
  },

  // ===== Ukuran Pemusatan =====
  {
    id: "up-001",
    slug: "ukuran-pemusatan",
    pertanyaan: t`Berapa rata-rata (mean) dari data $4, 6, 8, 10, 12$?`,
    pilihan: [t`$6$`, t`$8$`, t`$10$`, t`$40$`],
    benar: 1,
    pembahasan: t`Mean $= \dfrac{4 + 6 + 8 + 10 + 12}{5} = \dfrac{40}{5} = 8$.`,
  },
  {
    id: "up-002",
    slug: "ukuran-pemusatan",
    pertanyaan: t`Berapa median dari data $3, 7, 5, 9, 1$?`,
    pilihan: [t`$3$`, t`$5$`, t`$7$`, t`$9$`],
    benar: 1,
    pembahasan: t`Urutkan dulu: $1, 3, 5, 7, 9$. Nilai tengahnya adalah $5$.`,
  },
  {
    id: "up-003",
    slug: "ukuran-pemusatan",
    pertanyaan: t`Berapa modus dari data $2, 3, 3, 4, 5, 5, 5, 6$?`,
    pilihan: [t`$3$`, t`$4$`, t`$5$`, t`$6$`],
    benar: 2,
    pembahasan: t`Modus adalah nilai yang paling sering muncul. Angka $5$ muncul $3$ kali, paling banyak.`,
  },
  {
    id: "up-004",
    slug: "ukuran-pemusatan",
    pertanyaan: t`Berapa median dari data $2, 4, 6, 8$?`,
    pilihan: [t`$4$`, t`$5$`, t`$6$`, t`$20$`],
    benar: 1,
    pembahasan: t`Banyak data genap, jadi median adalah rata-rata dua nilai tengah: $\dfrac{4 + 6}{2} = 5$.`,
  },
  {
    id: "up-005",
    slug: "ukuran-pemusatan",
    pertanyaan: t`Di antara ukuran pemusatan berikut, manakah yang paling terpengaruh oleh nilai pencilan (sangat besar atau sangat kecil)?`,
    pilihan: [t`Mean`, t`Median`, t`Modus`, t`Ketiganya sama`],
    benar: 0,
    pembahasan: t`Mean memakai semua nilai, sehingga satu nilai ekstrem bisa menggesernya jauh. Median dan modus jauh lebih tahan terhadap pencilan.`,
  },

  // ===== Ukuran Penyebaran =====
  {
    id: "un-001",
    slug: "ukuran-penyebaran",
    pertanyaan: t`Berapa jangkauan (rentang) dari data $4, 9, 15, 2, 11$?`,
    pilihan: [t`$11$`, t`$13$`, t`$15$`, t`$17$`],
    benar: 1,
    pembahasan: t`Jangkauan $=$ nilai terbesar $-$ nilai terkecil $= 15 - 2 = 13$.`,
  },
  {
    id: "un-002",
    slug: "ukuran-penyebaran",
    pertanyaan: t`Berapa varians sampel dari data $1, 3, 5$?`,
    pilihan: [t`$2$`, t`$4$`, t`$8$`, t`$\dfrac{8}{3}$`],
    benar: 1,
    pembahasan: t`Mean $= 3$. Jumlah kuadrat selisih $= (1-3)^2 + (3-3)^2 + (5-3)^2 = 4 + 0 + 4 = 8$. Varians sampel dibagi $n - 1 = 2$, sehingga $s^2 = \dfrac{8}{2} = 4$.`,
  },
  {
    id: "un-003",
    slug: "ukuran-penyebaran",
    pertanyaan: t`Jika varians suatu data adalah $25$, berapa simpangan bakunya?`,
    pilihan: [t`$5$`, t`$12{,}5$`, t`$50$`, t`$625$`],
    benar: 0,
    pembahasan: t`Simpangan baku adalah akar kuadrat dari varians: $\sqrt{25} = 5$.`,
  },
  {
    id: "un-004",
    slug: "ukuran-penyebaran",
    pertanyaan: t`Suatu data memiliki kuartil bawah $Q_1 = 10$ dan kuartil atas $Q_3 = 18$. Berapa jangkauan antarkuartil (IQR)?`,
    pilihan: [t`$4$`, t`$8$`, t`$14$`, t`$28$`],
    benar: 1,
    pembahasan: t`$IQR = Q_3 - Q_1 = 18 - 10 = 8$.`,
  },
  {
    id: "un-005",
    slug: "ukuran-penyebaran",
    pertanyaan: t`Jika semua nilai dalam suatu data sama, berapa simpangan bakunya?`,
    pilihan: [t`$0$`, t`$1$`, t`Sama dengan mean`, t`Tidak dapat dihitung`],
    benar: 0,
    pembahasan: t`Tidak ada nilai yang menyimpang dari mean, sehingga semua selisihnya $0$ dan simpangan bakunya $0$.`,
  },

  // ===== Input Data ke SPSS =====
  {
    id: "sp-001",
    slug: "input-data-spss",
    pertanyaan: t`Di SPSS, nama variabel, tipe data, dan skala pengukuran diatur di tab ...`,
    pilihan: [t`Data View`, t`Variable View`, t`Output Viewer`, t`Syntax Editor`],
    benar: 1,
    pembahasan: t`Variable View dipakai untuk mendefinisikan variabel (nama, tipe, label, skala). Data View dipakai untuk mengisi datanya.`,
  },
  {
    id: "sp-002",
    slug: "input-data-spss",
    pertanyaan: t`Pada Data View SPSS, susunan data yang benar adalah ...`,
    pilihan: [
      t`Tiap baris satu variabel, tiap kolom satu responden`,
      t`Tiap baris satu responden, tiap kolom satu variabel`,
      t`Semua data ditulis dalam satu kolom`,
      t`Tiap sel berisi satu variabel berbeda`,
    ],
    benar: 1,
    pembahasan: t`Di SPSS, baris mewakili satu kasus (misalnya satu responden) dan kolom mewakili satu variabel.`,
  },
  {
    id: "sp-003",
    slug: "input-data-spss",
    pertanyaan: t`Tiga pilihan skala pengukuran (Measure) di SPSS adalah ...`,
    pilihan: [
      t`Nominal, Ordinal, Scale`,
      t`Nominal, Interval, Rasio`,
      t`Diskrit, Kontinu, Ordinal`,
      t`Numeric, String, Date`,
    ],
    benar: 0,
    pembahasan: t`SPSS menyediakan Nominal, Ordinal, dan Scale. Scale mencakup data interval dan rasio.`,
  },
  {
    id: "sp-004",
    slug: "input-data-spss",
    pertanyaan: t`Data jenis kelamin sebaiknya diinput ke SPSS sebagai angka (misalnya $1$ dan $2$) lalu diberi nama kategori lewat kolom ...`,
    pilihan: [t`Width`, t`Decimals`, t`Values`, t`Columns`],
    benar: 2,
    pembahasan: t`Kolom Values (Value Labels) memetakan kode angka ke nama kategori, misalnya $1 =$ Laki-laki dan $2 =$ Perempuan.`,
  },
  {
    id: "sp-005",
    slug: "input-data-spss",
    pertanyaan: t`Manakah aturan penamaan variabel di SPSS yang benar?`,
    pilihan: [
      t`Boleh memakai spasi`,
      t`Tidak boleh memakai spasi`,
      t`Harus diawali angka`,
      t`Harus memakai huruf kapital semua`,
    ],
    benar: 1,
    pembahasan: t`Nama variabel di SPSS tidak boleh mengandung spasi dan tidak boleh diawali angka. Gunakan garis bawah (misalnya \`nilai_ujian\`) bila perlu memisahkan kata.`,
  },
];

// Peringatan otomatis (hanya saat pengembangan): slug soal yang tidak cocok dengan materi manapun.
if (process.env.NODE_ENV !== "production") {
  const tidakCocok = [...new Set(bankSoal.map((s) => s.slug))].filter((slug) => !cariMateri(slug));
  if (tidakCocok.length > 0) {
    console.warn("[soal.js] Slug berikut tidak ditemukan di materi:", tidakCocok.join(", "));
  }
}

// Mengambil semua soal milik satu materi.
export function ambilSoal(slug) {
  return bankSoal.filter((s) => s.slug === slug);
}