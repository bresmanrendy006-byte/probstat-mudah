// src/data/materiInferensial.js
// Isi materi kategori Statistika Inferensial.

const t = String.raw;

export const materiInferensial = [
  {
    slug: "dasar-uji-hipotesis",
    judul: "Dasar uji hipotesis",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: ["_BaflviQadY"],
    pengertian: [
      t`Uji hipotesis adalah prosedur untuk memutuskan, berdasarkan data sampel, apakah suatu dugaan tentang populasi cukup didukung bukti atau tidak. Dugaan itu dituliskan sebagai dua pernyataan yang berlawanan.`,
      t`Hipotesis nol ($H_0$) adalah pernyataan "tidak ada perbedaan atau tidak ada efek", misalnya $\mu = 50$. Hipotesis alternatif ($H_1$) adalah pernyataan yang ingin dibuktikan, misalnya $\mu \neq 50$.`,
      t`Taraf signifikansi ($\alpha$) adalah batas kita menganggap bukti cukup kuat, biasanya $0{,}05$. P-value adalah peluang memperoleh hasil sampel sedekat atau lebih ekstrem dari yang kita amati, dengan anggapan $H_0$ benar. Bila p-value $\le \alpha$, kita menolak $H_0$.`,
      t`Bila p-value $> \alpha$, kita gagal menolak $H_0$. Ini berarti bukti belum cukup, bukan berarti $H_0$ terbukti benar.`,
    ],
    rumus: [
      {
        nama: "Statistik uji t satu sampel",
        tex: t`t = \dfrac{\bar{x} - \mu_0}{s / \sqrt{n}}`,
        ket: t`$\mu_0$ adalah nilai pada $H_0$, $s$ simpangan baku sampel, dan $n$ banyak data. Derajat bebas $db = n - 1$.`,
      },
      {
        nama: "Aturan keputusan",
        tex: t`\text{tolak } H_0 \text{ jika } p \le \alpha`,
        ket: "Bila p-value lebih besar dari alpha, gagal menolak H0.",
      },
    ],
    contoh: [
      {
        soal: "Rata-rata nilai ujian suatu sekolah biasanya 50. Sampel 25 siswa kelas baru punya rata-rata 52 dengan simpangan baku 10. Ujilah pada alpha 0,05 (dua arah) apakah rata-rata kelas baru berbeda dari 50. Nilai kritis t dengan db = 24 adalah 2,064.",
        diketahui: [
          t`$\mu_0 = 50$, $\bar{x} = 52$, $s = 10$, $n = 25$`,
          t`$\alpha = 0{,}05$, nilai kritis $t = \pm 2{,}064$`,
        ],
        ditanya: "Keputusan uji",
        rumus: t`$t = \dfrac{\bar{x} - \mu_0}{s / \sqrt{n}}$`,
        langkah: [
          t`Tulis hipotesis: $H_0: \mu = 50$ dan $H_1: \mu \neq 50$`,
          t`Hitung galat baku: $\dfrac{s}{\sqrt{n}} = \dfrac{10}{5} = 2$`,
          t`Hitung statistik uji: $t = \dfrac{52 - 50}{2} = 1$`,
          t`Bandingkan: $|1| < 2{,}064$, jadi $t$ tidak masuk daerah penolakan`,
        ],
        jawaban: t`Gagal menolak $H_0$. Belum cukup bukti bahwa rata-rata kelas baru berbeda dari $50$.`,
      },
      {
        soal: "Sebuah uji menghasilkan p-value = 0,03. Apa keputusannya pada alpha 0,05 dan pada alpha 0,01?",
        diketahui: [t`p-value $= 0{,}03$`, t`Dua taraf: $\alpha = 0{,}05$ dan $\alpha = 0{,}01$`],
        ditanya: "Keputusan pada tiap taraf",
        langkah: [
          t`Untuk $\alpha = 0{,}05$: $0{,}03 \le 0{,}05$, jadi tolak $H_0$`,
          t`Untuk $\alpha = 0{,}01$: $0{,}03 > 0{,}01$, jadi gagal menolak $H_0$`,
        ],
        jawaban: t`Tolak $H_0$ pada $\alpha = 0{,}05$, tetapi gagal menolak $H_0$ pada $\alpha = 0{,}01$. Keputusan bergantung pada taraf yang ditetapkan sebelum uji.`,
      },
    ],
  },

  {
    slug: "kesalahan-tipe-i-ii-power",
    judul: "Kesalahan Tipe I, Tipe II, dan power",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: ["LZ07umhEuqk"],
    pengertian: [
      t`Karena keputusan uji hipotesis memakai sampel, keputusan itu bisa keliru. Kesalahan Tipe I terjadi bila kita menolak $H_0$ padahal $H_0$ sebenarnya benar (alarm palsu). Kesalahan Tipe II terjadi bila kita gagal menolak $H_0$ padahal $H_0$ sebenarnya salah (gagal mendeteksi).`,
      t`Peluang kesalahan Tipe I adalah $\alpha$, dan peluang kesalahan Tipe II adalah $\beta$. Power adalah peluang menolak $H_0$ dengan benar saat $H_0$ memang salah, yaitu $1 - \beta$.`,
      t`Memperkecil $\alpha$ membuat uji lebih ketat sehingga $\beta$ membesar dan power turun, bila hal lain tetap. Cara menaikkan power tanpa menambah $\alpha$ antara lain memperbesar ukuran sampel.`,
    ],
    rumus: [
      { nama: "Kesalahan Tipe I", tex: t`\alpha = P(\text{tolak } H_0 \mid H_0 \text{ benar})` },
      { nama: "Kesalahan Tipe II", tex: t`\beta = P(\text{gagal tolak } H_0 \mid H_0 \text{ salah})` },
      { nama: "Power", tex: t`\text{Power} = 1 - \beta`, ket: "Semakin besar power, semakin mampu uji mendeteksi efek yang nyata." },
    ],
    contoh: [
      {
        soal: "Obat baru sebenarnya tidak berefek, tetapi uji menyimpulkan obat itu efektif. Kesalahan apa yang terjadi?",
        diketahui: [t`$H_0$: obat tidak berefek (kenyataannya benar)`, t`Keputusan uji: tolak $H_0$`],
        ditanya: "Jenis kesalahan",
        langkah: [
          t`Periksa kenyataannya: $H_0$ benar`,
          t`Periksa keputusannya: $H_0$ ditolak`,
          "Menolak H0 yang benar adalah kesalahan Tipe I.",
        ],
        jawaban: "Kesalahan Tipe I (alarm palsu).",
      },
      {
        soal: "Suatu uji memiliki beta = 0,20. Berapa powernya, dan apa artinya?",
        diketahui: [t`$\beta = 0{,}20$`],
        ditanya: "Power uji",
        rumus: t`$\text{Power} = 1 - \beta$`,
        langkah: [t`Masukkan angka: $\text{Power} = 1 - 0{,}20 = 0{,}80$`],
        jawaban: t`Power $= 0{,}80$. Bila efeknya memang ada, uji ini punya peluang $80\%$ untuk mendeteksinya.`,
      },
    ],
  },

  
  {
    slug: "distribusi-normal",
    judul: "Distribusi normal dan skor Z",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Distribusi normal berbentuk lonceng yang simetris di sekitar mean ($\mu$). Lebar lonceng ditentukan oleh simpangan baku ($\sigma$): makin besar $\sigma$, makin lebar dan pendek loncengnya. Luas total di bawah kurva sama dengan $1$, sehingga luas daerah tertentu dapat dibaca sebagai peluang.`,
      t`Skor Z mengubah nilai $x$ menjadi "berapa simpangan baku jaraknya dari mean". Setelah diubah, data mengikuti distribusi normal baku dengan mean $0$ dan simpangan baku $1$, sehingga peluangnya bisa dicari dari satu tabel yang sama.`,
      t`Aturan empiris: sekitar $68\%$ data berada dalam $1\sigma$ dari mean, sekitar $95\%$ dalam $2\sigma$, dan sekitar $99{,}7\%$ dalam $3\sigma$.`,
    ],
    rumus: [
      {
        nama: "Skor Z",
        tex: t`Z = \dfrac{x - \mu}{\sigma}`,
        ket: t`Bernilai positif bila $x$ di atas mean, negatif bila di bawah mean.`,
      },
      {
        nama: "Aturan empiris",
        tex: t`P(\mu - k\sigma < X < \mu + k\sigma) \approx 0{,}68;\ 0{,}95;\ 0{,}997`,
        ket: t`Untuk $k = 1, 2, 3$ berturut-turut.`,
      },
    ],
    contoh: [
      {
        soal: "Nilai ujian berdistribusi normal dengan mean 70 dan simpangan baku 10. Berapa skor Z untuk nilai 85?",
        diketahui: [t`$\mu = 70$ dan $\sigma = 10$`, t`$x = 85$`],
        ditanya: t`Skor $Z$`,
        rumus: t`$Z = \dfrac{x - \mu}{\sigma}$`,
        langkah: [
          t`Masukkan angka: $Z = \dfrac{85 - 70}{10}$`,
          t`Hitung: $Z = \dfrac{15}{10} = 1{,}5$`,
        ],
        jawaban: t`$Z = 1{,}5$, artinya nilai $85$ berada $1{,}5$ simpangan baku di atas mean.`,
      },
      {
        soal: "Dengan data yang sama (mean 70, simpangan baku 10), berapa peluang seorang siswa bernilai antara 60 dan 80? Diketahui P(Z < 1) = 0,8413.",
        diketahui: [
          t`$\mu = 70$, $\sigma = 10$`,
          t`Batas: $60$ dan $80$`,
          t`$P(Z < 1) = 0{,}8413$`,
        ],
        ditanya: t`$P(60 < X < 80)$`,
        langkah: [
          t`Ubah batas ke skor Z: $Z_1 = \dfrac{60-70}{10} = -1$ dan $Z_2 = \dfrac{80-70}{10} = 1$`,
          t`Kurva simetris, sehingga $P(Z < -1) = 1 - 0{,}8413 = 0{,}1587$`,
          t`Peluang di antaranya: $P(-1 < Z < 1) = 0{,}8413 - 0{,}1587 = 0{,}6826$`,
        ],
        jawaban: t`Peluangnya sekitar $0{,}68$ atau $68\%$, sesuai aturan empiris.`,
      },
    ],
  },

  {
    slug: "uji-t",
    judul: "Uji t",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Uji t dipakai untuk membandingkan rata-rata ketika simpangan baku populasi tidak diketahui, terutama pada sampel kecil. Distribusi t mirip distribusi normal tetapi lebih "gemuk" di ekor, dan makin mirip normal bila derajat bebas ($db$) makin besar.`,
      t`Ada tiga jenis. Uji t satu sampel membandingkan rata-rata sampel dengan nilai tertentu. Uji t sampel bebas membandingkan rata-rata dua kelompok yang berbeda orangnya. Uji t berpasangan membandingkan dua pengukuran pada subjek yang sama, misalnya sebelum dan sesudah perlakuan.`,
      t`Uji t berpasangan sebenarnya adalah uji t satu sampel pada selisih tiap pasangan. Keputusannya sama seperti uji hipotesis: tolak $H_0$ bila p-value $\le \alpha$, atau bila $|t|$ melebihi nilai kritis.`,
    ],
    rumus: [
      {
        nama: "Uji t satu sampel",
        tex: t`t = \dfrac{\bar{x} - \mu_0}{s / \sqrt{n}}`,
        ket: t`$db = n - 1$.`,
      },
      {
        nama: "Uji t sampel bebas (varians dianggap sama)",
        tex: t`t = \dfrac{\bar{x}_1 - \bar{x}_2}{s_p \sqrt{\dfrac{1}{n_1} + \dfrac{1}{n_2}}}`,
        ket: t`$db = n_1 + n_2 - 2$, dengan $s_p^2 = \dfrac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}$.`,
      },
      {
        nama: "Uji t berpasangan",
        tex: t`t = \dfrac{\bar{d}}{s_d / \sqrt{n}}`,
        ket: t`$\bar{d}$ dan $s_d$ adalah mean dan simpangan baku selisih tiap pasangan. $db = n - 1$.`,
      },
    ],
    contoh: [
      {
        soal: "Lima siswa mengikuti tes sebelum dan sesudah les. Selisih nilainya (sesudah - sebelum): 3, 5, 2, 4, 6. Ujilah pada alpha 0,05 (dua arah) apakah les berpengaruh. Nilai kritis t dengan db = 4 adalah 2,776.",
        diketahui: [t`Selisih $d$: $3, 5, 2, 4, 6$ dengan $n = 5$`, t`$\alpha = 0{,}05$, nilai kritis $\pm 2{,}776$`],
        ditanya: "Keputusan uji t berpasangan",
        rumus: t`$t = \dfrac{\bar{d}}{s_d / \sqrt{n}}$`,
        langkah: [
          t`Hipotesis: $H_0: \mu_d = 0$ dan $H_1: \mu_d \neq 0$`,
          t`Mean selisih: $\bar{d} = \dfrac{20}{5} = 4$`,
          t`Kuadrat selisih terhadap mean: $1, 1, 4, 0, 4$ dengan jumlah $10$, sehingga $s_d^2 = \dfrac{10}{4} = 2{,}5$ dan $s_d \approx 1{,}581$`,
          t`Galat baku: $\dfrac{1{,}581}{\sqrt{5}} \approx 0{,}707$`,
          t`Statistik uji: $t = \dfrac{4}{0{,}707} \approx 5{,}66$`,
          t`Bandingkan: $5{,}66 > 2{,}776$, jadi $t$ masuk daerah penolakan`,
        ],
        jawaban: t`Tolak $H_0$. Ada bukti bahwa les berpengaruh terhadap nilai.`,
      },
      {
        soal: "Kelas A (n = 10) punya rata-rata 78 dan kelas B (n = 10) rata-rata 72. Simpangan baku kedua kelas sama, yaitu 6. Ujilah pada alpha 0,05 (dua arah) apakah rata-rata kedua kelas berbeda. Nilai kritis t dengan db = 18 adalah 2,101.",
        diketahui: [t`$\bar{x}_1 = 78$, $\bar{x}_2 = 72$, $n_1 = n_2 = 10$`, t`$s_1 = s_2 = 6$, sehingga $s_p = 6$`, t`$db = 18$, nilai kritis $\pm 2{,}101$`],
        ditanya: "Keputusan uji t sampel bebas",
        rumus: t`$t = \dfrac{\bar{x}_1 - \bar{x}_2}{s_p \sqrt{\frac{1}{n_1} + \frac{1}{n_2}}}$`,
        langkah: [
          t`Hipotesis: $H_0: \mu_1 = \mu_2$ dan $H_1: \mu_1 \neq \mu_2$`,
          t`Galat baku: $6 \sqrt{\dfrac{1}{10} + \dfrac{1}{10}} = 6 \times 0{,}4472 \approx 2{,}683$`,
          t`Statistik uji: $t = \dfrac{78 - 72}{2{,}683} \approx 2{,}24$`,
          t`Bandingkan: $2{,}24 > 2{,}101$, jadi $t$ masuk daerah penolakan`,
        ],
        jawaban: t`Tolak $H_0$. Ada bukti bahwa rata-rata kedua kelas berbeda.`,
      },
    ],
  },

  
  {
    slug: "korelasi-dan-regresi",
    judul: "Korelasi dan regresi linear",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Korelasi mengukur kekuatan dan arah hubungan linear antara dua variabel numerik. Koefisien korelasi Pearson ($r$) bernilai antara $-1$ dan $1$. Tanda menunjukkan arah (positif: naik bersama, negatif: berlawanan), dan besarnya menunjukkan kekuatan hubungan.`,
      t`Korelasi tidak sama dengan sebab-akibat. Dua variabel bisa berkorelasi tinggi tanpa yang satu menyebabkan yang lain.`,
      t`Regresi linear sederhana membuat garis $\hat{y} = a + bx$ untuk memprediksi $y$ dari $x$. Kemiringan $b$ adalah perubahan rata-rata $y$ untuk setiap kenaikan $x$ satu satuan. Koefisien determinasi $r^2$ menyatakan proporsi variasi $y$ yang dijelaskan oleh $x$.`,
      t`Untuk menguji apakah korelasi di populasi berbeda dari nol ($H_0: \rho = 0$), dipakai statistik uji $t$ dengan $db = n - 2$.`,
    ],
    rumus: [
      {
        nama: "Korelasi Pearson",
        tex: t`r = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \cdot \sum (y_i - \bar{y})^2}}`,
      },
      {
        nama: "Garis regresi",
        tex: t`\hat{y} = a + bx,\quad b = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2},\quad a = \bar{y} - b\bar{x}`,
      },
      {
        nama: "Uji t untuk korelasi",
        tex: t`t = \dfrac{r\sqrt{n-2}}{\sqrt{1-r^2}}`,
        ket: t`Derajat bebas $db = n - 2$.`,
      },
    ],
    contoh: [
      {
        soal: "Data lima siswa: jam belajar (x) = 1, 2, 3, 4, 5 dan nilai (y) = 2, 4, 5, 4, 5. Tentukan r, r kuadrat, dan persamaan regresinya.",
        diketahui: [t`$x$: $1, 2, 3, 4, 5$ dan $y$: $2, 4, 5, 4, 5$`, t`$n = 5$`],
        ditanya: t`$r$, $r^2$, dan $\hat{y} = a + bx$`,
        rumus: t`$r = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \cdot \sum (y_i - \bar{y})^2}}$`,
        langkah: [
          t`Mean: $\bar{x} = 3$ dan $\bar{y} = 4$`,
          t`Selisih $x$: $-2, -1, 0, 1, 2$ dan selisih $y$: $-2, 0, 1, 0, 1$`,
          t`Jumlah hasil kali selisih: $4 + 0 + 0 + 0 + 2 = 6$`,
          t`Jumlah kuadrat: $\sum (x_i - \bar{x})^2 = 10$ dan $\sum (y_i - \bar{y})^2 = 6$`,
          t`Korelasi: $r = \dfrac{6}{\sqrt{10 \times 6}} = \dfrac{6}{7{,}746} \approx 0{,}775$, dan $r^2 = 0{,}6$`,
          t`Kemiringan: $b = \dfrac{6}{10} = 0{,}6$, lalu $a = 4 - 0{,}6 \times 3 = 2{,}2$`,
        ],
        jawaban: t`$r \approx 0{,}775$ (positif dan kuat), $r^2 = 0{,}6$, dan $\hat{y} = 2{,}2 + 0{,}6x$. Sebesar $60\%$ variasi nilai dijelaskan oleh jam belajar.`,
      },
      {
        soal: "Sampel 27 pasang data menghasilkan r = 0,6. Ujilah pada alpha 0,05 (dua arah) apakah korelasi populasi berbeda dari nol. Nilai kritis t dengan db = 25 adalah 2,060.",
        diketahui: [t`$r = 0{,}6$, $n = 27$, sehingga $db = 25$`, t`Nilai kritis $\pm 2{,}060$`],
        ditanya: "Keputusan uji korelasi",
        rumus: t`$t = \dfrac{r\sqrt{n-2}}{\sqrt{1-r^2}}$`,
        langkah: [
          t`Hipotesis: $H_0: \rho = 0$ dan $H_1: \rho \neq 0$`,
          t`Hitung: $\sqrt{n-2} = \sqrt{25} = 5$ dan $\sqrt{1 - 0{,}36} = 0{,}8$`,
          t`Statistik uji: $t = \dfrac{0{,}6 \times 5}{0{,}8} = 3{,}75$`,
          t`Bandingkan: $3{,}75 > 2{,}060$, jadi $t$ masuk daerah penolakan`,
        ],
        jawaban: t`Tolak $H_0$. Ada bukti bahwa kedua variabel berkorelasi di populasi.`,
      },
    ],
  },

  {
    slug: "anova-satu-arah",
    judul: "ANOVA satu arah",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`ANOVA satu arah (One-Way ANOVA) menguji apakah rata-rata tiga kelompok atau lebih sama. Memakai banyak uji t berulang meningkatkan peluang kesalahan Tipe I, sehingga ANOVA menguji semua kelompok sekaligus. Hipotesisnya: $H_0$: semua rata-rata sama, dan $H_1$: setidaknya satu rata-rata berbeda.`,
      t`Idenya membandingkan dua jenis variasi. Variasi antar kelompok berasal dari perbedaan rata-rata kelompok, sedangkan variasi dalam kelompok berasal dari perbedaan antaranggota di kelompok yang sama. Bila variasi antar kelompok jauh lebih besar dari variasi dalam kelompok, nilai $F$ besar dan $H_0$ ditolak.`,
      t`Bila ANOVA signifikan, kita hanya tahu ada rata-rata yang berbeda, belum tahu pasangan mana. Untuk itu dipakai uji lanjut (post hoc) seperti Tukey. Ukuran efeknya adalah $\eta^2$, yaitu proporsi variasi total yang dijelaskan oleh perbedaan kelompok.`,
    ],
    rumus: [
      {
        nama: "Statistik F",
        tex: t`F = \dfrac{KT_{antar}}{KT_{dalam}},\quad KT = \dfrac{JK}{db}`,
        ket: t`$KT$ adalah kuadrat tengah dan $JK$ adalah jumlah kuadrat.`,
      },
      {
        nama: "Derajat bebas",
        tex: t`db_{antar} = k - 1,\quad db_{dalam} = N - k`,
        ket: t`$k$ banyak kelompok dan $N$ banyak seluruh data.`,
      },
      {
        nama: "Ukuran efek",
        tex: t`\eta^2 = \dfrac{JK_{antar}}{JK_{total}}`,
        ket: t`Dengan $JK_{total} = JK_{antar} + JK_{dalam}$.`,
      },
    ],
    contoh: [
      {
        soal: "Tiga metode belajar diuji pada tiga kelompok (masing-masing 3 siswa). Nilai A: 4, 5, 6. Nilai B: 6, 7, 8. Nilai C: 8, 9, 10. Ujilah pada alpha 0,05 apakah rata-rata ketiganya sama. Nilai kritis F dengan db (2, 6) adalah 5,143.",
        diketahui: [t`$k = 3$, $N = 9$`, t`Mean kelompok: $5, 7, 9$ dan mean total $= 7$`, t`Nilai kritis $F = 5{,}143$`],
        ditanya: t`Keputusan uji, dan $\eta^2$`,
        rumus: t`$F = \dfrac{KT_{antar}}{KT_{dalam}}$`,
        langkah: [
          t`Hipotesis: $H_0: \mu_A = \mu_B = \mu_C$`,
          t`$JK_{antar} = 3(5-7)^2 + 3(7-7)^2 + 3(9-7)^2 = 12 + 0 + 12 = 24$`,
          t`$JK_{dalam}$: tiap kelompok $1 + 0 + 1 = 2$, jadi totalnya $6$`,
          t`Derajat bebas: $db_{antar} = 2$ dan $db_{dalam} = 6$`,
          t`Kuadrat tengah: $KT_{antar} = \dfrac{24}{2} = 12$ dan $KT_{dalam} = \dfrac{6}{6} = 1$`,
          t`Statistik uji: $F = \dfrac{12}{1} = 12$, dan $12 > 5{,}143$`,
          t`Ukuran efek: $\eta^2 = \dfrac{24}{24 + 6} = 0{,}8$`,
        ],
        jawaban: t`Tolak $H_0$. Ada perbedaan rata-rata antar metode belajar, dan sekitar $80\%$ variasi nilai dijelaskan oleh metode.`,
      },
      {
        soal: "Sebuah ANOVA dengan 3 kelompok dan 33 data menghasilkan JK antar = 40 dan JK dalam = 60. Hitung F dan ambil keputusan pada alpha 0,05. Nilai kritis F dengan db (2, 30) adalah 3,316.",
        diketahui: [t`$k = 3$, $N = 33$`, t`$JK_{antar} = 40$, $JK_{dalam} = 60$`],
        ditanya: "Nilai F dan keputusan",
        langkah: [
          t`Derajat bebas: $db_{antar} = 3 - 1 = 2$ dan $db_{dalam} = 33 - 3 = 30$`,
          t`Kuadrat tengah: $KT_{antar} = \dfrac{40}{2} = 20$ dan $KT_{dalam} = \dfrac{60}{30} = 2$`,
          t`Statistik uji: $F = \dfrac{20}{2} = 10$`,
          t`Bandingkan: $10 > 3{,}316$`,
        ],
        jawaban: t`$F = 10$, maka tolak $H_0$. Setidaknya satu rata-rata kelompok berbeda, sehingga perlu uji lanjut seperti Tukey.`,
      },
    ],
  },

  
  {
    slug: "spss-uji-beda-rata-rata",
    judul: "SPSS: uji beda rata-rata (Means, uji t, ANOVA)",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Semua uji beda rata-rata di SPSS ada di menu Analyze, lalu Compare Means (nama menunya bisa sedikit berbeda di versi terbaru). Pilih menu sesuai pertanyaanmu. Means menampilkan rata-rata per kelompok tanpa uji. One-Sample T Test membandingkan satu kelompok dengan nilai tertentu. Independent-Samples T Test membandingkan dua kelompok yang orangnya berbeda. Paired-Samples T Test membandingkan dua pengukuran pada subjek yang sama. One-Way ANOVA membandingkan tiga kelompok atau lebih.`,
      t`Cara membaca output hampir selalu sama: cari kolom Sig. (itu p-value). Pada uji t, pakai Sig. (2-tailed). Bila Sig. $\le 0{,}05$, tolak $H_0$. Bila Sig. $> 0{,}05$, gagal menolak $H_0$.`,
      t`Untuk Independent-Samples T Test, data disusun dalam satu kolom nilai dan satu kolom kode kelompok (misalnya $1$ dan $2$). Kolom kode dimasukkan ke Grouping Variable, lalu klik Define Groups dan isi kodenya. Output memuat Levene's Test: bila Sig. Levene $> 0{,}05$, baca baris Equal variances assumed. Bila Sig. Levene $\le 0{,}05$, baca baris Equal variances not assumed.`,
      t`Untuk Paired-Samples T Test, siapkan dua kolom (misalnya Sebelum dan Sesudah), satu baris untuk satu subjek. Untuk One-Way ANOVA, masukkan variabel numerik ke Dependent List dan variabel kelompok ke Factor. Di Options, centang Descriptive dan Homogeneity of variance test. Bila ANOVA signifikan, buka Post Hoc dan pilih Tukey untuk melihat pasangan kelompok yang berbeda di tabel Multiple Comparisons.`,
    ],
    rumus: [
      {
        nama: "Aturan keputusan dari output SPSS",
        tex: t`\text{Sig.} \le \alpha \;\Rightarrow\; \text{tolak } H_0`,
        ket: t`Umumnya $\alpha = 0{,}05$. Kolom Sig. di SPSS adalah p-value.`,
      },
    ],
    contoh: [
      {
        soal: "Output Independent-Samples T Test menunjukkan Sig. Levene's Test = 0,412, sedangkan baris Equal variances assumed memiliki Sig. (2-tailed) = 0,018. Apa keputusannya pada alpha 0,05?",
        diketahui: [
          t`Sig. Levene $= 0{,}412$`,
          t`Sig. (2-tailed) pada baris Equal variances assumed $= 0{,}018$`,
          t`$\alpha = 0{,}05$`,
        ],
        ditanya: "Baris mana yang dibaca, dan keputusan uji",
        langkah: [
          t`Periksa Levene: $0{,}412 > 0{,}05$, jadi varians kedua kelompok dianggap sama`,
          "Karena itu baca baris Equal variances assumed.",
          t`Bandingkan Sig. (2-tailed) dengan alpha: $0{,}018 \le 0{,}05$`,
        ],
        jawaban: t`Tolak $H_0$. Ada bukti bahwa rata-rata kedua kelompok berbeda.`,
      },
      {
        soal: "Tiga metode belajar (kode 1, 2, 3) dibandingkan pada satu kolom Nilai. Tulis langkah One-Way ANOVA di SPSS. Hasilnya: Sig. pada tabel ANOVA = 0,003. Apa langkah selanjutnya?",
        diketahui: [
          "Kolom Nilai (numerik) dan kolom Metode (kode 1, 2, 3)",
          t`Sig. tabel ANOVA $= 0{,}003$`,
        ],
        ditanya: "Langkah di SPSS dan tindak lanjut",
        langkah: [
          "Klik Analyze, Compare Means, lalu One-Way ANOVA.",
          "Pindahkan Nilai ke Dependent List dan Metode ke Factor.",
          "Klik Options, centang Descriptive dan Homogeneity of variance test, lalu Continue.",
          "Klik Post Hoc, centang Tukey, lalu Continue dan OK.",
          t`Baca tabel ANOVA: $0{,}003 \le 0{,}05$, jadi tolak $H_0$`,
          "Buka tabel Multiple Comparisons untuk melihat pasangan metode mana yang berbeda (Sig. kurang dari atau sama dengan 0,05).",
        ],
        jawaban: t`Karena Sig. $\le 0{,}05$, setidaknya satu rata-rata berbeda. Lanjutkan dengan membaca tabel Tukey untuk menentukan pasangan yang berbeda.`,
      },
    ],
  },

  {
    slug: "spss-korelasi-regresi",
    judul: "SPSS: korelasi dan regresi linear",
    kategori: "Statistika Inferensial",
    tingkat: "Mahasiswa",
    video: [],
    pengertian: [
      t`Untuk korelasi, klik Analyze, Correlate, lalu Bivariate. Pindahkan dua variabel ke kotak Variables, centang Pearson, dan pilih Two-tailed. Output berupa tabel Correlations yang memuat Pearson Correlation (nilai $r$), Sig. (2-tailed), dan N. Bila Sig. $\le 0{,}05$, korelasinya signifikan. Bila datanya ordinal, centang Spearman.`,
      t`Untuk regresi linear, klik Analyze, Regression, lalu Linear. Isi variabel yang diprediksi ke Dependent dan variabel prediktor ke Independent(s). Output utama ada tiga tabel: Model Summary (R dan R Square), ANOVA (Sig. untuk menguji model), dan Coefficients.`,
      t`Pada tabel Coefficients, kolom B berisi koefisien: baris Constant adalah $a$ dan baris variabel prediktor adalah $b$, sehingga persamaannya $\hat{y} = a + bx$. Kolom Sig. di tabel itu menguji apakah tiap koefisien berbeda dari nol. R Square adalah $r^2$, yaitu proporsi variasi $y$ yang dijelaskan oleh $x$.`,
    ],
    rumus: [
      {
        nama: "Persamaan regresi dari kolom B",
        tex: t`\hat{y} = a + bx`,
        ket: t`$a$ dari baris Constant, $b$ dari baris variabel prediktor.`,
      },
    ],
    contoh: [
      {
        soal: "Data lima siswa (jam belajar dan nilai) dianalisis dengan Analyze, Correlate, Bivariate. Output: Pearson Correlation = 0,775, Sig. (2-tailed) = 0,124, N = 5. Apa kesimpulannya pada alpha 0,05?",
        diketahui: [
          t`$r = 0{,}775$ dan $N = 5$`,
          t`Sig. (2-tailed) $= 0{,}124$`,
          t`$\alpha = 0{,}05$`,
        ],
        ditanya: "Keputusan uji korelasi",
        langkah: [
          t`Nilai $r = 0{,}775$ menunjukkan hubungan positif yang kuat di sampel`,
          t`Bandingkan Sig. dengan alpha: $0{,}124 > 0{,}05$`,
        ],
        jawaban: t`Gagal menolak $H_0$. Korelasi belum terbukti signifikan karena sampelnya sangat kecil ($N = 5$), walaupun $r$-nya besar.`,
      },
      {
        soal: "Regresi linear pada data yang sama menghasilkan: R Square = 0,600, Constant (B) = 2,200, dan Jam_belajar (B) = 0,600. Tulis persamaan regresinya dan tafsirkan.",
        diketahui: [
          t`R Square $= 0{,}600$`,
          t`Constant (B) $= 2{,}200$ dan Jam_belajar (B) $= 0{,}600$`,
        ],
        ditanya: "Persamaan regresi dan tafsirannya",
        langkah: [
          t`Ambil $a = 2{,}200$ dari baris Constant`,
          t`Ambil $b = 0{,}600$ dari baris Jam_belajar`,
          t`Susun persamaan: $\hat{y} = 2{,}2 + 0{,}6x$`,
          t`Tafsir R Square: $0{,}600$ berarti $60\%$ variasi nilai dijelaskan oleh jam belajar`,
        ],
        jawaban: t`$\hat{y} = 2{,}2 + 0{,}6x$. Setiap tambahan satu jam belajar menaikkan prediksi nilai rata-rata sebesar $0{,}6$ poin.`,
      },
    ],
  },
];