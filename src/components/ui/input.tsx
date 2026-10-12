import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#B8924A]">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full bg-[#FDFBF7] border border-[#B8924A]/40 px-3.5 py-2 text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none focus:ring-1 focus:ring-[#B8924A] disabled:cursor-not-allowed disabled:opacity-50 transition-subtle",
              startIcon && "pl-10",
              endIcon && "pr-10",
              error && "border-red-600 focus:border-red-600 focus:ring-red-600",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 flex items-center text-[#B8924A]">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-600 animate-gentle-fade">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
