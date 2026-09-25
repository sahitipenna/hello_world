import type { Metadata } from "next";
import { Fraunces, Caveat, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const description =
  "A daily cultural daybook: world curiosities, an artwork looked at closely, a literary moment, a place worth getting lost in, a book recommendation, a fascinating fact, a mini crossword, and five little things to do — personalized to your interests, for every day of the year.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.godilly.life"),
  title: "Go Dilly — a few good things for your day",
  description,
  openGraph: {
    title: "Go Dilly — a few good things for your day",
    description,
    url: "https://www.godilly.life",
    siteName: "Go Dilly",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Go Dilly — a few good things for your day",
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${caveat.variable} ${workSans.variable}`}>
      <body className="font-sans bg-paper bg-grain bg-repeat min-h-screen text-ink" style={{ fontFamily: "var(--font-work-sans), sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
