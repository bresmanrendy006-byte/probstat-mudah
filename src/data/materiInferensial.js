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
];