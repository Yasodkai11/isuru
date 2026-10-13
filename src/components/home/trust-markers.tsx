import { Award, Gem, ShieldCheck, Truck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CERTIFICATIONS } from "@/lib/constants";

const PILLARS = [
  { icon: Award, title: "NGJA Licensed", desc: "Registered exporter with the National Gem & Jewellery Authority, Govt. of Sri Lanka." },
  { icon: Gem, title: "100% Natural", desc: "Earth-mined Ceylon gemstones only. We have a zero-synthetic policy, always." },
  { icon: ShieldCheck, title: "Lab Certified", desc: "Independent reports from GIA, GRS and SSEF accompany every significant stone." },
  { icon: Truck, title: "Insured Shipping", desc: "Fully insured, tracked, door-to-door delivery to collectors worldwide." },
];

export function TrustMarkers() {
  return (
    <section className="relative bg-[#F2EADB] border-y border-[#B8924A]/25 py-20 lg:py-28 overflow-hidden">
      <div className="container-luxe">
        <Reveal className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[#B8924A]">The Isuru Promise</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Trusted by collectors <em className="text-[#B8924A]">worldwide</em>
          </h2>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#B8924A]/20 border border-[#B8924A]/20">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="h-full">
              <div className="group h-full bg-[#F2EADB] hover:bg-[#FDFBF7] p-8 xl:p-10 transition-colors duration-500 text-center">
                <span className="relative mx-auto w-16 h-16 xl:w-20 xl:h-20 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-[#B8924A]/40 transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute inset-1.5 rounded-full border border-dashed border-[#B8924A]/50 transition-transform duration-[1500ms] ease-out group-hover:rotate-180" />
                  <Icon className="w-6 h-6 xl:w-7 xl:h-7 text-[#5E0F1E]" strokeWidth={1.3} />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-[#5E0F1E]">{title}</h3>
                <p className="mt-3 text-sm xl:text-[15px] font-light text-[#2B2B2B]/70 leading-relaxed max-w-xs mx-auto">
                  {desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-14 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#2B2B2B]/50">Certified by</span>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 xl:gap-x-16">
            {CERTIFICATIONS.map((c) => (
              <li
                key={c.code}
                title={c.name}
                className="font-serif text-2xl xl:text-3xl tracking-[0.15em] text-[#2B2B2B]/40 hover:text-[#5E0F1E] transition-colors duration-500 cursor-default"
              >
                {c.code}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
