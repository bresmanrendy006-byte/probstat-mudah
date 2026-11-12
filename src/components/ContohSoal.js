// src/components/ContohSoal.js
// Satu contoh soal lengkap: Soal, Diketahui, Ditanya, Rumus, Langkah, Jawaban.

import Teks from "./Teks";

function Bagian({ judul, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brand">{judul}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function ContohSoal({ nomor, data }) {
  return (
    <article className="rounded-2xl border-2 border-ink bg-white p-5 shadow-hard">
      <span className="inline-block rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-xs font-bold">
        Contoh {nomor}
      </span>
      <p className="mt-3 text-lg font-semibold">{data.soal}</p>

      <div className="mt-4 space-y-4 text-sm">
        <Bagian judul="Diketahui">
          <ul className="list-inside list-disc space-y-1">
            {data.diketahui.map((d, i) => (
              <li key={i}>
                <Teks>{d}</Teks>
              </li>
            ))}
          </ul>
        </Bagian>

        <Bagian judul="Ditanya">
          <Teks>{data.ditanya}</Teks>
        </Bagian>

        <Bagian judul="Rumus">
          <div className="overflow-x-auto rounded-lg border-2 border-ink/20 bg-paper px-3 py-2">
            <Teks>{data.rumus}</Teks>
          </div>
        </Bagian>

        <Bagian judul="Langkah penyelesaian">
          <ol className="space-y-2">
            {data.langkah.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold">{i + 1}.</span>
                <div className="min-w-0 overflow-x-auto">
                  <Teks>{l}</Teks>
                </div>
              </li>
            ))}
          </ol>
        </Bagian>

        <div className="rounded-xl border-2 border-ink bg-mint/10 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-mint">Jawaban</p>
          <p className="mt-1 font-semibold">
            <Teks>{data.jawaban}</Teks>
          </p>
        </div>
      </div>
    </article>
  );
}