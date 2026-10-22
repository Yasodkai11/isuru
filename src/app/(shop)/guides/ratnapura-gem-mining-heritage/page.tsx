import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout, GuideFAQ } from "@/components/guides/guide-layout";
import { SEO_CONFIG } from "@/lib/seo-config";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Ratnapura Gem Mining Heritage: Alluvial Pits, River Illam & Ethical Craft",
  description:
    "An authoritative exploration of Ratnapura (City of Gems), Sri Lanka: 2,500 years of sustainable alluvial pit mining, conical wicker basket river washing, and family craft heritage.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/guides/ratnapura-gem-mining-heritage`,
  },
  openGraph: {
    title: "Ratnapura Gem Mining Heritage | Isuru Ceylon Gems",
    description:
      "Journey into Ratnapura, the City of Gems: deep timbered pit mining, river illam washing, environmental stewardship, and generational family legacy.",
    url: `${SEO_CONFIG.site.url}/guides/ratnapura-gem-mining-heritage`,
    images: [{ url: "/isuru_images/work/work-pit-mining.webp", width: 1200, height: 630, alt: "Ratnapura Gem Mining Heritage" }],
  },
};

const keyTakeaways = [
  "Ratnapura (Sinhalese for 'City of Gems') has been the uninterrupted global epicentre of colored gemstone mining for over two millennia.",
  "Traditional Sri Lankan mining relies on manual, eco-friendly alluvial pit excavation and bamboo-reinforced timber shafts.",
  "River washing utilizes woven conical bamboo baskets (wattiya) to concentrate heavy corundum gravel without toxic chemicals.",
  "Strict National Gem and Jewellery Authority (NGJA) regulations enforce post-mining land restoration, preserving lush rainforest ecology.",
];

const faqs: GuideFAQ[] = [
  {
    question: "Where is Ratnapura located and why is it called the City of Gems?",
    directAnswer:
      "Ratnapura is the capital of the Sabaragamuwa Province in southwestern Sri Lanka, situated in the fertile river valley below Adam's Peak (Sri Pada). In Sanskrit and Sinhalese, 'Ratnapura' literally translates to 'City of Gems' (Ratna = Gem, Pura = City), so named because it sits atop one of the densest alluvial gem gravel beds on planet Earth.",
    detail:
      "For over 2,500 years, Ratnapura has yielded an astonishing variety of precious minerals from a single river basin—including Royal Blue Sapphires, Padparadschas, Rubies, Alexandrite, Cat's Eyes, Spinels, and Tourmalines.",
  },
  {
    question: "How is traditional gem mining conducted in Ratnapura?",
    directAnswer:
      "Traditional mining in Ratnapura is conducted using manual alluvial shaft pits (patal) reinforced with local timber frameworks and rubber tree leaves (kekilla). Miners excavate down 30 to 50 feet through clay layers until reaching the gem-bearing gravel layer, known as illam, which is hoisted to the surface in woven wicker buckets.",
    detail:
      "Unlike modern industrial open-cast strip mining, traditional Ratnapura shaft mining minimizes deforestation, avoids cyanide or mercury pollution, and prevents erosion of highland river systems.",
  },
  {
    question: "What is illam washing?",
    directAnswer:
      "Illam washing is the traditional artisanal process of separating heavy gemstones from light clay and sand. Gem miners submerge conical woven bamboo baskets (called wattiya) into running river currents or washing ponds, swirling the gravel rhythmically so lighter silt washes over the rim, leaving dense sapphires, rubies, and spinels concentrated at the conical bottom.",
    detail:
      "The master miner then examines the washed gravel in natural sunlight with a keen eye, hand-picking raw crystalline corundum parcels right on the riverbank.",
  },
  {
    question: "Is gemstone mining in Sri Lanka environmentally sustainable?",
    directAnswer:
      "Yes. Under the oversight of the National Gem and Jewellery Authority (NGJA), Sri Lanka enforces strict environmental conservation laws. Heavy machinery and open-pit mining are prohibited across sensitive reserves, and miners are legally bonded to refill shafts, restore topsoil, and replant vegetation once an alluvial deposit is exhausted.",
    detail:
      "This centuries-old legal tradition ensures that Sri Lanka's gem wealth does not compromise its UNESCO-listed rainforests or agricultural paddy lands.",
  },
];

export default function RatnapuraGemMiningHeritageGuidePage() {
  return (
    <GuideLayout
      slug="ratnapura-gem-mining-heritage"
      title="Ratnapura Gem Mining Heritage: Alluvial Pits, River Illam & Ethical Craft"
      subtitle="A historical and geological exploration of Sri Lanka's legendary City of Gems: 2,500 years of sustainable mining, riverbank washing, and ancestral family craft."
      description="The definitive history and practice of traditional gem mining in Ratnapura, Sri Lanka."
      readTime="9 min"
      publishDate="2024-08-15"
      lastUpdatedDate="2026-10-22"
      image="/isuru_images/work/work-pit-mining.webp"
      keyTakeaways={keyTakeaways}
      faqs={faqs}
      relatedGemsHref="/about"
      relatedGemsLabel="Read Our Family Story"
    >
      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          1. The Valley of Precious Stones: 2,500 Years of Continuous Mining
        </h2>
        <p>
          Nestled within the lush mist-shrouded valleys of the Sabaragamuwa Province, under the towering shadow of sacred Adam’s Peak (Sri Pada), lies Ratnapura—the historic "City of Gems". While historical gem deposits in Kashmir, Golconda, and Colombia have experienced boom-and-bust depletion cycles, the river gravels of Ratnapura have yielded precious corundum continuously for over two thousand five hundred years.
        </p>
        <p>
          Historical accounts from Roman historian Pliny the Elder (1st Century CE), Arabian traveler Ibn Battuta (14th Century CE), and Venetian explorer Marco Polo all recount the dazzling rubies and sovereign royal sapphires extracted from the alluvial riverbeds of Ceylon. Marco Polo famously recorded that the island possessed the most magnificent rubies in the known world, "such as were not to be found elsewhere."
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          2. The Geology of Illam: How Nature Concentrated the Gems
        </h2>
        <p>
          To understand Ratnapura’s mineralogical abundance, one must examine the deep Precambrian geology of Sri Lanka’s Highland Complex. Approximately 550 to 600 million years ago, immense tectonic pressures and temperatures deep within the continental crust crystallized aluminum, titanium, iron, and chromium into corundum.
        </p>
        <p>
          Over millions of years of monsoonal rains, rivers carved deep canyons through the highlands, eroding the hard gemstone crystals from their primary host rock. Because sapphires and rubies possess a high specific gravity (around 4.00, compared to quartz at 2.65), they did not wash out to sea. Instead, they settled into heavy layers of gravel along ancient paleoriver valleys.
        </p>
        <p>
          In Sri Lanka, this ancient gem-bearing gravel layer is known as <strong>illam</strong>. Typically buried beneath 10 to 50 feet of alluvial clay and sand, the illam contains a concentrated treasure trove of sapphires, rubies, chrysoberyl, spinel, tourmaline, zircon, and garnet.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          3. The Artisanal Shaft Mine (Gemi Pathala)
        </h2>
        <p>
          Traditional mining in Ratnapura is a communal, artisanal undertaking that respects the earth. Rather than blasting mountains with high explosives or running massive diesel excavators, miners dig vertical shafts known as <em>gemi pathala</em>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Timber Shoring:</strong> As the pit descends through water-saturated clay, miners line the vertical walls with sturdy wooden planks and jungle vines, wedging timber crossbeams to prevent collapse.</li>
          <li><strong>Natural Seepage Control:</strong> The shaft walls are packed with layers of broad jungle ferns (<em>kekilla</em>) that filter silt while allowing groundwater to enter a central collection sump, pumped out using electric water pumps.</li>
          <li><strong>Illam Extraction:</strong> Once the team strikes the gravel stratum, miners work with hand tools to shovel the illam into wicker baskets, hoisting them to the surface with hand-cranked pulleys.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          4. River Washing with Woven Wattiya Baskets
        </h2>
        <p>
          Once hoisted to the surface, the raw illam is transported to a washing site—often a calm bend in the Kalu Ganga (Black River) or a purpose-built washing canal.
        </p>
        <p>
          Miners place several shovelfuls of gravel into a <em>wattiya</em>—a shallow, conical basket woven tightly from seasoned wild bamboo strips. Submerging the basket into waist-deep water, the washer imparts a continuous swirling circular motion. The turbulent water lifts the lighter silt, quartz pebbles, and mud, washing them over the flared rim.
        </p>
        <p>
          Due to their high density, the precious corundum crystals quickly migrate to the very apex at the center bottom of the cone. With a decisive flick of the wrist, the washer lifts the basket into the golden morning sunlight. In seconds, experienced eyes identify the unmistakable electric blue, scarlet red, or lotus pink flashes of unheated natural gemstones.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
          5. Environmental Stewardship & Family Lineage
        </h2>
        <p>
          Unlike modern industrial open-pit operations in other parts of the developing world that leave poisoned toxic craters, Sri Lankan gem mining is governed by strict conservation statutes enforced by the National Gem and Jewellery Authority (NGJA). Mining licenses mandate that once an alluvial pit is exhausted, the shaft must be backfilled, topsoil restored, and original agricultural vegetation replanted.
        </p>
        <p>
          This commitment to ethical sustainability is deeply personal for Isuru Ceylon Gems. Founded on the pioneering alluvial mining roots of Reginald Mendis (born 1922) and Premaratne Pathinayake, our family has worked Ratnapura’s gravels across three generations. By partnering directly with local mining collectives and licensing under NGJA (Registration Number: <strong>202610DL42288</strong>), we preserve our island’s sacred natural heritage while bringing pure, unheated Ceylon gems directly from mine head to international connoisseurs.
        </p>
      </section>
    </GuideLayout>
  );
}
