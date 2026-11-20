// src/app/syarat/page.js
// Halaman Syarat Layanan (halaman server biasa, tanpa login).

import Link from "next/link";

export const metadata = {
  title: "Syarat Layanan | ProbStat Mudah",
};

function Bagian({ judul, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">{judul}</h2>
      <div className="mt-2 space-y-3 text-ink/80">{children}</div>
    </section>
  );
}

export default function Syarat() {
  return (
    <article className="mx-auto max-w-3xl animate-rise">
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand">Legal</p>
        <h1 className="mt-1 text-3xl font-bold">Syarat Layanan</h1>
        <p className="mt-1 text-sm text-ink/60">Terakhir diperbarui: 18 November 2026</p>

        <p className="mt-5 text-ink/80">
          Dengan memakai ProbStat Mudah, kamu menyetujui syarat berikut. Jika tidak
          setuju, mohon jangan memakai situs ini.
        </p>

        <Bagian judul="1. Tentang layanan">
          <p>
            ProbStat Mudah menyediakan materi, video, kuis, dan kalkulator untuk belajar
            probabilitas dan statistika. Sebagian fitur bisa dipakai tanpa akun. Akun
            diperlukan untuk menyimpan progres, skor, dan bookmark.
          </p>
        </Bagian>

        <Bagian judul="2. Akun">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Isilah data yang benar dan pakai email yang kamu miliki.</li>
            <li>Jaga kerahasiaan kata sandimu. Kamu bertanggung jawab atas aktivitas akunmu.</li>
            <li>Satu orang sebaiknya memakai satu akun.</li>
            <li>Jika kamu belum berusia 18 tahun, mintalah izin orang tua atau wali.</li>
          </ul>
        </Bagian>

        <Bagian judul="3. Hanya untuk belajar">
          <p>
            Materi dan kalkulator dibuat sebagai alat bantu belajar. Kami berusaha
            menyajikan isi yang benar, tetapi tidak menjamin bebas dari kekeliruan.
            Jangan menjadikan hasilnya satu-satunya dasar untuk keputusan penting
            seperti keputusan penelitian, keuangan, atau kesehatan. Periksa kembali
            dengan sumber yang sesuai.
          </p>
        </Bagian>

        <Bagian judul="4. Yang tidak boleh dilakukan">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Mencoba menembus keamanan situs atau mengakses data pengguna lain.</li>
            <li>Membebani atau mengganggu layanan, misalnya dengan permintaan otomatis berlebihan.</li>
            <li>Memakai situs untuk tujuan melanggar hukum.</li>
            <li>Menyalin dan menjual ulang materi tanpa izin.</li>
          </ul>
        </Bagian>

        <Bagian judul="5. Hak cipta">
          <p>
            Materi, soal, dan tampilan situs dilindungi hak cipta pengelola. Kamu boleh
            memakainya untuk belajar pribadi. Video ditampilkan lewat YouTube dan tunduk
            pada ketentuan YouTube.
          </p>
        </Bagian>

        <Bagian judul="6. Ketersediaan layanan">
          <p>
            Layanan diberikan apa adanya. Situs bisa sewaktu-waktu berubah, terhenti
            sementara, atau memiliki fitur yang diubah atau dihapus.
          </p>
        </Bagian>

        <Bagian judul="7. Penghentian akun">
          <p>
            Kami dapat membatasi atau menghapus akun yang melanggar syarat ini. Kamu juga
            bisa meminta penghapusan akunmu kapan saja lewat kontak di bawah.
          </p>
        </Bagian>

        <Bagian judul="8. Perubahan dan hukum yang berlaku">
          <p>
            Syarat ini dapat diperbarui, dan tanggal di atas akan ikut berubah. Syarat
            ini tunduk pada hukum Republik Indonesia. Data pribadi dijelaskan di{" "}
            <Link
              href="/privasi"
              className="font-semibold text-brand underline underline-offset-2"
            >
              Kebijakan Privasi
            </Link>
            .
          </p>
        </Bagian>

        <Bagian judul="9. Kontak">
          <p>Pertanyaan soal syarat ini bisa dikirim ke salah satu email berikut:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            {[
              "bresmanrendy006@gmail.com",
              "vionapardede22@gmail.com",
              "gloriasimaremare07@gmail.com",
              "erosindah7@gmail.com",
              "valdysimbolon@gmail.com",
            ].map((e) => (
              <li key={e}>
                <a
                  href={`mailto:${e}`}
                  className="font-semibold text-brand underline underline-offset-2"
                >
                  {e}
                </a>
              </li>
            ))}
          </ul>
        </Bagian>
      </div>
    </article>
  );
}