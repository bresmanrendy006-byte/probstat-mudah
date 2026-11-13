import "./globals.css";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import KerangkaUmum from "@/components/KerangkaUmum";

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
        <KerangkaUmum>{children}</KerangkaUmum>
      </body>
    </html>
  );
}