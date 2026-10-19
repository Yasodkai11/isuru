import type { Metadata } from "next";
import { AccountPortal } from "@/components/account/account-portal";

export const metadata: Metadata = {
  title: "Collector Vault Portal",
  description:
    "Private collector portfolio, gemstone acquisition records, laboratory certificate dossiers, and concierge consultations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF6EE] min-h-[80vh]">
      <div className="container-luxe px-4 sm:px-6 lg:px-8">
        <AccountPortal />
      </div>
    </div>
  );
}
