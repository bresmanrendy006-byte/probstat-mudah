// src/components/Teks.js
// Menampilkan teks biasa, dan mengubah bagian di antara $ ... $ menjadi rumus (KaTeX).
// Contoh: <Teks>{"Hasil: $\\dfrac{3}{4}$"}</Teks>

import katex from "katex";
import "katex/dist/katex.min.css";

export default function Teks({ children }) {
  const bagian = String(children).split(/(\$[^$]+\$)/g);

  return (
    <>
      {bagian.map((b, i) => {
        const rumus = b.length > 2 && b.startsWith("$") && b.endsWith("$");
        if (!rumus) return <span key={i}>{b}</span>;

        const html = katex.renderToString(b.slice(1, -1), {
          throwOnError: false,
        });
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </>
  );
}