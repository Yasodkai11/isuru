"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const STEPS = [
  {
    no: "01",
    title: "Selected at the Source",
    desc: "Rough crystals hand-picked from Ratnapura's alluvial gravels, bought directly from local miners with no brokers in between.",
    image: "/isuru_images/mining.webp",
    alt: "Sri Lankan gem master examining sapphire rough at a wooden workbench overlooking the misty highlands",
  },
  {
    no: "02",
    title: "Hand-Cut by Masters",
    desc: "Faceted on traditional lapidary wheels to classical proportions, cut for brilliance rather than carat weight.",
    image: "/isuru_images/cutting.webp",
    alt: "Veteran Ceylon lapidary hand-faceting a blue sapphire on a traditional cutting wheel",
  },
  {
    no: "03",
    title: "Meticulously Inspected",
    desc: "Every gem personally examined under high-magnification microscopy to verify authentic natural crystal growth and zero artificial enhancement.",
    image: "/isuru_images/examining.webp",
    alt: "Expert gemological examination of natural Ceylon sapphire rough and cut gems",
  },
  {
    no: "04",
    title: "Destined to Be an Heirloom",
    desc: "Fully insured, door-to-door delivery worldwide, ready to become the centrepiece of a lifetime.",
    image: "/isuru_images/platinum crown.webp",
    alt: "Ornate diamond tiara set with a large oval Ceylon blue sapphire on dark velvet",
  },
];

export function CraftJourney() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="craft-journey-title"
      className="grain relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] pt-12 sm:pt-14 lg:pt-16 xl:pt-20 pb-20 lg:pb-28 xl:pb-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-[#1B3A8A]/20 blur-[140px]"
      />

      <div className="relative container-luxe">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16 lg:mb-20">
          <Reveal className="lg:col-span-7">
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#D4AF67]">
              <span className="w-8 h-px bg-[#D4AF67]" />
              Mine to Masterpiece
            </p>
            <h2
              id="craft-journey-title"
              className="mt-5 font-serif text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-normal leading-[1.05]"
            >
              The journey of a <em className="text-gold-gradient">Ceylon sapphire</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="text-base xl:text-lg font-light text-[#FAF6EE]/70 leading-relaxed">
              Over six decades of family expertise guide every stone from the riverbeds of Ratnapura to your hands.
              Every step is transparent, traceable, and done by hand.
            </p>
            <Link
              href="/about"
              className="link-underline mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF67]"
            >
              Discover our heritage
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        {/* Connecting gold line */}
        <div className="relative hidden lg:block mb-10" aria-hidden="true">
          <div className="h-px bg-[#FAF6EE]/10" />
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-px origin-left bg-linear-to-r from-[#D4AF67] via-[#F3DFA2] to-[#B8924A]"
          />
          <div className="absolute inset-0 grid grid-cols-4">
            {STEPS.map((s) => (
              <span key={s.no} className="relative">
                <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rotate-45 border border-[#D4AF67] bg-[#120F0D]" />
              </span>
            ))}
          </div>
        </div>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8" stagger={0.15}>
          {STEPS.map((step) => (
            <StaggerItem key={step.no}>
              <article className="group relative h-full">
                <div className="shine-sweep relative aspect-[3/4] overflow-hidden border border-[#D4AF67]/20 group-hover:border-[#D4AF67]/60 transition-colors duration-500">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#120F0D] via-[#120F0D]/30 to-transparent" />
                  <span className="absolute top-4 right-5 font-serif text-6xl xl:text-7xl text-transparent [-webkit-text-stroke:1px_rgba(243,223,162,0.6)] transition-colors duration-500 group-hover:text-[#D4AF67]/20">
                    {step.no}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-2xl xl:text-[1.7rem] leading-tight">{step.title}</h3>
                    <p className="mt-3 text-sm xl:text-[15px] font-light text-[#FAF6EE]/75 leading-relaxed transition-colors duration-500 group-hover:text-[#FAF6EE]/95">
                      {step.desc}
                    </p>
                    <span className="mt-4 block h-px w-10 bg-[#D4AF67] transition-all duration-700 group-hover:w-24" />
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
