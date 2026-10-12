import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";

export default function NotFound() {
  return (
    <div className="py-24 bg-[#FAF6EE] min-h-[70vh] flex items-center justify-center text-center">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
          Error 404 • Island Archive
        </span>
        {/* Strictly the single H1 on the 404 page */}
        <h1 className="font-serif text-4xl text-[#5E0F1E] font-normal">
          Specimen Not Found
        </h1>
        <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
          The gemstone archive or page you are seeking may have been placed in private museum reserve or re-cataloged.
        </p>

        <GoldDivider withOrnament className="my-6" />

        <div>
          <Link
            href="/gems"
            className="inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#420A15] transition-colors"
          >
            Explore Active Vault
          </Link>
        </div>
      </div>
    </div>
  );
}
