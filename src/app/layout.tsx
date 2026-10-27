import type { Metadata } from "next";
import { IBM_Plex_Serif, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteFooterVisibility } from "@/components/layout/site-footer-visibility";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";

export const metadata: Metadata = {
  title: {
    template: "%s | Isuru Ceylon Gems",
    default: "Isuru Ceylon Gems | Natural Unheated Ceylon Sapphires from Ratnapura, Sri Lanka",
  },
  description:
    "Isuru Ceylon Gems is a registered gemstone dealer in Ratnapura, Sri Lanka (NGJA Reg: 202610DL42288). Direct source of natural, unheated Ceylon royal blue sapphires, padparadschas, rubies and spinels with GIA, GRS and NGJA certification.",
  keywords: [
    "Isuru Ceylon Gems",
    "Isuru Ceylon",
    "Isuru Gems",
    "Ceylon Sapphires",
    "Ratnapura Gems",
    "Padparadscha Sapphire",
    "Royal Blue Sapphire Sri Lanka",
    "Unheated Ceylon Sapphire",
    "Natural Gemstones Sri Lanka",
    "National Gem and Jewellery Authority NGJA",
    "Ratnapura Gem Dealer",
  ],
  authors: [{ name: "Isuru Ceylon Gems", url: siteUrl }],
  creator: "Isuru Ceylon Gems",
  publisher: "Isuru Ceylon Gems",
  category: "Jewelry & Gemstones",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Isuru Ceylon Gems | Natural Unheated Ceylon Sapphires from Ratnapura, Sri Lanka",
    description: "Ethically mined, unheated certified Ceylon gemstones direct from our Ratnapura bureau.",
    siteName: "Isuru Ceylon Gems",
    url: siteUrl,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/isuru_images/blue1.webp",
        width: 1200,
        height: 630,
        alt: "Isuru Ceylon Gems - Certified Natural Ceylon Gemstones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Isuru Ceylon Gems | Natural Unheated Ceylon Sapphires & Rare Gems",
    description: "Direct mine-to-market natural Ceylon gemstones, unheated Royal Blue Sapphires, and certified precious specimens from Ratnapura, Sri Lanka.",
    images: ["/isuru_images/blue1.webp"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSerif.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#2B2B2B] antialiased selection:bg-[#B8924A]/20 selection:text-[#5E0F1E]">
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <SiteFooterVisibility>
          <Footer />
        </SiteFooterVisibility>
        <CartSheet />
      </body>
    </html>
  );
}
