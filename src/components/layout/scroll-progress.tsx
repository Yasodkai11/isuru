"use client";

import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed top-0 inset-x-0 h-[2px] z-[60] bg-linear-to-r from-[#967433] via-[#F3DFA2] to-[#B8924A] will-change-transform"
    />
  );
}
