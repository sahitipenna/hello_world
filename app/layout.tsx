import type { Metadata } from "next";
import { Fraunces, Caveat, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daybook — one small, curious day at a time",
  description:
    "A daily almanac: news bites, a mini crossword, a comic break, a poem, an art spotlight, a travel vignette, a book recommendation, and five prompts for your hobbies — for every day of the year.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${caveat.variable} ${workSans.variable}`}>
      <body className="font-sans bg-paper bg-grain bg-repeat min-h-screen text-ink" style={{ fontFamily: "var(--font-work-sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
