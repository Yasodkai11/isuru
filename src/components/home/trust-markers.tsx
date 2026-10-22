"use client";

import { MapPin, Gem, Truck, ShieldCheck, Award, Globe } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const PILLARS = [
  {
    icon: MapPin,
    title: "Sri Lankan Heritage",
    desc: "Direct origin from Ratnapura — the legendary City of Gems. Over six decades of trusted artisanal mastery and pit-to-vault provenance.",
  },
  {
    icon: Gem,
    title: "100% Natural & Untreated",
    desc: "Unheated Ceylon earth-mined corundum verified under gemological microscopy. Absolute zero-synthetic and zero-glass-filled guarantee.",
  },
  {
    icon: Truck,
    title: "Worldwide Insured Transit",
    desc: "Dispatched in sealed tamper-proof vaults via armored air courier with full replacement transit insurance directly to your door.",
  },
];

const CREDENTIALS = [
  { icon: Award, label: "Est. 1964 · Ratnapura" },
  { icon: ShieldCheck, label: "NGJA Registered · Lic. 202610DL42288" },
  { icon: Globe, label: "Worldwide Insured Delivery" },
];

export function TrustMarkers() {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-[#F5EDE1] border-y border-[#B8924A]/30 py-12 sm:py-16 overflow-hidden">
      {/* Subtle warm glow background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[22rem] rounded-full bg-[#B8924A]/10 blur-[100px]"
      />

      <div className="container-luxe relative">
        {/* Section Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-px bg-[#80601C]/60" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#80601C] font-semibold">
              The Isuru Promise
            </p>
            <span className="w-6 h-px bg-[#80601C]/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-[#5E0F1E] font-normal leading-tight">
            Trusted by collectors <em className="italic text-[#80601C] font-serif">worldwide</em>
          </h2>
        </motion.div>

        {/* 3 Premium Trust Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PILLARS.map(({ icon: Icon, title, desc }, index) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
              className="h-full"
            >
              <div className="group relative h-full flex flex-col items-center text-center p-7 sm:p-8 bg-[#FAF6EE] border border-[#B8924A]/35 rounded-xl shadow-[0_4px_16px_rgba(94,15,30,0.04)] hover:shadow-[0_12px_28px_rgba(184,146,74,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                {/* Gold Top-Border Accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B8924A] via-[#D4AF67] to-[#B8924A]" />

                {/* Circular Badge with Gold Outline and Large Icon */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#B8924A]/50 bg-white shadow-xs flex items-center justify-center transition-all duration-300 group-hover:border-[#D4AF67] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,175,103,0.35)]">
                    <Icon
                      className="w-8 h-8 text-[#5E0F1E] transition-colors duration-300 group-hover:text-[#80601C]"
                      strokeWidth={1.4}
                    />
                  </div>
                </div>

                {/* Bolder Title */}
                <h3 className="font-serif text-xl sm:text-[1.35rem] font-medium text-[#5E0F1E] leading-snug tracking-tight">
                  {title}
                </h3>

                {/* High Contrast Readable Body Text */}
                <p className="mt-3 text-sm leading-relaxed text-[#2B2B2B]/85 font-normal">
                  {desc}
                </p>

                {/* Subtle Bottom Gold Dash */}
                <span className="mt-auto pt-5 block w-8 h-0.5 bg-[#B8924A]/30 group-hover:w-14 group-hover:bg-[#B8924A] transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slim Stats & Credentials Row */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="max-w-4xl mx-auto mt-8 sm:mt-10 pt-6 border-t border-[#B8924A]/25"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-xs sm:text-[13px] text-[#2B2B2B]/80 font-medium">
            {CREDENTIALS.map((cred, i) => (
              <div key={cred.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#B8924A]/50 -ml-3 sm:-ml-5 mr-3 sm:mr-5" />
                )}
                <cred.icon className="w-4 h-4 text-[#80601C] shrink-0" strokeWidth={1.6} />
                <span>{cred.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
