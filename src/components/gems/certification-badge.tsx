import React from "react";
import { Badge } from "@/components/ui/badge";
import { GemCertificate } from "@/types/gem";
import { ShieldCheck } from "lucide-react";

interface CertificationBadgeProps {
  certificate: GemCertificate;
  className?: string;
}

export function CertificationBadge({ certificate, className }: CertificationBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      <Badge variant="gold" className="text-[10px] tracking-wider font-semibold">
        <ShieldCheck className="w-3 h-3 mr-1 text-[#B8924A]" />
        {certificate.lab} Verified
      </Badge>
    </div>
  );
}
