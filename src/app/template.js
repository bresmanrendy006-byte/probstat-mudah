// src/app/template.js
// Dimuat ulang setiap pindah halaman, jadi animasi "rise" main di setiap halaman.

export default function Template({ children }) {
  return <div className="animate-rise">{children}</div>;
}