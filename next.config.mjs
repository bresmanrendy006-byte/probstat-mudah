/** @type {import('next').NextConfig} */

// Header keamanan untuk semua halaman.
// CSP penuh sengaja belum dipasang (KaTeX dan pemutar YouTube mudah rusak).
const headerKeamanan = [
  // Browser tidak boleh menebak tipe file (mencegah file disalahartikan sebagai skrip).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Hanya kirim asal situs (bukan alamat lengkap) saat pengguna pindah ke situs lain.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Matikan fitur perangkat yang tidak dipakai situs ini.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Situs ini tidak boleh dibungkus (iframe) di situs lain.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig = {
  /* config options here */

  // Sembunyikan header "X-Powered-By: Next.js".
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: headerKeamanan }];
  },

  // Alamat perangkat lain (mis. HP lewat Wi-Fi) yang boleh membuka server dev.
  // Hanya berlaku saat `npm run dev`, tidak berpengaruh di Vercel.
  // Bila IP laptop berubah (pindah Wi-Fi / hotspot), tambahkan IP barunya di sini.
  allowedDevOrigins: ["10.205.109.65"],

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;