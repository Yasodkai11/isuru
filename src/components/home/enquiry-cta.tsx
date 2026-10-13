import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function EnquiryCTA() {
  return (
    <section className="bg-[#5E0F1E] text-[#FAF6EE] border-t border-[#B8924A]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">Looking for a specific stone?</h2>
          <p className="mt-2 text-sm text-[#FAF6EE]/75">Tell us what you need we reply within 24 hours.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#B8924A] hover:bg-[#D4AF67] text-[#1A1410] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
          >
            Enquire Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#D4AF67]/70 hover:bg-[#FAF6EE]/10 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
          >
            <Image
              src="/isuru_images/whatsapp.png"
              alt="WhatsApp"
              width={18}
              height={18}
              className="w-4 h-4 object-contain rounded-full"
            />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
