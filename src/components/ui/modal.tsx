"use client";

import * as React from "react";
import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2B2B2B]/60 backdrop-blur-xs transition-opacity animate-gentle-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog card */}
      <div
        className={cn(
          "relative w-full bg-[#FAF6EE] border border-[#B8924A]/40 shadow-2xl p-6 sm:p-8 z-10 animate-gentle-fade text-[#2B2B2B]",
          sizeClasses[size],
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#5E0F1E] hover:text-[#420A15] hover:bg-[#B8924A]/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-5 pr-8 space-y-1.5 border-b border-[#B8924A]/20 pb-4">
            {title && (
              <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content body */}
        <div className="py-2">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-[#B8924A]/20 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
