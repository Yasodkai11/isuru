import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Gemstone Vault",
  description: "Review your curated Ceylon gemstones reserved for private acquisition and insured courier dispatch.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
