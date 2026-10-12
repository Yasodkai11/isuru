import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "sapphire" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      disabled,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-subtle cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-[#B8924A] select-none";

    const variants = {
      primary:
        "bg-[#5E0F1E] text-[#FAF6EE] hover:bg-[#420A15] active:bg-[#320710] shadow-sm hover:shadow",
      secondary:
        "bg-[#FAF6EE] text-[#5E0F1E] border border-[#B8924A]/40 hover:bg-[#F2EADB]",
      gold:
        "bg-[#B8924A] text-[#FAF6EE] hover:bg-[#967433] active:bg-[#7D6029] shadow-sm hover:shadow",
      sapphire:
        "bg-[#1B3A8A] text-[#FAF6EE] hover:bg-[#12285E] active:bg-[#0D1D45] shadow-sm",
      outline:
        "border border-[#B8924A] text-[#5E0F1E] bg-transparent hover:bg-[#FAF6EE] hover:border-[#967433]",
      ghost:
        "text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10",
      link:
        "text-[#5E0F1E] underline-offset-4 hover:underline p-0 h-auto font-normal",
    };

    const sizes = {
      sm: "text-xs tracking-wider uppercase px-3.5 py-1.5",
      md: "text-xs uppercase tracking-[0.18em] px-6 py-3",
      lg: "text-sm uppercase tracking-[0.2em] px-8 py-3.5",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
