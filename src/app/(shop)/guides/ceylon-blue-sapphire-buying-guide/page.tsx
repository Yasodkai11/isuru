import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout, GuideFAQ } from "@/components/guides/guide-layout";
import { SEO_CONFIG } from "@/lib/seo-config";

export const revalidate = 86400; // 24-hour ISR cache

export const metadata: Metadata = {
  title: "Ceylon Blue Sapphire Buying Guide: Royal Blue vs Cornflower, Cuts & Valuation",
  description:
    "Comprehensive gemological guide to buying natural Ceylon blue sapphires from Ratnapura, Sri Lanka. Learn color grading (Royal vs Cornflower Blue), unheated rarity, cut proportions, and market price per carat.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/guides/ceylon-blue-sapphire-buying-guide`,
  },
  openGraph: {
    title: "Ceylon Blue Sapphire Buying Guide | Isuru Ceylon Gems",
    description:
      "Expert guide on identifying, grading, and acquiring authentic unheated Ceylon sapphires direct from Sri Lanka.",
    url: `${SEO_CONFIG.site.url}/guides/ceylon-blue-sapphire-buying-guide`,
    images: [{ url: "/isuru_images/blue1.webp", width: 1200, height: 630, alt: "Natural Ceylon Blue Sapphire" }],
  },
};

const keyTakeaways = [
  "Ceylon sapphires are renowned for an open, luminous blue that does not turn inky or black under evening light.",
  "Unheated Ceylon blue sapphires command a 50% to 150%+ price premium over thermally altered stones due to extreme geological rarity.",
  "Royal Blue features rich, velvety medium-dark saturation, whereas Cornflower Blue exhibits an electric, pastel daytime vibrance.",
  "Authentic investment stones must be accompanied by independent laboratory verification (GIA, GRS, or NGJA) confirming zero heat treatment.",
];

const faqs: GuideFAQ[] = [
  {
    question: "What makes a Ceylon blue sapphire uniquely valuable?",
    directAnswer:
      "A Ceylon blue sapphire is uniquely valuable due to its open crystalline clarity, vivid natural hue, and refusal to turn dark or inky in low light. Sourced from the Precambrian metamorphic gravels of Sri Lanka, Ceylon sapphires display a luminous, velvety saturation unmatched by stones from basaltic volcanic deposits like Australia or Thailand.",
    detail:
      "Because Sri Lankan corundum contains optimal trace amounts of iron and titanium without excess iron, light travels freely through the crystalline lattice, producing brilliant internal refraction and vibrant royal blue or cornflower tones.",
  },
  {
    question: "What is the difference between Royal Blue and Cornflower Blue?",
    directAnswer:
      "Royal Blue refers to a rich, deeply saturated pure blue with subtle violet overtones and a velvety texture, traditionally favored by monarchies and investment collectors. Cornflower Blue describes a radiant, medium-toned pastel blue that mimics the vibrant petals of the cornflower, celebrated for its daylight electric brilliance.",
    detail:
      "While both grades originate from the same alluvial gravels in Ratnapura and Balangoda, Royal Blue stones generally achieve the highest per-carat auction records, while Cornflower specimens remain beloved for bespoke engagement rings.",
  },
  {
    question: "How can I verify whether a Ceylon blue sapphire is unheated?",
    directAnswer:
      "You can verify that a Ceylon blue sapphire is unheated by demanding an independent gemological report from GIA, GRS, or the National Gem and Jewellery Authority (NGJA). Gemologists inspect microscopic intact rutile needles ('silk'), undisturbed two-phase inclusions, and FTIR spectroscopy to confirm zero thermal enhancement.",
    detail:
      "When corundum is heated above 1,200°C, rutile silk dissolves into dotted lines, discoid stress fractures appear around crystals, and internal zoning alters. A genuine report explicitly states 'No indications of thermal enhancement'.",
  },
  {
    question: "How much does a natural Ceylon blue sapphire cost per carat?",
    directAnswer:
      "A natural, unheated Ceylon blue sapphire typically ranges from $1,500 to $4,500 per carat for fine commercial specimens between 1 and 2 carats, and $5,000 to $18,000+ per carat for exceptional 3 to 7+ carat unheated Royal Blue stones with top clarity and international certification.",
    detail:
      "Heated stones cost significantly less ($600 to $2,000 per carat). Prices increase exponentially once a natural unheated stone exceeds 5 carats, as large, clean crystals represent less than a fraction of one percent of annual mine output.",
  },
];

export default function CeylonBlueSapphireBuyingGuidePage() {
  return (
    <GuideLayout
      slug="ceylon-blue-sapphire-buying-guide"
      title="Ceylon Blue Sapphire Buying Guide: Royal Blue, Cornflower, Cut & Carat Valuation"
      subtitle="An authoritative gemological manual on assessing color saturation, crystalline purity, thermal enhancement, and fair investment value direct from Sri Lanka."
      description="The definitive guide to selecting natural unheated Ceylon blue sapphires from the historic gravels of Ratnapura."
      readTime="8 min"
      publishDate="2024-03-15"
      lastUpdatedDate="2026-10-22"
      image="/isuru_images/blue1.webp"
      keyTakeaways={keyTakeaways}
      faqs={faqs}
      relatedGemsHref="/gems?variety=Royal+Blue+Sapphire"
      relatedGemsLabel="View Certified Blue Sapphires"
    >
      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          1. The Sovereign Gem of Serendib: Understanding Ceylon Corundum
        </h2>
        <p>
          For over twenty-five centuries, the island nation of Sri Lanka—known historically to Arab traders as Serendib and to Roman scholars as Taprobane—has served as the premier source of precious sapphire. From King Solomon presenting Ceylon gems to the Queen of Sheba, to the legendary 12-carat Royal Blue engagement sapphire worn by Princess Diana and the Princess of Wales, Ceylon sapphires have defined royal regalia and luxury connoisseurship across generations.
        </p>
        <p>
          What distinguishes a Ceylon blue sapphire from corundum mined in Madagascar, Burma, Kashmir, or Australia is its distinctive crystalline geology. Sri Lankan sapphires formed between 550 and 600 million years ago within high-grade metamorphic granulite and gneiss belts. Over millennia, weathering eroded these primary deposits, transporting the heavy sapphire crystals into ancient alluvial river systems called <em>illam</em>.
        </p>
        <p>
          Crucially, Sri Lankan alluvial corundum crystallizes with a low-iron, high-transparency chemical matrix. Whereas basalt-hosted stones from Thailand or Australia suffer from excess iron that turns them opaque, blackish-blue, or green in artificial lighting, Ceylon sapphires preserve a bright, open luminescence that glows vividly under both midday sunlight and evening candlelight.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          2. Color Grading: Royal Blue vs. Cornflower Blue
        </h2>
        <p>
          Color is the single most decisive factor governing sapphire valuation, accounting for more than 60% of a gemstone’s market value. In gemological evaluation, color is broken down into three interdependent parameters:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Hue:</strong> The primary spectral color (blue) and any secondary tint (such as violet or green). Pure blue to slightly violetish-blue is the most prized. Greenish undertones diminish value substantially.</li>
          <li><strong>Tone:</strong> The lightness or darkness of the color. The optimal tone for Ceylon sapphires falls between 60% and 75% (medium to medium-dark). Stones lighter than 40% are classified as pastel or light blue, while stones above 85% appear inky and lifeless.</li>
          <li><strong>Saturation:</strong> The intensity, purity, and vibrancy of the hue. Strong to vivid saturation free from gray or brown masking commands top auction prices.</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
          <div className="p-5 rounded-lg bg-[#FAF6EE] border border-[#B8924A]/40 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#80601C] font-semibold block">Grade 1</span>
            <h3 className="font-serif text-xl text-[#5E0F1E]">Royal Blue Sapphire</h3>
            <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
              Deep, rich, commanding blue with an extraordinary velvety texture and intense saturation. Optimal tone sits at 70–75%. Does not darken into navy-black under evening light. The pinnacle choice for investment portfolios and heirloom rings.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-[#FAF6EE] border border-[#B8924A]/40 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#80601C] font-semibold block">Grade 2</span>
            <h3 className="font-serif text-xl text-[#5E0F1E]">Cornflower Blue Sapphire</h3>
            <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
              Medium-toned, electric pastel blue mirroring the blossom of <em>Centaurea cyanus</em>. Exhibits high crystalline transparency and lively fire with 50–60% tone. Highly sought-after for modern bespoke jewelry and day-to-night radiance.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          3. Unheated vs. Heated: The Rarity Equation
        </h2>
        <p>
          Over 95% of sapphires in today’s commercial marketplace have undergone high-temperature heat treatment (traditionally ranging from 1,200°C to 1,800°C) to artificially dissolve silk, intensify pale blue hues, and melt away cloudy inclusions. While standard thermal enhancement is widely disclosed and accepted in commercial jewelry, it permanently removes the gemstone from the ranks of authentic, unadulterated natural treasures.
        </p>
        <p>
          A completely <strong>unheated natural Ceylon blue sapphire</strong> came out of the earth exactly as mother nature perfected it millions of years ago. It required only the lapidary’s wheel to unlock its brilliance. Because less than one percent of gem-grade rough corundum emerges from Ratnapura’s pits with pristine clarity and rich native color without cooking, unheated stones command a 50% to 150%+ price premium.
        </p>
        <p>
          For collectors and engagement ring buyers seeking authentic generational value, purchasing an unheated sapphire accompanied by a recognized laboratory report (such as GIA, GRS, or the National Gem and Jewellery Authority) guarantees both historical integrity and capital appreciation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          4. Proportions & Cut: Why Ceylon Cut Matters
        </h2>
        <p>
          In traditional Sri Lankan lapidary ateliers, cutting is guided by respect for crystalline structure. Sapphires are dichroic: when viewed down the c-axis (optical axis), corundum reveals its purest blue, while viewing across the a-b axis reveals a greenish-blue tint. A master lapidary artisan meticulously orientates the table of the sapphire perpendicular to the c-axis to maximize velvety face-up color.
        </p>
        <p>
          Furthermore, superior cutting maintains precise critical angles (39.8° for corundum) to prevent windowing (light leaking through the center like a piece of glass) or extinction (dark dead zones). At Isuru Ceylon Gems, our in-house cutters in Ratnapura recut rough stones to classical symmetry, ensuring fiery scintillation and balanced proportions rather than merely cutting for heavy, awkward carat retention.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          5. Market Price Guide & Carat Weight Thresholds
        </h2>
        <p>
          Sapphire pricing is non-linear. Because natural crystals over 3 carats are exponentially rarer in alluvial deposits than smaller stones, per-carat prices jump significantly at key thresholds: 2.00 cts, 3.00 cts, 5.00 cts, and 10.00 cts.
        </p>
        <p>
          A 1.50-carat unheated Royal Blue sapphire may trade at $2,500 per carat ($3,750 total), while a 5.00-carat specimen of equivalent color and clarity will frequently command $9,000 to $14,000 per carat ($45,000 to $70,000 total). Always ensure that pricing reflects net carat weight, verified origin, and documented absence of thermal treatment.
        </p>
        <p className="pt-2">
          Ready to review authentic unheated Ceylon blue sapphires? Explore our active vault or contact our gemological concierge for private viewings at our Ratnapura bureau.
        </p>
      </section>
    </GuideLayout>
  );
}
