// src/data/materiStatistika.js
// Isi materi kategori Statistika Dasar.
// Bagian "rumus" boleh dikosongkan ([]) kalau materinya tidak memakai rumus.
// video: [] diisi ID YouTube bila sudah ada.

const t = String.raw;

export const materiStatistika = [
  {
    slug: "pengertian-statistika",
    judul: "Pengertian statistika dan statistik",
    kategori: "Statistika Dasar",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyajikan, menganalisis, dan menafsirkan data. Statistik adalah hasil hitungan dari data, misalnya rata-rata nilai ulangan atau persentase siswa yang lulus.`,
      t`Statistika deskriptif menggambarkan data yang sudah ada, lewat tabel, diagram, atau ukuran seperti rata-rata. Statistika inferensial menarik kesimpulan tentang populasi berdasarkan data sampel, disertai ukuran ketidakpastiannya.`,
      t`Statistika dipakai di banyak bidang: kesehatan (menguji efektivitas obat), bisnis (memprediksi penjualan), pendidikan (menilai hasil belajar), dan penelitian sosial (membaca hasil survei).`,
    ],
    rumus: [],
    contoh: [
      {
        soal: "Seorang guru menghitung rata-rata nilai ulangan di kelasnya, lalu menyajikannya dalam diagram batang. Termasuk statistika deskriptif atau inferensial?",
        diketahui: [
          t`Data berasal dari seluruh siswa di satu kelas`,
          t`Guru hanya meringkas dan menyajikan data tersebut`,
        ],
        ditanya: "Jenis statistika yang dipakai",
        langkah: [
          "Periksa apakah ada kesimpulan untuk kelompok yang lebih besar dari data yang diamati. Tidak ada.",
          "Guru hanya meringkas dan menggambarkan data yang ada.",
        ],
        jawaban: "Termasuk statistika deskriptif.",
      },
      {
        soal: "Seorang peneliti mengambil 200 mahasiswa dari 10.000 mahasiswa, lalu menyimpulkan rata-rata jam tidur seluruh mahasiswa di kampus itu. Termasuk statistika apa?",
        diketahui: [
          t`Populasi: $10.000$ mahasiswa`,
          t`Sampel: $200$ mahasiswa`,
          "Kesimpulan ditujukan untuk seluruh mahasiswa, bukan hanya sampel",
        ],
        ditanya: "Jenis statistika yang dipakai",
        langkah: [
          "Periksa dari mana data diambil: hanya sebagian populasi (sampel).",
          "Periksa kesimpulannya: berlaku untuk seluruh populasi.",
        ],
        jawaban: "Termasuk statistika inferensial, karena menarik kesimpulan populasi dari sampel.",
      },
    ],
  },

  {
    slug: "jenis-data-dan-skala",
    judul: "Jenis data dan skala pengukuran",
    kategori: "Statistika Dasar",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Data kualitatif berupa kategori atau sifat (misalnya warna dan golongan darah). Data kuantitatif berupa angka. Data kuantitatif diskrit diperoleh dengan menghitung (banyak buku), sedangkan data kontinu diperoleh dengan mengukur (berat badan).`,
      t`Skala nominal hanya membedakan kategori tanpa urutan, misalnya jenis kelamin. Skala ordinal punya urutan tetapi jarak antar tingkat tidak pasti sama, misalnya tingkat kepuasan.`,
      t`Skala interval punya jarak yang sama tetapi tanpa nol mutlak, misalnya suhu dalam °C. Skala rasio punya jarak sama dan nol mutlak, misalnya tinggi badan, sehingga perbandingan seperti "dua kali lebih tinggi" bermakna.`,
      t`Di SPSS, skala interval dan rasio digabung menjadi satu pilihan bernama Scale, sehingga pilihannya hanya Nominal, Ordinal, dan Scale.`,
    ],
    rumus: [],
    contoh: [
      {
        soal: "Tentukan jenis data dan skala pengukuran dari: (a) golongan darah, (b) peringkat kelulusan, (c) suhu dalam °C, (d) tinggi badan.",
        diketahui: [
          "Empat variabel: golongan darah, peringkat kelulusan, suhu °C, dan tinggi badan",
        ],
        ditanya: "Jenis data dan skala tiap variabel",
        langkah: [
          "Golongan darah: berupa kategori tanpa urutan, jadi kualitatif dengan skala nominal.",
          "Peringkat kelulusan: berupa kategori yang berurutan, jadi kualitatif dengan skala ordinal.",
          "Suhu °C: berupa angka dengan jarak sama, tetapi $0\\,°C$ bukan berarti tidak ada suhu, jadi kuantitatif dengan skala interval.",
          "Tinggi badan: berupa angka dengan nol mutlak, jadi kuantitatif dengan skala rasio.",
        ],
        jawaban: "(a) nominal, (b) ordinal, (c) interval, (d) rasio.",
      },
      {
        soal: "Banyak buku di dalam tas dan berat tas termasuk data diskrit atau kontinu?",
        diketahui: ["Variabel 1: banyak buku", "Variabel 2: berat tas"],
        ditanya: "Jenis data kuantitatifnya",
        langkah: [
          "Banyak buku diperoleh dengan menghitung dan hanya berupa bilangan bulat, jadi diskrit.",
          "Berat tas diperoleh dengan mengukur dan bisa berupa pecahan, jadi kontinu.",
        ],
        jawaban: "Banyak buku adalah data diskrit, dan berat tas adalah data kontinu.",
      },
    ],
  },

  {
    slug: "ukuran-pemusatan",
    judul: "Ukuran pemusatan",
    kategori: "Statistika Dasar",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Ukuran pemusatan menunjukkan nilai yang mewakili pusat data. Ada tiga ukuran: mean (rata-rata), median (nilai tengah setelah data diurutkan), dan modus (nilai yang paling sering muncul).`,
      t`Mean sensitif terhadap nilai ekstrem, sedangkan median lebih tahan. Karena itu, untuk data yang sangat miring, median sering lebih mewakili.`,
    ],
    rumus: [
      { nama: "Mean", tex: t`\bar{x} = \dfrac{\sum x_i}{n}`, ket: t`Jumlah semua data dibagi banyaknya data.` },
      { nama: "Median, n ganjil", tex: t`Me = x_{\frac{n+1}{2}}`, ket: t`Data tengah setelah data diurutkan.` },
      { nama: "Median, n genap", tex: t`Me = \dfrac{x_{n/2} + x_{n/2+1}}{2}`, ket: t`Rata-rata dua data tengah.` },
      { nama: "Modus", tex: t`Mo = \text{nilai dengan frekuensi terbesar}` },
    ],
    contoh: [
      {
        soal: "Tentukan mean, median, dan modus dari data: 70, 85, 90, 65, 85, 100, 78.",
        diketahui: [t`Data: $70, 85, 90, 65, 85, 100, 78$`, t`Banyak data $n = 7$`],
        ditanya: "Mean, median, dan modus",
        rumus: t`$\bar{x} = \dfrac{\sum x_i}{n}$`,
        langkah: [
          t`Mean: $\bar{x} = \dfrac{70+85+90+65+85+100+78}{7} = \dfrac{573}{7} \approx 81{,}86$`,
          t`Urutkan data: $65, 70, 78, 85, 85, 90, 100$`,
          t`Median: $n=7$ ganjil, maka median adalah data ke-$4$, yaitu $85$`,
          t`Modus: nilai $85$ muncul $2$ kali, paling sering dibanding yang lain`,
        ],
        jawaban: t`Mean $\approx 81{,}86$, median $= 85$, dan modus $= 85$.`,
      },
      {
        soal: "Tentukan mean, median, dan modus dari data: 5, 7, 8, 9, 11, 12.",
        diketahui: [t`Data sudah terurut: $5, 7, 8, 9, 11, 12$`, t`Banyak data $n = 6$`],
        ditanya: "Mean, median, dan modus",
        rumus: t`$\bar{x} = \dfrac{\sum x_i}{n}$`,
        langkah: [
          t`Mean: $\bar{x} = \dfrac{5+7+8+9+11+12}{6} = \dfrac{52}{6} \approx 8{,}67$`,
          t`Median: $n=6$ genap, maka median adalah rata-rata data ke-$3$ dan ke-$4$: $\dfrac{8+9}{2} = 8{,}5$`,
          "Modus: semua nilai muncul tepat satu kali, sehingga tidak ada modus.",
        ],
        jawaban: t`Mean $\approx 8{,}67$, median $= 8{,}5$, dan data tidak punya modus.`,
      },
    ],
  },

  {
    slug: "ukuran-penyebaran",
    judul: "Ukuran penyebaran",
    kategori: "Statistika Dasar",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Ukuran penyebaran menunjukkan seberapa jauh data menyebar dari pusatnya. Dua kelompok data bisa punya mean sama tetapi penyebaran berbeda, sehingga mean saja tidak cukup untuk menggambarkan data.`,
      t`Range adalah selisih data terbesar dan terkecil. Varians adalah rata-rata kuadrat selisih data terhadap mean, dan simpangan baku adalah akar varians sehingga satuannya sama dengan data. Untuk data sampel, pembaginya $n-1$, sedangkan untuk populasi pembaginya $N$.`,
    ],
    rumus: [
      { nama: "Range", tex: t`R = x_{maks} - x_{min}` },
      { nama: "Varians sampel", tex: t`s^2 = \dfrac{\sum (x_i - \bar{x})^2}{n-1}` },
      { nama: "Simpangan baku sampel", tex: t`s = \sqrt{s^2}` },
      { nama: "Varians populasi", tex: t`\sigma^2 = \dfrac{\sum (x_i - \mu)^2}{N}`, ket: t`Simpangan baku populasi: $\sigma = \sqrt{\sigma^2}$.` },
    ],
    contoh: [
      {
        soal: "Data sampel: 4, 6, 8, 10, 12. Tentukan range, varians, dan simpangan baku.",
        diketahui: [t`Data: $4, 6, 8, 10, 12$`, t`Banyak data $n = 5$`],
        ditanya: "Range, varians sampel, dan simpangan baku sampel",
        rumus: t`$s^2 = \dfrac{\sum (x_i - \bar{x})^2}{n-1}$`,
        langkah: [
          t`Range: $R = 12 - 4 = 8$`,
          t`Mean: $\bar{x} = \dfrac{40}{5} = 8$`,
          t`Selisih terhadap mean: $-4, -2, 0, 2, 4$, dan kuadratnya: $16, 4, 0, 4, 16$ dengan jumlah $40$`,
          t`Varians: $s^2 = \dfrac{40}{5-1} = 10$`,
          t`Simpangan baku: $s = \sqrt{10} \approx 3{,}16$`,
        ],
        jawaban: t`Range $= 8$, varians $= 10$, dan simpangan baku $\approx 3{,}16$.`,
      },
      {
        soal: "Data populasi: 2, 4, 4, 4, 5, 5, 7, 9. Tentukan varians dan simpangan baku populasi.",
        diketahui: [t`Data: $2, 4, 4, 4, 5, 5, 7, 9$`, t`Banyak data $N = 8$`],
        ditanya: t`$\sigma^2$ dan $\sigma$`,
        rumus: t`$\sigma^2 = \dfrac{\sum (x_i - \mu)^2}{N}$`,
        langkah: [
          t`Mean: $\mu = \dfrac{40}{8} = 5$`,
          t`Selisih terhadap mean: $-3, -1, -1, -1, 0, 0, 2, 4$, dan kuadratnya berjumlah $9+1+1+1+0+0+4+16 = 32$`,
          t`Varians: $\sigma^2 = \dfrac{32}{8} = 4$`,
          t`Simpangan baku: $\sigma = \sqrt{4} = 2$`,
        ],
        jawaban: t`Varians populasi $= 4$ dan simpangan baku populasi $= 2$.`,
      },
    ],
  },

  {
    slug: "input-data-spss",
    judul: "Input data ke SPSS",
    kategori: "Statistika Dasar",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`SPSS punya dua tampilan yang dipilih lewat tab di kiri bawah. Data View berisi data seperti lembar kerja: tiap baris adalah satu responden dan tiap kolom adalah satu variabel. Variable View berisi definisi variabel: Name, Type, Decimals, Label, Values, Missing, dan Measure.`,
      t`Pada kolom Measure, pilih Nominal, Ordinal, atau Scale sesuai skala datanya. Nama variabel tidak boleh memuat spasi dan harus diawali huruf. Jika tidak punya lisensi SPSS, JASP dan jamovi adalah alternatif gratis dengan cara kerja yang mirip.`,
    ],
    rumus: [],
    contoh: [
      {
        soal: "Masukkan data tiga siswa ke SPSS: nama, jenis kelamin, dan nilai ujian.",
        diketahui: [
          "Budi, laki-laki, nilai 80",
          "Sari, perempuan, nilai 90",
          "Rina, perempuan, nilai 75",
        ],
        ditanya: "Cara memasukkan data ke SPSS dengan benar",
        langkah: [
          "Buka SPSS, lalu klik tab Variable View di kiri bawah.",
          "Baris 1: Name diisi Nama, Type String, Measure Nominal.",
          t`Baris 2: Name diisi JK, Type Numeric, lalu pada kolom Values isi $1 =$ Laki-laki dan $2 =$ Perempuan, Measure Nominal.`,
          "Baris 3: Name diisi Nilai, Type Numeric, Decimals 0, Measure Scale.",
          "Klik tab Data View, lalu ketik data: tiap baris satu siswa, dengan JK ditulis sebagai angka 1 atau 2.",
          "Simpan lewat File, Save As, dan pilih format .sav.",
        ],
        jawaban: "Data tersimpan dengan tiga variabel dan tiga baris responden, siap dianalisis.",
      },
    ],
  },
];