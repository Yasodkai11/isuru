import type { Metadata } from "next";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { SalonMap } from "@/components/contact/salon-map";
import { BRAND } from "@/lib/constants";
import { Mail, Phone } from "lucide-react";

interface ContactPageProps {
  searchParams: Promise<{
    gem?: string;
    id?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bespoke Commissions & Concierge | Isuru Gems Ceylon",
    description:
      "Contact the gemological concierge at Isuru Gems for loose unheated Ceylon sapphire acquisition, custom ring commissions, or private viewings in Colombo and Ratnapura.",
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;

  return (
    <main className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="container-luxe">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-14">
          <header className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="max-w-xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
                Isuru Gems Ceylon
              </span>
              <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-maroon sm:text-5xl">
                Get in touch
              </h1>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75 sm:text-lg">
                Talk with our team about a gemstone, a bespoke commission, or arranging a visit to our Colombo or Ratnapura locations.
              </p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-cream-dark lg:aspect-[5/4]">
            <Image
              src="/isuru_images/contactus.webp"
              alt="Ceylon sapphires and fine gemstones beside the historic Galle lighthouse"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[center_55%]"
            />
          </div>
          </header>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] lg:gap-14">
            <section className="border border-gold/25 bg-cream-light p-6 sm:p-9" aria-labelledby="inquiry-heading">
              <div className="mb-7">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dark">
                  Private inquiry
                </span>
                <h2 id="inquiry-heading" className="mt-2 font-serif text-2xl font-normal text-maroon sm:text-3xl">
                  How can we help?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  Share a few details and our team will be in touch.
                </p>
              </div>

              <InquiryForm
                initialGemName={resolvedParams.gem}
                initialGemId={resolvedParams.id}
              />
            </section>

            <aside className="space-y-8">
              <section aria-labelledby="direct-contact-heading">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dark">
                  Prefer to speak directly?
                </span>
                <h2 id="direct-contact-heading" className="mt-2 font-serif text-2xl font-normal text-maroon">
                  Contact our team
                </h2>
                <div className="mt-5 divide-y divide-gold/20 border-y border-gold/20">
                  <a
                    href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-3 py-4 text-sm text-charcoal transition-colors hover:text-maroon"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                    <span><span className="block text-xs text-charcoal/55">Call</span>{BRAND.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-4 text-sm text-charcoal transition-colors hover:text-maroon"
                  >
                    <Image
                      src="/isuru_images/whatsapp.png"
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] shrink-0 object-contain"
                    />
                    <span><span className="block text-xs text-charcoal/55">WhatsApp</span>{BRAND.whatsapp}</span>
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="flex items-center gap-3 py-4 text-sm text-charcoal transition-colors hover:text-maroon"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                    <span><span className="block text-xs text-charcoal/55">Email</span>{BRAND.email}</span>
                  </a>
                </div>
              </section>

              <SalonMap />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
