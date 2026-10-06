import type { Metadata } from "next";
import { La_Belle_Aurore, Spectral, Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PostHogProvider from "@/components/PostHogProvider";
import ClarityProvider from "@/components/ClarityProvider";
import "./globals.css";

const hand = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

const serif = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const description =
  "A daily cultural daybook: world curiosities, an artwork looked at closely, a literary moment, a place worth getting lost in, a book recommendation, a fascinating fact, a mini crossword, and five little things to do — personalized to your interests, for every day of the year.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.godilly.life"),
  title: "Go Dilly — a few good things for your day",
  description,
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Go Dilly",
  },
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

export const viewport = {
  themeColor: "#2b2622",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hand.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans bg-paper bg-grain bg-repeat min-h-screen text-ink" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        <PostHogProvider>{children}</PostHogProvider>
        <ClarityProvider />
        <Analytics />
      </body>
    </html>
  );
}
