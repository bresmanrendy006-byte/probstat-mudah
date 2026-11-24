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
];