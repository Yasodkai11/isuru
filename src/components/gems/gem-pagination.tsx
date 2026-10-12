"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GemPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export function GemPagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
}: GemPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pt-12 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#B8924A]/20">
      {/* Result Count Info */}
      <span className="text-xs text-[#2B2B2B]/70 tracking-wider">
        Showing <strong className="text-[#5E0F1E]">{startItem}</strong> –{" "}
        <strong className="text-[#5E0F1E]">{endItem}</strong> of{" "}
        <strong className="text-[#5E0F1E]">{totalItems}</strong> Ceylon specimens
      </span>

      {/* Page Numbers & Arrows */}
      <nav aria-label="Gemstone catalog pagination" className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="p-2 border border-[#B8924A]/30 text-[#2B2B2B] hover:text-[#5E0F1E] hover:border-[#B8924A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-[#FDFBF7]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => navigateToPage(p)}
              disabled={isPending}
              className={`min-w-9 h-9 px-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-[#5E0F1E] text-[#FAF6EE] border border-[#5E0F1E] shadow-xs"
                  : "bg-[#FDFBF7] text-[#2B2B2B] border border-[#B8924A]/30 hover:border-[#B8924A] hover:text-[#5E0F1E]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="p-2 border border-[#B8924A]/30 text-[#2B2B2B] hover:text-[#5E0F1E] hover:border-[#B8924A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-[#FDFBF7]"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
