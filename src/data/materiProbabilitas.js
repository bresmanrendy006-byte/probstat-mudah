// src/data/materiProbabilitas.js
// Isi materi kategori Probabilitas (selain Peluang Suatu Kejadian, yang ada di materi.js).
// video: [] diisi ID YouTube bila sudah ada, misalnya video: ["abc123XYZ"].

const t = String.raw;

export const materiProbabilitas = [
  {
    slug: "konsep-dasar-peluang",
    judul: "Konsep dasar: percobaan, ruang sampel, kejadian",
    kategori: "Probabilitas",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Percobaan adalah kegiatan yang hasilnya tidak bisa dipastikan sebelumnya, misalnya melempar dadu atau koin. Setiap hasil yang mungkin muncul disebut titik sampel.`,
      t`Himpunan semua titik sampel disebut ruang sampel ($S$). Kejadian ($K$) adalah himpunan bagian dari $S$. Pada pelemparan dadu, $S = \{1, 2, 3, 4, 5, 6\}$, dan kejadian "angka genap" adalah $K = \{2, 4, 6\}$.`,
    ],
    rumus: [
      { nama: "Titik sampel pada n koin", tex: t`n(S) = 2^n`, ket: t`Tiap koin punya $2$ kemungkinan sisi.` },
      { nama: "Titik sampel pada n dadu", tex: t`n(S) = 6^n`, ket: t`Tiap dadu punya $6$ kemungkinan angka.` },
      { nama: "Batas nilai peluang", tex: t`0 \le P(K) \le 1`, ket: t`$P(K)=0$ untuk kejadian mustahil, $P(K)=1$ untuk kejadian pasti.` },
    ],
    contoh: [
      {
        soal: "Sebuah koin dan sebuah dadu dilempar bersamaan. Tuliskan kejadian muncul Angka dan bilangan prima, lalu hitung peluangnya.",
        diketahui: [
          t`Koin: Angka (A) atau Gambar (G), ada $2$ hasil`,
          t`Dadu: $1$ sampai $6$, ada $6$ hasil`,
          t`Bilangan prima pada dadu: $2, 3, 5$`,
        ],
        ditanya: t`Kejadian $K$ dan peluangnya $P(K)$`,
        rumus: t`$P(K) = \dfrac{n(K)}{n(S)}$`,
        langkah: [
          t`Hitung banyak titik sampel: $n(S) = 2 \times 6 = 12$`,
          t`Tulis kejadiannya: $K = \{(A,2), (A,3), (A,5)\}$, sehingga $n(K) = 3$`,
          t`Hitung peluangnya: $P(K) = \dfrac{3}{12} = \dfrac{1}{4}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{1}{4}$ atau $0{,}25$.`,
      },
      {
        soal: "Dua dadu dilempar bersamaan. Berapa peluang jumlah kedua mata dadu sama dengan 7?",
        diketahui: [
          t`Tiap dadu punya $6$ hasil, sehingga $n(S) = 6 \times 6 = 36$`,
          t`Pasangan yang berjumlah $7$: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$`,
        ],
        ditanya: t`$P(K)$ untuk jumlah mata dadu $7$`,
        rumus: t`$P(K) = \dfrac{n(K)}{n(S)}$`,
        langkah: [
          t`Banyak pasangan yang berjumlah $7$ ada $6$, sehingga $n(K) = 6$`,
          t`Masukkan ke rumus: $P(K) = \dfrac{6}{36} = \dfrac{1}{6}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{1}{6}$.`,
      },
    ],
  },

  {
    slug: "aturan-penjumlahan",
    judul: "Aturan penjumlahan",
    kategori: "Probabilitas",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Aturan penjumlahan dipakai untuk mencari peluang "A atau B" terjadi, ditulis $P(A \cup B)$.`,
      t`Dua kejadian disebut saling lepas jika tidak mungkin terjadi bersamaan, atau $A \cap B = \emptyset$. Kalau keduanya bisa terjadi bersamaan, kejadian itu tidak saling lepas, dan bagian yang terhitung dua kali harus dikurangi.`,
    ],
    rumus: [
      { nama: "Kejadian saling lepas", tex: t`P(A \cup B) = P(A) + P(B)`, ket: t`Berlaku jika $A \cap B = \emptyset$.` },
      { nama: "Kejadian tidak saling lepas", tex: t`P(A \cup B) = P(A) + P(B) - P(A \cap B)`, ket: t`Irisan dikurangi karena terhitung dua kali.` },
    ],
    contoh: [
      {
        soal: "Dari satu set kartu bridge (52 kartu) diambil satu kartu. Berapa peluang terambil kartu As atau Raja?",
        diketahui: [
          t`$n(S) = 52$`,
          t`Kartu As ada $4$, sehingga $P(A) = \dfrac{4}{52}$`,
          t`Kartu Raja ada $4$, sehingga $P(R) = \dfrac{4}{52}$`,
          t`Satu kartu tidak mungkin sekaligus As dan Raja, jadi kedua kejadian saling lepas`,
        ],
        ditanya: t`$P(A \cup R)$`,
        rumus: t`$P(A \cup R) = P(A) + P(R)$`,
        langkah: [
          t`Masukkan angka: $P(A \cup R) = \dfrac{4}{52} + \dfrac{4}{52}$`,
          t`Jumlahkan: $P(A \cup R) = \dfrac{8}{52} = \dfrac{2}{13}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{2}{13}$.`,
      },
      {
        soal: "Dari satu set kartu bridge diambil satu kartu. Berapa peluang terambil kartu Hati atau Raja?",
        diketahui: [
          t`Kartu Hati ada $13$, sehingga $P(H) = \dfrac{13}{52}$`,
          t`Kartu Raja ada $4$, sehingga $P(R) = \dfrac{4}{52}$`,
          t`Raja Hati ada $1$, sehingga $P(H \cap R) = \dfrac{1}{52}$ (tidak saling lepas)`,
        ],
        ditanya: t`$P(H \cup R)$`,
        rumus: t`$P(H \cup R) = P(H) + P(R) - P(H \cap R)$`,
        langkah: [
          t`Masukkan angka: $P(H \cup R) = \dfrac{13}{52} + \dfrac{4}{52} - \dfrac{1}{52}$`,
          t`Hitung: $P(H \cup R) = \dfrac{16}{52} = \dfrac{4}{13}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{4}{13}$.`,
      },
    ],
  },

  {
    slug: "peluang-bersyarat",
    judul: "Peluang bersyarat",
    kategori: "Probabilitas",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Peluang bersyarat adalah peluang kejadian $A$ jika kejadian $B$ sudah diketahui terjadi. Ditulis $P(A|B)$ dan dibaca "peluang A dengan syarat B".`,
      t`Intinya, ruang sampel menyempit menjadi hanya kejadian $B$. Kita hanya melihat bagian $A$ yang ada di dalam $B$.`,
    ],
    rumus: [
      { nama: "Peluang bersyarat", tex: t`P(A|B) = \dfrac{P(A \cap B)}{P(B)}`, ket: t`Dengan syarat $P(B) > 0$.` },
    ],
    contoh: [
      {
        soal: "Sebuah dadu dilempar. Jika diketahui muncul angka genap, berapa peluang muncul angka lebih dari 3?",
        diketahui: [
          t`$B$ = angka genap $= \{2, 4, 6\}$, sehingga $P(B) = \dfrac{3}{6}$`,
          t`$A$ = angka lebih dari $3 = \{4, 5, 6\}$`,
          t`$A \cap B = \{4, 6\}$, sehingga $P(A \cap B) = \dfrac{2}{6}$`,
        ],
        ditanya: t`$P(A|B)$`,
        rumus: t`$P(A|B) = \dfrac{P(A \cap B)}{P(B)}$`,
        langkah: [
          t`Masukkan angka: $P(A|B) = \dfrac{2/6}{3/6}$`,
          t`Sederhanakan: $P(A|B) = \dfrac{2}{3}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{2}{3}$.`,
      },
      {
        soal: "Dalam satu kelas ada 40 siswa. Sebanyak 25 siswa menyukai Matematika, dan 15 siswa menyukai Matematika sekaligus Statistika. Seorang siswa dipilih acak dan diketahui menyukai Matematika. Berapa peluang ia juga menyukai Statistika?",
        diketahui: [
          t`$P(M) = \dfrac{25}{40}$`,
          t`$P(M \cap S) = \dfrac{15}{40}$`,
        ],
        ditanya: t`$P(S|M)$`,
        rumus: t`$P(S|M) = \dfrac{P(M \cap S)}{P(M)}$`,
        langkah: [
          t`Masukkan angka: $P(S|M) = \dfrac{15/40}{25/40}$`,
          t`Sederhanakan: $P(S|M) = \dfrac{15}{25} = \dfrac{3}{5}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{3}{5}$ atau $0{,}6$.`,
      },
    ],
  },

  {
    slug: "aturan-perkalian",
    judul: "Aturan perkalian",
    kategori: "Probabilitas",
    tingkat: "SMA",
    video: [],
    pengertian: [
      t`Aturan perkalian dipakai untuk mencari peluang "A dan B" terjadi bersamaan atau berurutan, ditulis $P(A \cap B)$.`,
      t`Dua kejadian disebut bebas jika terjadinya satu kejadian tidak memengaruhi yang lain, misalnya melempar koin dan dadu. Kejadian tidak bebas terjadi jika yang satu memengaruhi yang lain, misalnya mengambil bola tanpa pengembalian.`,
    ],
    rumus: [
      { nama: "Kejadian bebas", tex: t`P(A \cap B) = P(A) \times P(B)` },
      { nama: "Kejadian tidak bebas", tex: t`P(A \cap B) = P(A) \times P(B|A)`, ket: t`$P(B|A)$ dihitung setelah $A$ terjadi.` },
    ],
    contoh: [
      {
        soal: "Sebuah koin dan sebuah dadu dilempar bersamaan. Berapa peluang muncul Angka pada koin dan angka 6 pada dadu?",
        diketahui: [
          t`$P(\text{Angka}) = \dfrac{1}{2}$`,
          t`$P(6) = \dfrac{1}{6}$`,
          t`Hasil koin tidak memengaruhi hasil dadu, jadi kedua kejadian bebas`,
        ],
        ditanya: t`$P(\text{Angka} \cap 6)$`,
        rumus: t`$P(A \cap B) = P(A) \times P(B)$`,
        langkah: [
          t`Masukkan angka: $P = \dfrac{1}{2} \times \dfrac{1}{6}$`,
          t`Kalikan: $P = \dfrac{1}{12}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{1}{12}$.`,
      },
      {
        soal: "Sebuah kotak berisi 5 bola merah dan 3 bola biru. Dua bola diambil satu per satu tanpa pengembalian. Berapa peluang keduanya merah?",
        diketahui: [
          t`Total bola $= 8$`,
          t`Pengambilan pertama merah: $P(M_1) = \dfrac{5}{8}$`,
          t`Setelah satu merah diambil, tersisa $4$ merah dari $7$ bola: $P(M_2|M_1) = \dfrac{4}{7}$`,
        ],
        ditanya: t`$P(M_1 \cap M_2)$`,
        rumus: t`$P(M_1 \cap M_2) = P(M_1) \times P(M_2|M_1)$`,
        langkah: [
          t`Masukkan angka: $P = \dfrac{5}{8} \times \dfrac{4}{7}$`,
          t`Kalikan: $P = \dfrac{20}{56} = \dfrac{5}{14}$`,
        ],
        jawaban: t`Peluangnya adalah $\dfrac{5}{14}$.`,
      },
    ],
  },
];