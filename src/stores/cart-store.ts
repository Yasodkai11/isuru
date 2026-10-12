"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Gemstone } from "@/types/gem";
import { CartState } from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (gem: Gemstone) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.gem.id === gem.id);

        // Natural gemstones are unique 1-of-1 pieces
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
    }),
    {
      name: "isuru-gems-vault-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as Storage))),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
