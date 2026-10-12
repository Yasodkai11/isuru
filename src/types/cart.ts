import { Gemstone } from "./gem";

export interface CartItem {
  gem: Gemstone;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (gem: Gemstone) => void;
  removeItem: (gemId: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  toggleCart: () => void;
  totalAmount: () => number;
}
