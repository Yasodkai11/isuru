"use client";

import { create } from "zustand";
import { Gemstone } from "@/types/gem";
import { CartState } from "@/types/cart";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (gem: Gemstone) => {
    const currentItems = get().items;
    const exists = currentItems.some((item) => item.gem.id === gem.id);

    // Each natural gemstone is unique, so we only allow adding one unique piece
    if (!exists) {
      set({
        items: [...currentItems, { gem, addedAt: new Date().toISOString() }],
        isOpen: true,
      });
    } else {
      set({ isOpen: true });
    }
  },

  removeItem: (gemId: string) => {
    set({
      items: get().items.filter((item) => item.gem.id !== gemId),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open });
  },

  toggleCart: () => {
    set({ isOpen: !get().isOpen });
  },

  totalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.gem.price, 0);
  },
}));
