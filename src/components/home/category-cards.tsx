import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    title: "Blue Sapphires",
    image: "/isuru_images/categories1.jpg",
    link: "/gems/category/blue-sapphires",
  },
  {
    title: "Coloured Gemstones",
    image: "/isuru_images/categories2.jpg",
    link: "/gems/category/padparadscha",
  },
  {
    title: "Rough Gemstones",
    image: "/isuru_images/categories3.jpg",
    link: "/gems/category/rare-collector",
  },
];

export function CategoryCards() {
  return (
    <section className="relative z-10 -mt-20 lg:-mt-24 pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={cat.link}
            className="group relative block aspect-16/9 overflow-hidden border border-[#B8924A]/50 bg-[#1A1410] shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-colors hover:border-[#D4AF67]"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#120F0D]/90 via-[#120F0D]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 flex items-center justify-between text-[#FAF6EE]">
              <h3 className="font-serif text-xl lg:text-2xl">{cat.title}</h3>
              <ArrowRight className="w-5 h-5 text-[#D4AF67] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
