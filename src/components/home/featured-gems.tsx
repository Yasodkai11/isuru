"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatGemCarats, formatGemPrice } from "@/lib/utils";
import { ArrowRight, Eye, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FeaturedGemsProps {
  gems: Gemstone[];
}

export function FeaturedGems({ gems }: FeaturedGemsProps) {
  const reduce = useReducedMotion();
  const [selectedGemForEnquiry, setSelectedGemForEnquiry] = useState<Gemstone | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setSelectedGemForEnquiry(null);
      setEnquirySuccess(false);
      setEnquiryName("");
      setEnquiryEmail("");
      setEnquiryPhone("");
    }, 2200);
  };

  return (
    <section className="relative pt-8 pb-24 lg:pb-32 bg-[#FAF6EE] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-24 w-[42rem] h-[42rem] rounded-full bg-[#1B3A8A]/[0.06] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-0 w-[36rem] h-[36rem] rounded-full bg-[#B8924A]/[0.08] blur-[100px]"
      />

      <div className="relative container-luxe">
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <Reveal className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <p className="flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-[0.35em] text-[#B8924A]">
              <span className="w-8 h-px bg-[#B8924A]" />
              The Vault Selection
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl xl:text-6xl text-[#5E0F1E] font-normal leading-[1.05]">
              Featured <em className="text-[#B8924A]">Gemstones</em>
            </h2>
            <p className="mt-5 text-base xl:text-lg font-light text-[#2B2B2B]/70 leading-relaxed">
              Hand-selected, laboratory-certified specimens from our Ratnapura atelier, each one traceable
              from mine head to final polish.
            </p>
          </Reveal>
        </div>

        {/* Gemstones Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
          <AnimatePresence mode="popLayout">
          {gems.slice(0, 8).map((gem, index) => {
            const primaryImage = gem.images[0] || {
              url: "/isuru_images/blue1.jpg",
              alt: `${gem.name}`,
            };

            return (
              <motion.article
                key={gem.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: reduce ? 0 : (index % 4) * 0.08, ease: EASE }}
                className={`group bg-[#FDFBF7] border border-[#B8924A]/25 overflow-hidden transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1.5 hover:border-[#B8924A]/80 hover:shadow-[0_30px_60px_-20px_rgba(94,15,30,0.28)] flex-col justify-between ${
                  index >= 6 ? "hidden 2xl:flex" : "flex"
                }`}
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="shine-sweep relative aspect-4/3 w-full bg-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/20">
                    <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || `${gem.name} from ${gem.origin}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-linear-to-t from-[#120F0D]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="absolute left-1/2 bottom-4 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 inline-flex items-center gap-2 bg-[#FAF6EE]/95 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#5E0F1E] whitespace-nowrap">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </span>
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      <Badge variant="maroon" className="text-[9px] py-0.5 px-2">
                        {gem.origin.split(/[\s,]/)[0]}
                      </Badge>
                      {gem.treatment.toLowerCase().includes("unheated") && (
                        <Badge variant="unheated" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                          100% Unheated
                        </Badge>
                      )}
                    </div>

                    {gem.certificate.lab && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <Badge variant="gold" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                          {gem.certificate.lab}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Gem Details */}
                  <div className="p-5 xl:p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8924A] font-medium uppercase tracking-[0.18em]">
                      <span className="truncate pr-2">{gem.variety}</span>
                      <span className="text-[#1B3A8A] font-semibold shrink-0">{formatGemCarats(gem.carat)}</span>
                    </div>

                    <h3 className="font-serif text-xl xl:text-[1.35rem] font-normal text-[#5E0F1E] group-hover:text-[#420A15] transition-colors leading-snug line-clamp-2 min-h-[2.8em]">
                      <Link href={`/gems/${gem.slug}`}>{gem.name}</Link>
                    </h3>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 xl:p-6 pt-0 xl:pt-0">
                  <div className="pt-4 border-t border-[#B8924A]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#2B2B2B]/50 block">Price</span>
                      <span className="font-serif text-xl xl:text-2xl text-[#1B3A8A]">
                        {formatGemPrice(gem.price, gem.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGemForEnquiry(gem)}
                        className="border border-[#B8924A] text-[#5E0F1E] hover:bg-[#5E0F1E] hover:border-[#5E0F1E] hover:text-[#FAF6EE] text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 transition-colors duration-300 cursor-pointer"
                      >
                        Enquire
                      </button>

                      <Link
                        href={`/gems/${gem.slug}`}
                        className="p-2.5 border border-[#B8924A]/30 text-[#2B2B2B] hover:text-[#5E0F1E] hover:border-[#B8924A] transition-colors"
                        aria-label={`View full details of ${gem.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <Reveal className="text-center mt-16">
          <Link
            href="/gems"
            className="modern-pill-primary group shadow-lg"
          >
            <span>View Complete Vault</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF67] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      {/* Quick Gemstone Enquiry Modal */}
      {selectedGemForEnquiry && (
        <Modal
          isOpen={!!selectedGemForEnquiry}
          onClose={() => setSelectedGemForEnquiry(null)}
          title={`Enquire: ${selectedGemForEnquiry.name}`}
          description={[
            formatGemCarats(selectedGemForEnquiry.carat),
            selectedGemForEnquiry.variety,
            selectedGemForEnquiry.certificate.lab && `${selectedGemForEnquiry.certificate.lab} certified`,
          ]
            .filter(Boolean)
            .join(" · ")}
          size="md"
        >
          {enquirySuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#B8924A]/20 text-[#5E0F1E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#5E0F1E]" />
              </div>
              <h4 className="font-serif text-2xl text-[#5E0F1E]">Enquiry Sent</h4>
              <p className="text-xs text-[#2B2B2B]/80 max-w-sm mx-auto">
                We&apos;ll be in touch about {selectedGemForEnquiry.name} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 pt-2">
              <div className="p-3 bg-[#F2EADB]/60 border border-[#B8924A]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">
                    {formatGemCarats(selectedGemForEnquiry.carat)} • {selectedGemForEnquiry.cut}
                  </span>
                  <span className="text-[#2B2B2B]/70">Origin: {selectedGemForEnquiry.origin}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#1B3A8A] font-serif text-base block">
                    {formatGemPrice(selectedGemForEnquiry.price, selectedGemForEnquiry.currency)}
                  </span>
                  <Badge variant="unheated" className="text-[9px]">
                    {selectedGemForEnquiry.treatment}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Your Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Dr. Arthur C. Clarke"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="collector@domain.com"
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Telephone / WhatsApp (Optional)
                </label>
                <Input
                  placeholder="+1 (555) 019-2834"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#B8924A]/20">
                <span className="text-[10px] text-[#2B2B2B]/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>NGJA Licensed Custody</span>
                </span>
                <Button type="submit" variant="primary" size="sm">
                  Send Enquiry
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </section>
  );
}
