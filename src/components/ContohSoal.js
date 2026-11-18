// src/components/ContohSoal.js
// Satu contoh soal: Soal, Diketahui, Ditanya, Rumus, Langkah, Jawaban.
// Diketahui, Ditanya, dan Rumus boleh dihilangkan; bagian itu otomatis tidak ditampilkan.

import Teks from "./Teks";

function Bagian({ judul, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brand">{judul}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function ContohSoal({ nomor, data }) {
  return (
    <article className="rounded-3xl border border-brand/10 bg-white p-5 shadow-hard sm:p-6">
      <span className="inline-block rounded-full bg-sun px-3.5 py-1 text-xs font-bold">
        Contoh {nomor}
      </span>
      <p className="mt-3 text-lg font-semibold leading-snug">
        <Teks>{data.soal}</Teks>
      </p>

      <div className="mt-5 space-y-5 text-sm">
        {data.diketahui?.length > 0 && (
          <Bagian judul="Diketahui">
            <ul className="space-y-1.5">
              {data.diketahui.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <div className="min-w-0 overflow-x-auto overflow-y-hidden py-0.5">
                    <Teks>{d}</Teks>
                  </div>
                </li>
              ))}
            </ul>
          </Bagian>
        )}

        {data.ditanya && (
          <Bagian judul="Ditanya">
            <Teks>{data.ditanya}</Teks>
          </Bagian>
        )}

        {data.rumus && (
          <Bagian judul="Rumus">
            <div className="overflow-x-auto overflow-y-hidden rounded-2xl bg-paper px-4 py-2.5">
              <Teks>{data.rumus}</Teks>
            </div>
          </Bagian>
        )}

        <Bagian judul="Langkah penyelesaian">
          <ol className="space-y-2.5">
            {data.langkah.map((l, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lavender text-xs font-bold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0 overflow-x-auto overflow-y-hidden py-0.5">
                  <Teks>{l}</Teks>
                </div>
              </li>
            ))}
          </ol>
        </Bagian>

        <div className="flex gap-3 rounded-2xl bg-mint/30 p-4">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-mint"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide">Jawaban</p>
            <div className="mt-1 overflow-x-auto overflow-y-hidden font-semibold">
              <Teks>{data.jawaban}</Teks>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}