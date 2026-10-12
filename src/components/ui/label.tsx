import * as React from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-xs uppercase tracking-wider font-medium text-[#2B2B2B]/80 select-none block mb-1.5",
        className
      )}
      {...props}
    />
  );
}
