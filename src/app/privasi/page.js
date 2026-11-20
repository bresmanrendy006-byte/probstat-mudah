// src/app/privasi/page.js
// Halaman Kebijakan Privasi (halaman server biasa, tanpa login).

export const metadata = {
  title: "Kebijakan Privasi | ProbStat Mudah",
};

function Bagian({ judul, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">{judul}</h2>
      <div className="mt-2 space-y-3 text-ink/80">{children}</div>
    </section>
  );
}

export default function Privasi() {
  return (
    <article className="mx-auto max-w-3xl animate-rise">
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-hard sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand">Legal</p>
        <h1 className="mt-1 text-3xl font-bold">Kebijakan Privasi</h1>
        <p className="mt-1 text-sm text-ink/60">Terakhir diperbarui: 18 November 2026</p>

        <p className="mt-5 text-ink/80">
          ProbStat Mudah adalah situs belajar probabilitas dan statistika. Halaman ini
          menjelaskan data apa yang kami simpan, untuk apa, dan apa hakmu atas data itu,
          dengan mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
          Pribadi (UU PDP).
        </p>

        <Bagian judul="1. Tanpa akun, tanpa data">
          <p>
            Materi, video, dan kalkulator bisa dipakai tanpa login. Saat kamu memakainya
            tanpa akun, kami tidak menyimpan hasil hitunganmu atau jawaban kuismu di
            server kami.
          </p>
        </Bagian>

        <Bagian judul="2. Data yang kami simpan jika kamu membuat akun">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Nama yang kamu isi saat mendaftar.</li>
            <li>Alamat email.</li>
            <li>
              Kata sandi. Kata sandi disimpan oleh layanan autentikasi kami dalam bentuk
              terenkripsi (hash), sehingga kami tidak bisa membacanya.
            </li>
            <li>
              Data belajar: materi yang kamu tandai selesai, skor kuis (setiap percobaan),
              dan materi yang kamu simpan (bookmark).
            </li>
            <li>
              Jika fitur riwayat hitungan tersedia nanti, jenis, isian, dan hasil hitungan
              yang kamu simpan saat login.
            </li>
          </ul>
        </Bagian>

        <Bagian judul="3. Untuk apa data dipakai">
          <p>
            Data dipakai hanya untuk menjalankan akunmu: masuk ke situs, menampilkan
            progres dan skor di dashboard, mengirim email konfirmasi pendaftaran, dan
            menjaga keamanan situs. Kami tidak menjual datamu dan tidak menampilkan iklan.
          </p>
        </Bagian>

        <Bagian judul="4. Siapa yang bisa melihat datamu">
          <p>
            Datamu terlindungi aturan akses di database, jadi pengguna lain tidak bisa
            melihatnya. Pengelola situs (admin) dapat melihat nama, email, role, progres,
            dan skor kuis semua pengguna untuk keperluan pengelolaan. Admin hanya membaca
            data belajar, tidak mengubahnya.
          </p>
        </Bagian>

        <Bagian judul="5. Layanan pihak ketiga">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Supabase: autentikasi dan penyimpanan database.</li>
            <li>Vercel: hosting situs.</li>
            <li>
              YouTube: pemutar video (kami memakai mode privasi yang diperbarui,
              youtube-nocookie) dan gambar sampul video. YouTube dapat memproses data
              penontonan sesuai kebijakannya sendiri.
            </li>
          </ul>
          <p>
            Server penyedia layanan ini dapat berada di luar Indonesia, sehingga datamu
            dapat diproses di luar negeri.
          </p>
        </Bagian>

        <Bagian judul="6. Cookie">
          <p>
            Kami memakai cookie yang diperlukan agar kamu tetap login. Kami tidak memakai
            cookie iklan atau pelacakan pihak ketiga untuk tujuan periklanan.
          </p>
        </Bagian>

        <Bagian judul="7. Berapa lama data disimpan">
          <p>
            Data akunmu disimpan selama akunmu ada. Jika kamu meminta penghapusan akun,
            kami menghapus data akun dan data belajarmu, kecuali bila ada kewajiban hukum
            untuk menyimpannya.
          </p>
        </Bagian>

        <Bagian judul="8. Hakmu">
          <p>
            Sesuai UU PDP, kamu berhak meminta akses ke datamu, memperbaiki data yang
            keliru, meminta penghapusan data atau akunmu, dan menarik persetujuan
            pemrosesan data. Kirim permintaan ke email di bagian kontak. Kami berusaha
            menanggapinya dalam waktu yang wajar.
          </p>
        </Bagian>

        <Bagian judul="9. Pengguna di bawah umur">
          <p>
            Situs ini ditujukan untuk siswa dan mahasiswa. Jika kamu belum berusia 18
            tahun, mintalah izin dan pendampingan orang tua atau wali sebelum membuat
            akun.
          </p>
        </Bagian>

        <Bagian judul="10. Keamanan dan perubahan">
          <p>
            Kami menerapkan langkah keamanan yang wajar, tetapi tidak ada sistem yang
            sepenuhnya bebas risiko. Jika kebijakan ini berubah, tanggal pembaruan di
            atas akan diperbarui.
          </p>
        </Bagian>

        <Bagian judul="11. Kontak">
          <p>Pertanyaan atau permintaan soal data pribadi bisa dikirim ke salah satu email berikut:</p>
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