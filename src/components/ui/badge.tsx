import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "maroon" | "sapphire" | "outline" | "subtle" | "unheated";
}

export function Badge({
  className,
  variant = "gold",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    gold: "border border-[#B8924A]/50 bg-[#B8924A]/10 text-[#5E0F1E]",
    maroon: "border border-[#5E0F1E]/30 bg-[#5E0F1E] text-[#FAF6EE]",
    sapphire: "border border-[#1B3A8A]/40 bg-[#1B3A8A]/10 text-[#1B3A8A]",
    outline: "border border-[#B8924A] text-[#5E0F1E] bg-transparent",
    subtle: "bg-[#F2EADB] text-[#5E0F1E] border border-transparent",
    unheated: "border border-[#1B3A8A]/30 bg-[#1B3A8A]/5 text-[#1B3A8A]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
