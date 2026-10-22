import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout, GuideFAQ } from "@/components/guides/guide-layout";
import { SEO_CONFIG } from "@/lib/seo-config";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Pigeon Blood Ruby Guide: Chromium Fluorescence, Ceylon vs Burma & Pricing",
  description:
    "An authoritative gemological guide to natural Pigeon Blood rubies. Understand the physics of chromium fluorescence, color criteria, Ceylon ruby characteristics, and valuation.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/guides/pigeon-blood-ruby-guide`,
  },
  openGraph: {
    title: "Pigeon Blood Ruby Guide: The Glowing King of Gems | Isuru Ceylon Gems",
    description:
      "Expert gemological guide on identifying authentic Pigeon Blood rubies: fluorescence, clarity grading, unheated rarity, and valuation.",
    url: `${SEO_CONFIG.site.url}/guides/pigeon-blood-ruby-guide`,
    images: [{ url: "/isuru_images/ruby%20category.webp", width: 1200, height: 630, alt: "Natural Pigeon Blood Ruby" }],
  },
};

const keyTakeaways = [
  "Pigeon Blood designates an intensely saturated, vivid pure red with subtle blue/scarlet undertones and dramatic chromium fluorescence.",
  "Ceylon rubies possess exceptional crystalline transparency and high luminescence, avoiding the dark or brownish overtones found in basaltic rubies.",
  "Natural unheated rubies above 2 carats with verifiable Pigeon Blood reports represent some of the highest price-per-carat colored stones in world auction history.",
  "Fracture filling (lead glass) is rampant in commercial markets; unheated authentication from GIA, GRS, or NGJA is essential.",
];

const faqs: GuideFAQ[] = [
  {
    question: "What is a Pigeon Blood ruby?",
    directAnswer:
      "A Pigeon Blood ruby is the most prestigious and valuable color designation in corundum, describing a vivid, intensely saturated pure red with a glowing scarlet fluorescence. Historically derived from the Burmese term 'ko-twe' (resembling the vivid arterial blood of a freshly severed pigeon), the term today signifies top-tier red corundum certified by major gemological laboratories.",
    detail:
      "The color must be a pure, fiery red free from noticeable secondary brown or purple masks, displaying strong internal luminescence under long-wave ultraviolet light.",
  },
  {
    question: "What gives a Pigeon Blood ruby its distinctive glow?",
    directAnswer:
      "Pigeon Blood rubies owe their dramatic internal glow to high concentrations of chromium (Cr³⁺) paired with exceptionally low concentrations of iron. When excited by ultraviolet rays present in ordinary natural sunlight, the chromium electrons fluoresce intensely in the red spectrum (around 694 nm), making the stone appear to glow from within like a live burning coal.",
    detail:
      "In high-iron rubies (such as those from Thailand or Cambodia), iron quenches the fluorescence, causing the stone to appear darker and less lively.",
  },
  {
    question: "How do Ceylon rubies compare to Burmese rubies?",
    directAnswer:
      "Ceylon rubies from Sri Lanka are renowned for superior crystalline clarity, open brilliance, and radiant pinkish-scarlet to deep crimson hues. While historic Burmese rubies from Mogok often contain dense silk that produces a sleepy velvety texture, Ceylon rubies display unmatched transparency and luminous internal sparkle.",
    detail:
      "As high-quality Burmese stones have become virtually unobtainable due to depleted mines and international embargoes, authentic unheated Ceylon rubies from Ratnapura have appreciated rapidly among connoisseurs.",
  },
  {
    question: "How much does a natural unheated Pigeon Blood ruby cost?",
    directAnswer:
      "Natural unheated rubies certified as Pigeon Blood or Royal Red command $4,000 to $12,000 per carat for 1 to 2 carat stones, and $15,000 to $50,000+ per carat for rare gem-quality specimens exceeding 3 to 5 carats with top transparency and international laboratory dossiers.",
    detail:
      "Large unheated rubies above 5 carats are rarer than diamonds of equivalent size, regularly setting multi-million dollar records at international auction houses.",
  },
];

export default function PigeonBloodRubyGuidePage() {
  return (
    <GuideLayout
      slug="pigeon-blood-ruby-guide"
      title="Pigeon Blood Ruby Guide: Chromium Fluorescence, Ceylon vs. Burma & Pricing"
      subtitle="A master gemological manual on the King of Gems: fluorescence physics, color saturation benchmarks, inclusion signatures, and heirloom acquisition."
      description="The definitive guide to natural unheated Pigeon Blood rubies direct from Sri Lanka."
      readTime="8 min"
      publishDate="2024-06-12"
      lastUpdatedDate="2026-10-22"
      image="/isuru_images/ruby%20category.webp"
      keyTakeaways={keyTakeaways}
      faqs={faqs}
      relatedGemsHref="/gems?variety=Ruby"
      relatedGemsLabel="Explore Certified Rubies"
    >
      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          1. The King of Precious Gems: History & Lore
        </h2>
        <p>
          Throughout antiquity, ruby has been revered as <em>Ratnaraj</em>—the "King of Precious Stones" in classical Sanskrit. While sapphire, emerald, and diamond hold profound esteem, ruby has historically occupied the absolute apex of valuation in Asian and European royal courts alike.
        </p>
        <p>
          Among all rubies, the legendary color classification "Pigeon Blood" stands as the pinnacle of desire. Originating from ancient Burmese gem trading vocabulary (<em>ko-twe</em>), the title does not refer to the literal color of a bird’s blood, but rather describes a vivid, fiery red that evokes the vivid scarlet center of an untarnished drop of arterial blood, characterized by intense internal luminescence.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          2. The Physics of Chromium: Why Fine Rubies Glow
        </h2>
        <p>
          The fundamental science behind a Pigeon Blood ruby lies in atomic substitution within the aluminum oxide (Al₂O₃) corundum crystal lattice. When a minute fraction of aluminum atoms are replaced during geological formation by chromium (Cr³⁺) ions, red coloration is born.
        </p>
        <p>
          However, chromium imparts an extraordinary physical phenomenon: <strong>fluorescence</strong>. When chromium atoms absorb blue and ultraviolet wavelengths present in ordinary ambient daylight, they do not merely reflect the light; they absorb the energy and re-emit it as pure, coherent red light at approximately 692.8 nm and 694.3 nm.
        </p>
        <p>
          In low-iron environments—such as the marble-associated and granulite metamorphic deposits of Sri Lanka and Burma—there are insufficient iron atoms to "quench" or absorb this fluorescence. As a consequence, a genuine Pigeon Blood ruby literally glows from within, appearing as though an internal ember were illuminated inside the stone.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          3. Ceylon Rubies vs. Burmese Rubies: A Modern Perspective
        </h2>
        <p>
          Historically, Mogok in Burma was celebrated for producing velvety Pigeon Blood rubies. However, geological depletion, political turmoil, and international trade restrictions have rendered fine Burmese rubies almost non-existent in modern primary markets.
        </p>
        <p>
          Sri Lanka—long recognized as the Island of Gems—produces rubies from the alluvial gravels of Ratnapura that offer distinct optical advantages:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Superior Crystalline Clarity:</strong> While Burmese rubies frequently suffer from dense, cloudy rutile silk and heavy calcite inclusions, Ceylon rubies are noted for pristine water-like transparency and lively internal light return.</li>
          <li><strong>Brilliant Scarlet Fire:</strong> Ceylon rubies frequently feature an open, bright scarlet-to-cherry hue that maintains vibrant sparkle in dim candlelight without darkening into brown or black.</li>
          <li><strong>Conflict-Free Ethical Traceability:</strong> Sri Lankan rubies are mined under strict environmental licensing managed by the National Gem and Jewellery Authority (NGJA), guaranteeing ethical sourcing and conflict-free provenance.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          4. Laboratory Standards for "Pigeon Blood" Certification
        </h2>
        <p>
          Because of the immense commercial value associated with the term, international testing houses (GRS, GIA, Gubelin, and SSEF) have codified strict color master stones to define "Pigeon Blood":
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Strict Red Hue:</strong> The stone must be pure red. Minor purplish or pinkish overtones are tolerated only if red unmistakably dominates. Noticeable orange or brown overtones instantly disqualify the stone.</li>
          <li><strong>Medium-Strong to Vivid Saturation:</strong> Pale pink stones are classified as pink sapphires, not rubies. The transition from pink sapphire to ruby requires deep, rich saturation.</li>
          <li><strong>Strong UV Fluorescence:</strong> The stone must exhibit medium to strong red fluorescence under 365 nm long-wave ultraviolet light.</li>
          <li><strong>No Major Clarity or Fissure Treatments:</strong> Stones containing lead-glass, resin, or heavy flux healing are rejected from receiving high-grade color comments.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          5. Market Valuation & Investment Guidance
        </h2>
        <p>
          Because clean, unheated red corundum rough is exponentially rarer than blue sapphire rough, per-carat valuations for authentic unheated rubies are among the highest in the entire gemological kingdom. While a 1-carat fine unheated ruby trades from $3,000 to $7,000, exceptional 3 to 5-carat specimens frequently command $20,000 to $60,000+ per carat.
        </p>
        <p>
          At Isuru Ceylon Gems, every ruby in our vault is individually hand-graded and laboratory-certified, offering clients the reassurance of authentic Sri Lankan origin and unheated purity.
        </p>
      </section>
    </GuideLayout>
  );
}
