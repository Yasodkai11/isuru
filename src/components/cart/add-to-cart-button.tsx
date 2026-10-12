"use client";

import React, { useState } from "react";
import { Gemstone } from "@/types/gem";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Lock, Check } from "lucide-react";

interface AddToCartButtonProps {
  gem: Gemstone;
  className?: string;
  variant?: "primary" | "gold" | "outline";
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  gem,
  className,
  variant = "primary",
  size = "md",
}: AddToCartButtonProps) {
  const { addItem, items } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some((item) => item.gem.id === gem.id);

  const handleAdd = () => {
    addItem(gem);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAdd}
    >
      {justAdded ? (
        <span className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added to Vault</span>
        </span>
      ) : isInCart ? (
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#B8924A]" />
          <span>In Your Vault</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Acquire Gemstone</span>
        </span>
      )}
    </Button>
  );
}
