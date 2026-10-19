"use client";

import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatGemCarats, formatGemPrice } from "@/lib/utils";
import type { Gemstone } from "@/types/gem";

type GemEnquiryDetails = Omit<
  Pick<
    Gemstone,
    "name" | "variety" | "carat" | "origin" | "cut" | "treatment" | "price" | "currency" | "certificate"
  >,
  "certificate"
> & { certificate: Pick<Gemstone["certificate"], "lab"> };

const EnquiryContext = createContext<((gem: GemEnquiryDetails) => void) | null>(null);

export function FeaturedGemEnquiryProvider({ children }: { children: ReactNode }) {
  const [selectedGem, setSelectedGem] = useState<GemEnquiryDetails | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setSelectedGem(null);
      setEnquirySuccess(false);
      setEnquiryName("");
      setEnquiryEmail("");
      setEnquiryPhone("");
    }, 2200);
  };

  return (
    <EnquiryContext.Provider value={setSelectedGem}>
      {children}
      {selectedGem && (
        <Modal
          isOpen
          onClose={() => setSelectedGem(null)}
          title={`Enquire: ${selectedGem.name}`}
          description={[
            formatGemCarats(selectedGem.carat),
            selectedGem.variety,
            selectedGem.certificate.lab && `${selectedGem.certificate.lab} certified`,
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
                We&apos;ll be in touch about {selectedGem.name} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="p-3 bg-[#F2EADB]/60 border border-[#B8924A]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">
                    {formatGemCarats(selectedGem.carat)} • {selectedGem.cut}
                  </span>
                  <span className="text-[#2B2B2B]/70">Origin: {selectedGem.origin}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#1B3A8A] font-serif text-base block">
                    {formatGemPrice(selectedGem.price, selectedGem.currency)}
                  </span>
                  <Badge variant="unheated" className="text-[9px]">
                    {selectedGem.treatment}
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
                  onChange={(event) => setEnquiryName(event.target.value)}
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
                  onChange={(event) => setEnquiryEmail(event.target.value)}
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
                  onChange={(event) => setEnquiryPhone(event.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div className="pt-2 flex justify-end border-t border-[#B8924A]/20">
                <Button type="submit" variant="primary" size="sm">
                  Send Enquiry
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </EnquiryContext.Provider>
  );
}

export function GemEnquiryButton({ gem }: { gem: GemEnquiryDetails }) {
  const openEnquiry = useContext(EnquiryContext);

  if (!openEnquiry) {
    throw new Error("GemEnquiryButton must be rendered within FeaturedGemEnquiryProvider");
  }

  return (
    <button
      onClick={() => openEnquiry(gem)}
      className="border border-[#B8924A] text-[#5E0F1E] hover:bg-[#5E0F1E] hover:border-[#5E0F1E] hover:text-[#FAF6EE] text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 transition-colors duration-300 cursor-pointer"
    >
      Enquire
    </button>
  );
}