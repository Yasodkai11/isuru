import React from "react";
import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  withOrnament?: boolean;
}

export function GoldDivider({ className, withOrnament = false }: GoldDividerProps) {
  if (!withOrnament) {
    return (
      <div
        className={cn(
          "w-full h-[1px] bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent my-8",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center my-10", className)}>
      <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#B8924A]/50 to-[#B8924A]/70" />
      <div className="mx-4 flex items-center space-x-1.5 text-[#B8924A]">
        <span className="inline-block w-1 h-1 rotate-45 bg-[#B8924A]" />
        <span className="inline-block w-2 h-2 rotate-45 border border-[#B8924A] bg-[#FAF6EE]" />
        <span className="inline-block w-1 h-1 rotate-45 bg-[#B8924A]" />
      </div>
      <div className="flex-grow h-[1px] bg-gradient-to-l from-transparent via-[#B8924A]/50 to-[#B8924A]/70" />
    </div>
  );
}
