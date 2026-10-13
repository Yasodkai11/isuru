import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ScrollProgress } from "@/components/layout/scroll-progress";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Isuru Gems Ceylon",
    default: "Isuru Gems | Natural Ceylon Sapphires & Precious Island Gemstones",
  },
  description:
    "Direct from the historic gem gravels of Ratnapura, Sri Lanka. Unheated Royal Blue Sapphires, Padparadscha, Rubies, and Star Sapphires certified by NGJA, GRS & GIA.",
  keywords: [
    "Ceylon Sapphires",
    "Ratnapura Gems",
    "Padparadscha Sapphire",
    "Royal Blue Sapphire Sri Lanka",
    "Unheated Ceylon Sapphire",
    "Natural Gemstones Sri Lanka",
    "National Gem and Jewellery Authority NGJA",
  ],
  authors: [{ name: "Isuru Gems Ceylon" }],
  metadataBase: new URL("https://isurugems.com"),
  openGraph: {
    title: "Isuru Gems | Natural Ceylon Sapphires & Fine Island Gemstones",
    description: "Ethically mined, unheated certified Ceylon gemstones direct from Ratnapura.",
    siteName: "Isuru Gems",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#2B2B2B] antialiased selection:bg-[#B8924A]/20 selection:text-[#5E0F1E]">
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSheet />
      </body>
    </html>
  );
}
