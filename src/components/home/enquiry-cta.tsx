"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Globe2 } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { Reveal } from "@/components/motion/reveal";

export function EnquiryCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#420A15] text-[#FAF6EE]">
      <div className="grid lg:grid-cols-2 min-h-[520px] xl:min-h-[620px]">
        {/* Copy */}
        <div className="grain relative flex items-center order-2 lg:order-1">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#7E1529_0%,#5E0F1E_40%,#420A15_100%)]"
          />
          <div className="relative w-full px-6 sm:px-12 xl:px-20 2xl:px-28 py-20 lg:py-24 max-w-3xl lg:ml-auto">
            <Reveal>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#D4AF67]">
                <span className="w-8 h-px bg-[#D4AF67]" />
                Private Sourcing Concierge
              </p>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl xl:text-6xl font-normal leading-[1.05]">
                Looking for a <em className="text-gold-gradient">specific stone?</em>
              </h2>
              <p className="mt-6 text-base xl:text-lg font-light text-[#FAF6EE]/75 leading-relaxed max-w-xl">
                Tell us the colour, cut, and carat you have in mind. Our gemmologists will search our private
                Ratnapura reserves and reply within 24 hours.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="shine-sweep group inline-flex items-center justify-center gap-3 bg-[#D4AF67] hover:bg-[#F3DFA2] text-[#1A1410] px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-500"
              >
                Enquire Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-[#D4AF67]/60 hover:bg-[#FAF6EE] hover:text-[#420A15] px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-500"
              >
                <Image
                  src="/isuru_images/whatsapp.png"
                  alt=""
                  width={18}
                  height={18}
                  className="w-4 h-4 object-contain rounded-full"
                />
                WhatsApp Us
              </a>
            </Reveal>

            <Reveal delay={0.3} className="mt-12 pt-8 border-t border-[#FAF6EE]/15 grid grid-cols-2 gap-6 max-w-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D4AF67] shrink-0 mt-0.5" strokeWidth={1.4} />
                <div>
                  <p className="font-serif text-xl">24 hours</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#FAF6EE]/55 mt-1">Response time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-[#D4AF67] shrink-0 mt-0.5" strokeWidth={1.4} />
                <div>
                  <p className="font-serif text-xl">Worldwide</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#FAF6EE]/55 mt-1">Insured delivery</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Image */}
        <div className="relative order-1 lg:order-2 min-h-[320px] overflow-hidden bg-[#120F0D]">
          <motion.div style={reduce ? undefined : { y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src="/isuru_images/bucket.webp"
              alt="Oval Ceylon blue sapphire set in an ornate handcrafted gold ring with sapphire pavé"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-r from-[#420A15]/60 via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-[#420A15]/70 via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-6 xl:inset-10 border border-[#D4AF67]/30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
