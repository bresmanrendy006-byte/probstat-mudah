// src/lib/keterangan.js
// Kalimat keterangan otomatis berbasis ATURAN (if/else), bukan AI.
// Angka ambang adalah aturan praktis untuk membantu belajar, bukan kepastian.

// Angka dibulatkan, desimal memakai koma (gaya Indonesia)
function angka(x, desimal = 2) {
  const k = 10 ** desimal;
  return String(Math.round(x * k) / k).replace(".", ",");
}

function daftarAngka(arr, maks = 5) {
  const tampil = arr.slice(0, maks).map((x) => angka(x));
  if (arr.length > maks) tampil.push(`dan ${arr.length - maks} lainnya`);
  return tampil.join(", ");
}

// ---------- Statistika deskriptif ----------

// data: array angka mentah. kuartil: objek dari prosesStatistika.
// Mengembalikan [{ judul, isi }].
export function keteranganStatistika(data, kuartil) {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const urut = [...data].sort((a, b) => a - b);
  const median = n % 2 === 1 ? urut[(n - 1) / 2] : (urut[n / 2 - 1] + urut[n / 2]) / 2;
  const s = Math.sqrt(data.reduce((a, x) => a + (x - mean) ** 2, 0) / (n - 1));
  const hasil = [];

  // Semua data sama: tidak ada yang perlu ditafsirkan lebih jauh
  if (s === 0) {
    return [
      {
        judul: "Sebaran",
        isi: `Semua data bernilai sama (${angka(mean)}), jadi tidak ada variasi. Simpangan baku bernilai 0.`,
      },
    ];
  }

  // 1. Bentuk sebaran (skewness Pearson: 3 x (mean - median) / s)
  const sk = (3 * (mean - median)) / s;
  const besar = Math.abs(sk);
  let isiSebaran;
  if (besar < 0.2) {
    isiSebaran = `Mean (${angka(mean)}) dan median (${angka(median)}) hampir sama, jadi sebaran data kira-kira simetris.`;
  } else {
    const arah = sk > 0 ? "kanan" : "kiri";
    const tingkat = besar < 0.5 ? "sedikit condong" : besar < 1 ? "condong" : "sangat condong";
    const sebab =
      sk > 0
        ? "Mean lebih besar dari median karena ada beberapa nilai besar yang menarik mean ke atas."
        : "Mean lebih kecil dari median karena ada beberapa nilai kecil yang menarik mean ke bawah.";
    isiSebaran = `Mean (${angka(mean)}) ${sk > 0 ? "lebih besar" : "lebih kecil"} dari median (${angka(median)}), jadi sebaran data ${tingkat} ke ${arah}. ${sebab}`;
  }
  hasil.push({ judul: "Bentuk sebaran", isi: isiSebaran });

  // 2. Keragaman (koefisien variasi)
  if (mean !== 0) {
    const kv = (s / Math.abs(mean)) * 100;
    const nilai = kv < 15 ? "relatif seragam" : kv <= 30 ? "cukup beragam" : "sangat beragam";
    hasil.push({
      judul: "Keragaman data",
      isi: `Simpangan baku ${angka(s)} adalah sekitar ${angka(kv, 1)}% dari mean, jadi data ${nilai}. (Aturan praktis: di bawah 15% seragam, 15 sampai 30% cukup beragam, di atas 30% sangat beragam.)`,
    });
  }

  // 3. Pencilan (aturan 1,5 x IQR)
  const { pencilan, batasBawah, batasAtas } = kuartil;
  if (pencilan.length === 0) {
    hasil.push({
      judul: "Pencilan",
      isi: `Tidak ada pencilan. Semua data berada di antara ${angka(batasBawah)} dan ${angka(batasAtas)}.`,
    });
  } else {
    const banyak = pencilan.length === 1 ? "1 data" : `${pencilan.length} data`;
    let isi = `Ada ${banyak} yang tergolong pencilan, yaitu ${daftarAngka(pencilan)}. Nilai ini berada di luar batas ${angka(batasBawah)} sampai ${angka(batasAtas)}.`;
    if (mean !== median) {
      isi += " Pencilan memengaruhi mean lebih besar daripada median, jadi median lebih tahan untuk menggambarkan pusat data.";
    }
    isi += " Periksa dulu apakah itu salah ketik atau memang nilai yang sah.";
    hasil.push({ judul: "Pencilan", isi });
  }

  // 4. Catatan jumlah data
  if (n < 30) {
    hasil.push({
      judul: "Catatan",
      isi: `Datanya hanya ${n}. Dengan data sedikit, bentuk sebaran dan pencilan mudah berubah, jadi tafsirkan dengan hati-hati.`,
    });
  }

  return hasil;
}

// ---------- Untuk nanti: korelasi dan p-value ----------

// Kekuatan korelasi dari |r|
export function kekuatanKorelasi(r) {
  const a = Math.abs(r);
  const arah = r > 0 ? "positif" : r < 0 ? "negatif" : "";
  let kekuatan;
  if (a >= 0.8) kekuatan = "sangat kuat";
  else if (a >= 0.6) kekuatan = "kuat";
  else if (a >= 0.4) kekuatan = "sedang";
  else if (a >= 0.2) kekuatan = "lemah";
  else kekuatan = "sangat lemah";
  return `Korelasi ${kekuatan}${arah ? ` dan ${arah}` : ""} (r = ${angka(r, 3)}).`;
}

// Tafsir p-value terhadap taraf signifikansi alpha
export function tafsirPValue(p, alpha = 0.05) {
  const teksP = p < 0.001 ? "p < 0,001" : `p = ${angka(p, 3)}`;
  if (p < alpha) {
    return `${teksP}, lebih kecil dari ${angka(alpha)}, jadi hasilnya signifikan (H₀ ditolak).`;
  }
  return `${teksP}, tidak lebih kecil dari ${angka(alpha)}, jadi hasilnya tidak signifikan (H₀ tidak ditolak).`;
}