const ITEMS = [
  "Royal Blue Sapphire",
  "Padparadscha",
  "Pigeon Blood Ruby",
  "Alexandrite",
  "Star Sapphire",
  "Pushparaga",
  "Cornflower Blue",
  "Flame Spinel",
];

function Diamond() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 text-[#D4AF67]" fill="currentColor">
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  );
}

export function GemMarquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-label="Ceylon gemstone varieties"
      className="relative overflow-hidden bg-[#120F0D] border-t border-b border-[#B8924A]/20 py-3.5 sm:py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 z-10 bg-linear-to-r from-[#120F0D] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 z-10 bg-linear-to-l from-[#120F0D] to-transparent" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12" aria-hidden={i >= ITEMS.length}>
            <span className="font-serif italic text-2xl sm:text-3xl xl:text-4xl text-[#FAF6EE]/90 whitespace-nowrap">
              {item}
            </span>
            <Diamond />
          </div>
        ))}
      </div>
    </section>
  );
}
