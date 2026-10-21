import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acquisition Vault & Bag",
  description: "Review reserved Ceylon gemstones for private acquisition and insured courier dispatch.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/cart",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
