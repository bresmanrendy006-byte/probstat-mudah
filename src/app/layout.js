import "./globals.css";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Navbar from "@/components/Navbar";
import LatarBelakang from "@/components/LatarBelakang";
import ProgresScroll from "@/components/ProgresScroll";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata = {
  title: "ProbStat Mudah",
  description: "Belajar probabilitas dan statistika lewat video, materi, dan kalkulator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body className="text-ink antialiased min-h-screen">
        <LatarBelakang />
        <ProgresScroll />
        <Navbar />
        <main className="max-w-6xl mx-auto overflow-x-clip px-4 py-10">{children}</main>
        <footer className="border-t-2 border-ink bg-white">
          <p className="max-w-6xl mx-auto px-4 py-5 text-sm text-ink/70">
            ProbStat Mudah · Belajar peluang dan statistika dengan santai.
          </p>
        </footer>
      </body>
    </html>
  );
}