/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

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