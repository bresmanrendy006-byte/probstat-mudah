// src/components/Teks.js
// Menampilkan teks biasa, dan mengubah bagian di antara $ ... $ menjadi rumus (KaTeX).
// Contoh: <Teks>{"Hasil: $\\dfrac{3}{4}$"}</Teks>
// Tambahkan prop "besar" agar rumus tampil di tengah dengan ukuran besar: <Teks besar>...</Teks>

import katex from "katex";
import "katex/dist/katex.min.css";

export default function Teks({ children, besar = false }) {
  const bagian = String(children).split(/(\$[^$]+\$)/g);

  return (
    <>
      {bagian.map((b, i) => {
        const rumus = b.length > 2 && b.startsWith("$") && b.endsWith("$");
        if (!rumus) return <span key={i}>{b}</span>;

        const html = katex.renderToString(b.slice(1, -1), {
          throwOnError: false,
          displayMode: besar,
        });
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </>
  );
}