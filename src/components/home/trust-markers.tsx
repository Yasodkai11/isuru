import { Award, Gem, ShieldCheck, Truck } from "lucide-react";

const PILLARS = [
  { icon: Award, title: "NGJA Licensed", desc: "Govt. of Sri Lanka" },
  { icon: Gem, title: "100% Natural", desc: "Earth-mined, never synthetic" },
  { icon: ShieldCheck, title: "Lab Certified", desc: "GRS · GIA · SSEF" },
  { icon: Truck, title: "Insured Shipping", desc: "Worldwide, door to door" },
];

export function TrustMarkers() {
  return (
    <section className="bg-[#1A1410] text-[#FAF6EE] border-y border-[#B8924A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {PILLARS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="w-11 h-11 shrink-0 rounded-full border border-[#B8924A]/50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#D4AF67]" />
            </span>
            <div>
              <h3 className="font-serif text-lg leading-tight">{title}</h3>
              <p className="text-xs text-[#FAF6EE]/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
